// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/token/ERC20/utils/SafeERC20.sol";

interface ILinkToken {
    function transferAndCall(address to, uint256 value, bytes calldata data) external returns (bool);
}

/// @title SETTLE PaymentPortal
/// @notice Accepts customer payments (native or ERC20) and forwards proof + funds to merchant vault cross-chain via CCIP.
contract PaymentPortal is Ownable {
    using SafeERC20 for IERC20;

    struct Invoice {
        address payer;
        address token; // address(0) for native
        uint256 amount;
        uint64 destChainSelector; // target chain selector for settlement
        bytes32 merchantId; // off-chain merchant identifier
        address settlementVault; // vault on source (if same chain) or used as receiver on dest
        bool settled;
    }

    event InvoiceCreated(bytes32 indexed invoiceId, bytes32 indexed merchantId, address indexed payer, address token, uint256 amount, uint64 destChainSelector, address settlementVault);
    event InvoicePaid(bytes32 indexed invoiceId, address indexed payer, address token, uint256 amount);
    event SettlementSent(bytes32 indexed invoiceId, bytes32 messageId);

    error InvalidAmount();
    error UnsupportedToken();
    error InvalidReceiver();
    error AlreadySettled();

    IRouterClient public router;
    ILinkToken public linkToken; // optional fee token when paying in LINK

    // simple allowlist for accepted payment tokens on this chain
    mapping(address => bool) public allowedPaymentToken;
    // invoices
    mapping(bytes32 => Invoice) public invoices;

    // prefer paying fees in LINK when true and LINK is funded, else native
    bool public preferLINKFees = true;

    constructor(address _router, address _link) Ownable(msg.sender) {
        router = IRouterClient(_router);
        linkToken = ILinkToken(_link);
    }

    function setRouter(address _router) external onlyOwner { router = IRouterClient(_router); }
    function setLink(address _link) external onlyOwner { linkToken = ILinkToken(_link); }
    function setPreferLINKFees(bool v) external onlyOwner { preferLINKFees = v; }
    function allowPaymentToken(address token, bool allowed) external onlyOwner { allowedPaymentToken[token] = allowed; }

    /// @notice Merchant/backend registers an invoice prior to payment.
    function createInvoice(
        bytes32 invoiceId,
        bytes32 merchantId,
        address token,
        uint256 amount,
        uint64 destChainSelector,
        address settlementVault
    ) external onlyOwner {
        if (settlementVault == address(0)) revert InvalidReceiver();
        if (amount == 0) revert InvalidAmount();
        if (token != address(0) && !allowedPaymentToken[token]) revert UnsupportedToken();
        Invoice storage inv = invoices[invoiceId];
        require(inv.amount == 0, "invoice exists");

        invoices[invoiceId] = Invoice({
            payer: address(0),
            token: token,
            amount: amount,
            destChainSelector: destChainSelector,
            merchantId: merchantId,
            settlementVault: settlementVault,
            settled: false
        });

        emit InvoiceCreated(invoiceId, merchantId, address(0), token, amount, destChainSelector, settlementVault);
    }

    /// @notice Customer pays the invoice in the specified token/native.
    function pay(bytes32 invoiceId) external payable {
        Invoice storage inv = invoices[invoiceId];
        if (inv.amount == 0) revert InvalidAmount();
        if (inv.settled) revert AlreadySettled();

        if (inv.token == address(0)) {
            // native
            if (msg.value != inv.amount) revert InvalidAmount();
        } else {
            if (msg.value != 0) revert InvalidAmount();
            IERC20(inv.token).safeTransferFrom(msg.sender, address(this), inv.amount);
        }

        inv.payer = msg.sender;
        emit InvoicePaid(invoiceId, msg.sender, inv.token, inv.amount);
    }

    /// @notice Sends settlement intent to destination chain Vault via CCIP, including invoice details.
    /// @dev For prototype: we send data message only; real settlement tokenization/bridging handled off-chain or on dest.
    function sendSettlement(bytes32 invoiceId, uint256 gasLimit) external payable onlyOwner returns (bytes32 messageId) {
        Invoice storage inv = invoices[invoiceId];
        if (inv.amount == 0) revert InvalidAmount();
        if (inv.settled) revert AlreadySettled();

        // encode receiver (dest chain vault)
        bytes memory receiver = abi.encode(inv.settlementVault);

        bytes memory data = abi.encode(
            invoiceId,
            inv.merchantId,
            inv.payer,
            inv.token,
            inv.amount
        );

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: receiver,
            data: data,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(Client.EVMExtraArgsV1({gasLimit: gasLimit})),
            feeToken: _feeToken()
        });

        uint256 fee = router.getFee(inv.destChainSelector, message);
        _payFees(fee);

        messageId = router.ccipSend{value: message.feeToken == address(0) ? fee : 0}(inv.destChainSelector, message);
        inv.settled = true;
        emit SettlementSent(invoiceId, messageId);
    }

    function _feeToken() internal view returns (address) {
        if (preferLINKFees && address(linkToken) != address(0)) return address(linkToken);
        return address(0); // native
    }

    function _payFees(uint256 fee) internal {
        if (fee == 0) return;
        address feeToken = _feeToken();
        if (feeToken == address(0)) {
            require(msg.value >= fee, "insufficient native for fee");
        } else {
            linkToken.transferAndCall(address(router), fee, "");
        }
    }
}
