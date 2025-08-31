// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {PaymentPortal} from "src/PaymentPortal.sol";
import {SettlementVault} from "src/SettlementVault.sol";
import {CCIPAddresses} from "script/CCIPAddresses.sol";

contract Deploy is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        string memory network = vm.envOr("NETWORK", string("sepolia"));

        address router;
        address link;
        if (keccak256(bytes(network)) == keccak256("base-sepolia")) {
            router = CCIPAddresses.BASE_SEPOLIA_ROUTER;
            link = CCIPAddresses.BASE_SEPOLIA_LINK;
        } else if (keccak256(bytes(network)) == keccak256("lisk-sepolia")) {
            router = CCIPAddresses.LISK_SEPOLIA_ROUTER;
            link = CCIPAddresses.LISK_SEPOLIA_LINK;
        } else {
            router = CCIPAddresses.SEPOLIA_ROUTER;
            link = CCIPAddresses.SEPOLIA_LINK;
        }

        vm.startBroadcast(pk);
        SettlementVault vault = new SettlementVault(router);
        PaymentPortal portal = new PaymentPortal(router, link);
        vm.stopBroadcast();

        console2.log("NETWORK", network);
        console2.log("Router", router);
        console2.log("LINK", link);
        console2.log("SettlementVault", address(vault));
        console2.log("PaymentPortal", address(portal));

        // Write deployments file for frontend wiring
        string memory json = string(
            abi.encodePacked(
                "{\n  \"network\": \"", network, "\",\n  \"router\": \"",
                vm.toString(router),
                "\",\n  \"link\": \"",
                vm.toString(link),
                "\",\n  \"SettlementVault\": \"",
                vm.toString(address(vault)),
                "\",\n  \"PaymentPortal\": \"",
                vm.toString(address(portal)),
                "\"\n}"
            )
        );
        string memory path = string(abi.encodePacked("deployments/", network, ".json"));
        vm.writeFile(path, json);
    }
}
