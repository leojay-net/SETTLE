// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import {PaymentPortal} from "../src/PaymentPortal.sol";
import {SettlementVault} from "../src/SettlementVault.sol";

import {MockCCIPRouter} from "@chainlink/contracts-ccip/contracts/test/mocks/MockRouter.sol";
import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";

contract DummyERC20 is IERC20 {
    string public name = "Dummy";
    string public symbol = "DUM";
    uint8 public decimals = 18;
    uint256 public override totalSupply;
    mapping(address => uint256) public override balanceOf;
    mapping(address => mapping(address => uint256)) public override allowance;

    function transfer(address to, uint256 amount) external override returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    function approve(address spender, uint256 amount) external override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        if (allowed != type(uint256).max) allowance[from][msg.sender] = allowed - amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }
    function mint(address to, uint256 amount) external {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }
}

contract PaymentFlowTest is Test {
    // constants from supportedtokens.md
    uint64 constant CHAIN_SEPOLIA = 16015286601757825753; // dest example
    uint64 constant CHAIN_BASE_SEPOLIA = 10344971235874465080;
    uint64 constant CHAIN_LISK_SEPOLIA = 5298399861320400553;

    MockCCIPRouter router;
    SettlementVault vault;
    PaymentPortal portal;
    DummyERC20 payToken;

    address merchant = address(0xBEEF);
    bytes32 merchantId = keccak256("merchant-1");

    function setUp() public {
        router = new MockCCIPRouter();
        vault = new SettlementVault(address(router));
        portal = new PaymentPortal(address(router), address(0)); // no LINK in tests
        payToken = new DummyERC20();

        portal.allowPaymentToken(address(payToken), true);
    }

    function test_NativePaymentAndSettlement() public {
        bytes32 invoiceId = keccak256("INV-001");
        uint256 amount = 0.5 ether;
        portal.createInvoice(invoiceId, merchantId, address(0), amount, CHAIN_BASE_SEPOLIA, address(vault));

        // pay with native
        vm.deal(address(this), 1 ether);
        portal.pay{value: amount}(invoiceId);

        // send settlement (router mock will execute locally on vault)
        bytes32 msgId = portal.sendSettlement{value: 0}(invoiceId, 300_000);
        assertTrue(msgId != bytes32(0));

        // verify vault recorded
        (bytes32 mid, address payer,,,,) = _getSettlement(invoiceId);
        assertEq(mid, merchantId);
        assertEq(payer, address(this));
    }

    function test_ERC20PaymentAndSettlement() public {
        bytes32 invoiceId = keccak256("INV-002");
        uint256 amount = 1e18;
        payToken.mint(address(this), amount);
        payToken.approve(address(portal), amount);
        portal.createInvoice(invoiceId, merchantId, address(payToken), amount, CHAIN_SEPOLIA, address(vault));

        portal.pay(invoiceId);
        bytes32 msgId = portal.sendSettlement(invoiceId, 250_000);
        assertTrue(msgId != bytes32(0));

        (bytes32 mid,, address token, uint256 amt,,) = _getSettlement(invoiceId);
        assertEq(mid, merchantId);
        assertEq(token, address(payToken));
        assertEq(amt, amount);
    }

    function _getSettlement(bytes32 invoiceId)
        internal
        view
        returns (bytes32 mid, address payer, address token, uint256 amount, uint64 srcSel, bytes32 msgId)
    {
        (bytes32 _mid, address _payer, address _token, uint256 _amount, uint64 _src, bytes32 _msgId, uint256 _ts) =
            vault.settlements(invoiceId);
        return (_mid, _payer, _token, _amount, _src, _msgId);
    }
}
