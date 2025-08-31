// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {CCIPReceiver} from "@chainlink/contracts-ccip/contracts/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";

/// @title SETTLE SettlementVault
/// @notice CCIP receiver that records incoming settlement messages, ready to disburse funds to merchant accounts.
contract SettlementVault is CCIPReceiver, Ownable {
    struct SettlementRecord {
        bytes32 merchantId;
        address payer;
        address paymentToken;
        uint256 amount;
        uint64 sourceChainSelector;
        bytes32 messageId;
        uint256 timestamp;
    }

    event SettlementRecorded(bytes32 indexed invoiceId, bytes32 indexed messageId, bytes32 indexed merchantId, address payer, address paymentToken, uint256 amount, uint64 sourceChainSelector);

    mapping(bytes32 => SettlementRecord) public settlements; // invoiceId => record

    constructor(address router_) CCIPReceiver(router_) Ownable(msg.sender) {}

    function _ccipReceive(Client.Any2EVMMessage memory message) internal override {
        (bytes32 invoiceId, bytes32 merchantId, address payer, address paymentToken, uint256 amount) = abi.decode(
            message.data,
            (bytes32, bytes32, address, address, uint256)
        );

        // idempotence: only first write wins
        if (settlements[invoiceId].timestamp != 0) return;

        settlements[invoiceId] = SettlementRecord({
            merchantId: merchantId,
            payer: payer,
            paymentToken: paymentToken,
            amount: amount,
            sourceChainSelector: message.sourceChainSelector,
            messageId: message.messageId,
            timestamp: block.timestamp
        });

        emit SettlementRecorded(
            invoiceId,
            message.messageId,
            merchantId,
            payer,
            paymentToken,
            amount,
            message.sourceChainSelector
        );
    }
}
