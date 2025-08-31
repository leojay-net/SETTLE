Getting Started (EVM)
note
Talk to a CCIP expert

If you require technical advice or wish to consult on your project's implementation, please contact a CCIP expert. Our dedicated team is ready to support your projects and ensure their success. For expert guidance, visit the Chainlink CCIP Contact form.

A simple use case for Chainlink CCIP is sending data between smart contracts on different blockchains. This guide shows you how to deploy a CCIP sender contract and a CCIP receiver contract to two different blockchains and send data from the sender contract to the receiver contract. You pay the CCIP fees using LINK.

Fees can also be paid in alternative assets, which currently include the native gas tokens of the source blockchain and their ERC20 wrapped version. For example, you can pay ETH or WETH when you send transactions to the CCIP router on Ethereum and AVAX or WAVAX when you send transactions to the CCIP router on Avalanche.

Before you begin
If you are new to smart contract development, learn how to Deploy Your First Smart Contract so you are familiar with the tools that are necessary for this guide:
The Solidity programming language
The MetaMask wallet
The Remix development environment
Acquire testnet funds. This guide requires testnet AVAX and LINK on Avalanche Fuji. It also requires testnet ETH on Ethereum Sepolia. If you need to use different networks, you can find more faucets on the LINK Token Contracts page.
Go to faucets.chain.link to get your testnet tokens.
Learn how to Fund your contract with LINK.
Deploy the sender contract
Deploy the Sender.sol contract on Avalanche Fuji. To see a detailed explanation of this contract, read the Code Explanation section.

Open the Sender.sol contract in Remix.

Open in Remix
What is Remix?
Compile the contract.

Deploy the sender contract on Avalanche Fuji:

Open MetaMask and select the Avalanche Fuji network.

In Remix under the Deploy & Run Transactions tab, select Injected Provider - MetaMask in the Environment list. Remix will use the MetaMask wallet to communicate with Avalanche Fuji.

Under the Deploy section, fill in the router address and the LINK token contract addresses for your specific blockchain. You can find both of these addresses on the CCIP Directory. The LINK token contract address is also listed on the LINK Token Contracts page. For Avalanche Fuji, the router address is 
0xF694E193200268f9a4868e4Aa017A0118C9a8177
Copy to clipboard
 and the LINK address is 
0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846
Copy to clipboard
.

Chainlink CCIP deploy sender Avalanche Fuji
Click the transact button to deploy the contract. MetaMask prompts you to confirm the transaction. Check the transaction details to make sure you are deploying the contract to Avalanche Fuji.

After you confirm the transaction, the contract address appears in the Deployed Contracts list. Copy your contract address.

Chainlink CCIP Deployed sender Avalanche Fuji
Open MetaMask and send 
70
Copy to clipboard
 LINK to the contract address that you copied. Your contract will pay CCIP fees in LINK.

Note: This transaction fee is significantly higher than normal due to gas spikes on Sepolia. To run this example, you can get additional testnet LINK from faucets.chain.link or use a supported testnet other than Sepolia.

Deploy the receiver contract
Deploy the receiver contract on Ethereum Sepolia. You will use this contract to receive data from the sender that you deployed on Avalanche Fuji. To see a detailed explanation of this contract, read the Code Explanation section.

Open the Receiver.sol contract in Remix.

Open in Remix
What is Remix?
Compile the contract.

Deploy the receiver contract on Ethereum Sepolia:

Open MetaMask and select the Ethereum Sepolia network.

In Remix under the Deploy & Run Transactions tab, make sure the Environment is still set to Injected Provider - MetaMask.

Under the Deploy section, fill in the router address field. For Ethereum Sepolia, the Router address is 
0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59
Copy to clipboard
. You can find the addresses for each network on the CCIP Directory.

Chainlink CCIP Deploy receiver Sepolia
Click the Deploy button to deploy the contract. MetaMask prompts you to confirm the transaction. Check the transaction details to make sure you are deploying the contract to Ethereum Sepolia.

After you confirm the transaction, the contract address appears as the second item in the Deployed Contracts list. Copy this contract address.

Chainlink CCIP deployed receiver Sepolia
You now have one sender contract on Avalanche Fuji and one receiver contract on Ethereum Sepolia. You sent 70 LINK to the sender contract to pay the CCIP fees. Next, send data from the sender contract to the receiver contract.

Send data
Send a Hello World! string from your contract on Avalanche Fuji to the contract you deployed on Ethereum Sepolia:

Open MetaMask and select the Avalanche Fuji network.

In Remix under the Deploy & Run Transactions tab, expand the first contract in the Deployed Contracts section.

Expand the sendMessage function and fill in the following arguments:

Argument	Description	Value (Ethereum Sepolia)
destinationChainSelector	CCIP Chain identifier of the target blockchain. You can find each network's chain selector on the CCIP Directory	
16015286601757825753
Copy to clipboard
receiver	The destination smart contract address	Your deployed contract address
text	Any string	
Hello World!
Copy to clipboard
Chainlink CCIP Sepolia send message
Click the transact button to run the function. MetaMask prompts you to confirm the transaction.

note
Gas price spikes

Under normal circumstances, transactions on the Ethereum Sepolia network require significantly fewer tokens to pay for gas. However, during exceptional periods of high gas price spikes, your transactions may fail if not sufficiently funded. In such cases, you may need to fund your contract with additional tokens. We recommend paying for your CCIP transactions in LINK tokens (rather than native tokens) as you can obtain extra LINK testnet tokens from faucets.chain.link. If you encounter a transaction failure due to these gas price spikes, please add additional LINK tokens to your contract and try again. Alternatively, you can use a supported testnet other than Sepolia.

After the transaction is successful, note the transaction hash. Here is an example of a successful transaction on Avalanche Fuji.

After the transaction is finalized on the source chain, it will take a few minutes for CCIP to deliver the data to Ethereum Sepolia and call the ccipReceive function on your receiver contract. You can use the CCIP explorer to see the status of your CCIP transaction and then read data stored by your receiver contract.

Open the CCIP explorer and use the transaction hash that you copied to search for your cross-chain transaction. The explorer provides several details about your request.

Chainlink CCIP Explorer transaction details
When the status of the transaction is marked with a "Success" status, the CCIP transaction and the destination transaction are complete.

Chainlink CCIP Explorer transaction details success
Read data
Read data stored by the receiver contract on Ethereum Sepolia:

Open MetaMask and select the Ethereum Sepolia network.

In Remix under the Deploy & Run Transactions tab, expand the receiver contract deployed on Ethereum Sepolia.

Click the getLastReceivedMessageDetails function button to read the stored data. In this example, it is "Hello World!".

Chainlink CCIP Sepolia message details
Congratulations! You just sent your first cross-chain data using CCIP. Next, examine the example code to learn how this contract works.

Examine the example code
Sender code
The smart contract in this tutorial is designed to interact with CCIP to send data. The contract code includes comments to clarify the various functions, events, and underlying logic. However, this section explains the key elements. You can see the full contract code below.

copy to clipboard
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/// @title - A simple contract for sending string data across chains.
contract Sender is OwnerIsCreator {
    // Custom errors to provide more descriptive revert messages.
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); // Used to make sure contract has enough balance.

    // Event emitted when a message is sent to another chain.
    event MessageSent(
        bytes32 indexed messageId, // The unique ID of the CCIP message.
        uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
        address receiver, // The address of the receiver on the destination chain.
        string text, // The text being sent.
        address feeToken, // the token address used to pay CCIP fees.
        uint256 fees // The fees paid for sending the CCIP message.
    );

    IRouterClient private s_router;

    LinkTokenInterface private s_linkToken;

    /// @notice Constructor initializes the contract with the router address.
    /// @param _router The address of the router contract.
    /// @param _link The address of the link contract.
    constructor(address _router, address _link) {
        s_router = IRouterClient(_router);
        s_linkToken = LinkTokenInterface(_link);
    }

    /// @notice Sends data to receiver on the destination chain.
    /// @dev Assumes your contract has sufficient LINK.
    /// @param destinationChainSelector The identifier (aka selector) for the destination blockchain.
    /// @param receiver The address of the recipient on the destination blockchain.
    /// @param text The string text to be sent.
    /// @return messageId The ID of the message that was sent.
    function sendMessage(
        uint64 destinationChainSelector,
        address receiver,
        string calldata text
    ) external onlyOwner returns (bytes32 messageId) {
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver), // ABI-encoded receiver address
            data: abi.encode(text), // ABI-encoded string
            tokenAmounts: new Client.EVMTokenAmount[](0), // Empty array indicating no tokens are being sent
            extraArgs: Client._argsToBytes(
                // Additional arguments, setting gas limit and allowing out-of-order execution.
                // Best Practice: For simplicity, the values are hardcoded. It is advisable to use a more dynamic approach
                // where you set the extra arguments off-chain. This allows adaptation depending on the lanes, messages,
                // and ensures compatibility with future CCIP upgrades. Read more about it here: https://docs.chain.link/ccip/concepts/best-practices/evm#using-extraargs
                Client.GenericExtraArgsV2({
                    gasLimit: 200_000, // Gas limit for the callback on the destination chain
                    allowOutOfOrderExecution: true // Allows the message to be executed out of order relative to other messages from the same sender
                })
            ),
            // Set the feeToken  address, indicating LINK will be used for fees
            feeToken: address(s_linkToken)
        });

        // Get the fee required to send the message
        uint256 fees = s_router.getFee(
            destinationChainSelector,
            evm2AnyMessage
        );

        if (fees > s_linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);

        // approve the Router to transfer LINK tokens on contract's behalf. It will spend the fees in LINK
        s_linkToken.approve(address(s_router), fees);

        // Send the message through the router and store the returned message ID
        messageId = s_router.ccipSend(destinationChainSelector, evm2AnyMessage);

        // Emit an event with message details
        emit MessageSent(
            messageId,
            destinationChainSelector,
            receiver,
            text,
            address(s_linkToken),
            fees
        );

        // Return the message ID
        return messageId;
    }
}
Open in Remix
What is Remix?
Initializing the contract
When deploying the contract, you define the router address and the LINK contract address of the blockchain where you choose to deploy the contract.

The router address provides functions that are required for this example:

The getFee function to estimate the CCIP fees.
The ccipSend function to send CCIP messages.
Sending data
The sendMessage function completes several operations:

Construct a CCIP-compatible message using the EVM2AnyMessage struct:

The receiver address is encoded in bytes format to accommodate non-EVM destination blockchains with distinct address formats. The encoding is achieved through abi.encode.
The data is encoded from a string text to bytes using abi.encode.
The tokenAmounts is an array. Each element comprises a struct that contains the token address and amount. In this example, the array is empty because no tokens are sent.
The extraArgs specify the gasLimit for relaying the CCIP message to the recipient contract on the destination blockchain. In this example, the gasLimit is set to 200000.
The feeToken designates the token address used for CCIP fees. Here, address(linkToken) signifies payment in LINK.
Compute the fees by invoking the router's getFee function.

Ensure that your contract balance in LINK is enough to cover the fees.

Grant the router contract permission to deduct the fees from the contract's LINK balance.

Dispatch the CCIP message to the destination chain by executing the router's ccipSend function.

caution
Best Practices

This example is simplified for educational purposes. For production code, please adhere to the following best practices:

Do Not Hardcode extraArgs: In this example, extraArgs are hardcoded within the contract for simplicity. It is recommended to make extraArgs mutable. For instance, you can construct extraArgs off-chain and pass them into your function calls, or store them in a storage variable that can be updated as needed. This approach ensures that extraArgs remain backward compatible with future CCIP upgrades. Refer to the Best Practices guide for more information.

Validate the Destination Chain: Always ensure that the destination chain is valid and supported before sending messages.

Understand allowOutOfOrderExecution Usage: This example sets allowOutOfOrderExecution to true (see GenericExtraArgsV2). Read the Best Practices: Setting allowOutOfOrderExecution to learn more about this parameter.

Understand CCIP Service Limits: Review the CCIP Service Limits for constraints on message data size, execution gas, and the number of tokens per transaction. If your requirements exceed these limits, you may need to contact the Chainlink Labs Team.

Following these best practices ensures that your contract is robust, future-proof, and compliant with CCIP standards.

Receiver code
The smart contract in this tutorial is designed to interact with CCIP to receive data. The contract code includes comments to clarify the various functions, events, and underlying logic. However, this section explains the key elements. You can see the full contract code below.

copy to clipboard
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/contracts/applications/CCIPReceiver.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/// @title - A simple contract for receiving string data across chains.
contract Receiver is CCIPReceiver {
    // Event emitted when a message is received from another chain.
    event MessageReceived(
        bytes32 indexed messageId, // The unique ID of the message.
        uint64 indexed sourceChainSelector, // The chain selector of the source chain.
        address sender, // The address of the sender from the source chain.
        string text // The text that was received.
    );

    bytes32 private s_lastReceivedMessageId; // Store the last received messageId.
    string private s_lastReceivedText; // Store the last received text.

    /// @notice Constructor initializes the contract with the router address.
    /// @param router The address of the router contract.
    constructor(address router) CCIPReceiver(router) {}

    /// handle a received message
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        s_lastReceivedMessageId = any2EvmMessage.messageId; // fetch the messageId
        s_lastReceivedText = abi.decode(any2EvmMessage.data, (string)); // abi-decoding of the sent text

        emit MessageReceived(
            any2EvmMessage.messageId,
            any2EvmMessage.sourceChainSelector, // fetch the source chain identifier (aka selector)
            abi.decode(any2EvmMessage.sender, (address)), // abi-decoding of the sender address,
            abi.decode(any2EvmMessage.data, (string))
        );
    }

    /// @notice Fetches the details of the last received message.
    /// @return messageId The ID of the last received message.
    /// @return text The last received text.
    function getLastReceivedMessageDetails()
        external
        view
        returns (bytes32 messageId, string memory text)
    {
        return (s_lastReceivedMessageId, s_lastReceivedText);
    }
}
Open in Remix
What is Remix?
Initializing the contract
When you deploy the contract, you define the router address. The receiver contract inherits from the CCIPReceiver.sol contract, which uses the router address.

Receiving data
On the destination blockchain:

The CCIP Router invokes the ccipReceive function. Note: This function is protected by the onlyRouter modifier, which ensures that only the router can call the receiver contract.

The ccipReceive function calls an internal function _ccipReceive function. The receiver contract implements this function.

This _ccipReceive function expects an Any2EVMMessage struct that contains the following values:

The CCIP messageId.
The sourceChainSelector.
The sender address in bytes format. The sender is a contract deployed on an EVM-compatible blockchain, so the address is decoded from bytes to an Ethereum address using the ABI specification.
The data is also in bytes format. A string is expected, so the data is decoded from bytes to a string using the ABI specification.

Before you begin
You should understand how to write, compile, deploy, and fund a smart contract. If you need to brush up on the basics, read this tutorial, which will guide you through using the Solidity programming language, interacting with the MetaMask wallet and working within the Remix Development Environment.
Your account must have some AVAX and LINK tokens on Avalanche Fuji and ETH tokens on Ethereum Sepolia. Learn how to Acquire testnet LINK.
Check the CCIP Directory to confirm that the tokens you will transfer are supported for your lane. In this example, you will transfer tokens from Avalanche Fuji to Ethereum Sepolia so check the list of supported tokens here.
Learn how to acquire CCIP test tokens. Following this guide, you should have CCIP-BnM tokens, and CCIP-BnM should appear in the list of your tokens in MetaMask.
Learn how to fund your contract. This guide shows how to fund your contract in LINK, but you can use the same guide for funding your contract with any ERC20 tokens as long as they appear in the list of tokens in MetaMask.
Follow the previous tutorial: Transfer tokens.
Tutorial
note
Optimize your development with the CCIP local simulator

Enhance your development workflow using the Chainlink CCIP local simulator, an installable package designed to simulate Chainlink CCIP locally within your Hardhat and Foundry projects. It provides a robust smart contracts and scripts suite, enabling you to build, deploy, and execute CCIP token transfers and arbitrary messages on a local Hardhat or Anvil development node. With Chainlink Local, you can also work on forked nodes, ensuring a seamless transition of your contracts to test networks without modifications. Start integrating Chainlink Local today to streamline your development process and validate your CCIP implementations effectively.

In this tutorial, you will send a string text and CCIP-BnM tokens between smart contracts on Avalanche Fuji and Ethereum Sepolia using CCIP. First, you will pay CCIP fees in LINK, then you will pay CCIP fees in native gas.

copy to clipboard
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/contracts/applications/CCIPReceiver.sol";
import {IERC20} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/// @title - A simple messenger contract for transferring/receiving tokens and data across chains.
contract ProgrammableTokenTransfers is CCIPReceiver, OwnerIsCreator {
    using SafeERC20 for IERC20;

    // Custom errors to provide more descriptive revert messages.
    error NotEnoughBalance(uint256 currentBalance, uint256 requiredBalance); // Used to make sure contract has enough token balance
    error NothingToWithdraw(); // Used when trying to withdraw Ether but there's nothing to withdraw.
    error FailedToWithdrawEth(address owner, address target, uint256 value); // Used when the withdrawal of Ether fails.
    error DestinationChainNotAllowed(uint64 destinationChainSelector); // Used when the destination chain has not been allowlisted by the contract owner.
    error SourceChainNotAllowed(uint64 sourceChainSelector); // Used when the source chain has not been allowlisted by the contract owner.
    error SenderNotAllowed(address sender); // Used when the sender has not been allowlisted by the contract owner.
    error InvalidReceiverAddress(); // Used when the receiver address is 0.

    // Event emitted when a message is sent to another chain.
    event MessageSent(
        bytes32 indexed messageId, // The unique ID of the CCIP message.
        uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
        address receiver, // The address of the receiver on the destination chain.
        string text, // The text being sent.
        address token, // The token address that was transferred.
        uint256 tokenAmount, // The token amount that was transferred.
        address feeToken, // the token address used to pay CCIP fees.
        uint256 fees // The fees paid for sending the message.
    );

    // Event emitted when a message is received from another chain.
    event MessageReceived(
        bytes32 indexed messageId, // The unique ID of the CCIP message.
        uint64 indexed sourceChainSelector, // The chain selector of the source chain.
        address sender, // The address of the sender from the source chain.
        string text, // The text that was received.
        address token, // The token address that was transferred.
        uint256 tokenAmount // The token amount that was transferred.
    );

    bytes32 private s_lastReceivedMessageId; // Store the last received messageId.
    address private s_lastReceivedTokenAddress; // Store the last received token address.
    uint256 private s_lastReceivedTokenAmount; // Store the last received amount.
    string private s_lastReceivedText; // Store the last received text.

    // Mapping to keep track of allowlisted destination chains.
    mapping(uint64 => bool) public allowlistedDestinationChains;

    // Mapping to keep track of allowlisted source chains.
    mapping(uint64 => bool) public allowlistedSourceChains;

    // Mapping to keep track of allowlisted senders.
    mapping(address => bool) public allowlistedSenders;

    IERC20 private s_linkToken;

    /// @notice Constructor initializes the contract with the router address.
    /// @param _router The address of the router contract.
    /// @param _link The address of the link contract.
    constructor(address _router, address _link) CCIPReceiver(_router) {
        s_linkToken = IERC20(_link);
    }

    /// @dev Modifier that checks if the chain with the given destinationChainSelector is allowlisted.
    /// @param _destinationChainSelector The selector of the destination chain.
    modifier onlyAllowlistedDestinationChain(uint64 _destinationChainSelector) {
        if (!allowlistedDestinationChains[_destinationChainSelector])
            revert DestinationChainNotAllowed(_destinationChainSelector);
        _;
    }

    /// @dev Modifier that checks the receiver address is not 0.
    /// @param _receiver The receiver address.
    modifier validateReceiver(address _receiver) {
        if (_receiver == address(0)) revert InvalidReceiverAddress();
        _;
    }

    /// @dev Modifier that checks if the chain with the given sourceChainSelector is allowlisted and if the sender is allowlisted.
    /// @param _sourceChainSelector The selector of the destination chain.
    /// @param _sender The address of the sender.
    modifier onlyAllowlisted(uint64 _sourceChainSelector, address _sender) {
        if (!allowlistedSourceChains[_sourceChainSelector])
            revert SourceChainNotAllowed(_sourceChainSelector);
        if (!allowlistedSenders[_sender]) revert SenderNotAllowed(_sender);
        _;
    }

    /// @dev Updates the allowlist status of a destination chain for transactions.
    /// @notice This function can only be called by the owner.
    /// @param _destinationChainSelector The selector of the destination chain to be updated.
    /// @param allowed The allowlist status to be set for the destination chain.
    function allowlistDestinationChain(
        uint64 _destinationChainSelector,
        bool allowed
    ) external onlyOwner {
        allowlistedDestinationChains[_destinationChainSelector] = allowed;
    }

    /// @dev Updates the allowlist status of a source chain
    /// @notice This function can only be called by the owner.
    /// @param _sourceChainSelector The selector of the source chain to be updated.
    /// @param allowed The allowlist status to be set for the source chain.
    function allowlistSourceChain(
        uint64 _sourceChainSelector,
        bool allowed
    ) external onlyOwner {
        allowlistedSourceChains[_sourceChainSelector] = allowed;
    }

    /// @dev Updates the allowlist status of a sender for transactions.
    /// @notice This function can only be called by the owner.
    /// @param _sender The address of the sender to be updated.
    /// @param allowed The allowlist status to be set for the sender.
    function allowlistSender(address _sender, bool allowed) external onlyOwner {
        allowlistedSenders[_sender] = allowed;
    }

    /// @notice Sends data and transfer tokens to receiver on the destination chain.
    /// @notice Pay for fees in LINK.
    /// @dev Assumes your contract has sufficient LINK to pay for CCIP fees.
    /// @param _destinationChainSelector The identifier (aka selector) for the destination blockchain.
    /// @param _receiver The address of the recipient on the destination blockchain.
    /// @param _text The string data to be sent.
    /// @param _token token address.
    /// @param _amount token amount.
    /// @return messageId The ID of the CCIP message that was sent.
    function sendMessagePayLINK(
        uint64 _destinationChainSelector,
        address _receiver,
        string calldata _text,
        address _token,
        uint256 _amount
    )
        external
        onlyOwner
        onlyAllowlistedDestinationChain(_destinationChainSelector)
        validateReceiver(_receiver)
        returns (bytes32 messageId)
    {
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        // address(linkToken) means fees are paid in LINK
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _text,
            _token,
            _amount,
            address(s_linkToken)
        );

        // Initialize a router client instance to interact with cross-chain router
        IRouterClient router = IRouterClient(this.getRouter());

        // Get the fee required to send the CCIP message
        uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);

        uint256 requiredLinkBalance;
        if (_token == address(s_linkToken)) {
            // Required LINK Balance is the sum of fees and amount to transfer, if the token to transfer is LINK
            requiredLinkBalance = fees + _amount;
        } else {
            requiredLinkBalance = fees;
        }

        uint256 linkBalance = s_linkToken.balanceOf(address(this));

        if (requiredLinkBalance > linkBalance) {
            revert NotEnoughBalance(linkBalance, requiredLinkBalance);
        }

        // approve the Router to transfer LINK tokens on contract's behalf. It will spend the requiredLinkBalance
        s_linkToken.approve(address(router), requiredLinkBalance);

        // If sending a token other than LINK, approve it separately
        if (_token != address(s_linkToken)) {
            uint256 tokenBalance = IERC20(_token).balanceOf(address(this));
            if (_amount > tokenBalance) {
                revert NotEnoughBalance(tokenBalance, _amount);
            }
            // approve the Router to spend tokens on contract's behalf. It will spend the amount of the given token
            IERC20(_token).approve(address(router), _amount);
        }

        // Send the message through the router and store the returned message ID
        messageId = router.ccipSend(_destinationChainSelector, evm2AnyMessage);

        // Emit an event with message details
        emit MessageSent(
            messageId,
            _destinationChainSelector,
            _receiver,
            _text,
            _token,
            _amount,
            address(s_linkToken),
            fees
        );

        // Return the message ID
        return messageId;
    }

    /// @notice Sends data and transfer tokens to receiver on the destination chain.
    /// @notice Pay for fees in native gas.
    /// @dev Assumes your contract has sufficient native gas like ETH on Ethereum or POL on Polygon.
    /// @param _destinationChainSelector The identifier (aka selector) for the destination blockchain.
    /// @param _receiver The address of the recipient on the destination blockchain.
    /// @param _text The string data to be sent.
    /// @param _token token address.
    /// @param _amount token amount.
    /// @return messageId The ID of the CCIP message that was sent.
    function sendMessagePayNative(
        uint64 _destinationChainSelector,
        address _receiver,
        string calldata _text,
        address _token,
        uint256 _amount
    )
        external
        onlyOwner
        onlyAllowlistedDestinationChain(_destinationChainSelector)
        validateReceiver(_receiver)
        returns (bytes32 messageId)
    {
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        // address(0) means fees are paid in native gas
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _text,
            _token,
            _amount,
            address(0)
        );

        // Initialize a router client instance to interact with cross-chain router
        IRouterClient router = IRouterClient(this.getRouter());

        // Get the fee required to send the CCIP message
        uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);

        if (fees > address(this).balance)
            revert NotEnoughBalance(address(this).balance, fees);

        // approve the Router to spend tokens on contract's behalf. It will spend the amount of the given token
        IERC20(_token).approve(address(router), _amount);

        // Send the message through the router and store the returned message ID
        messageId = router.ccipSend{value: fees}(
            _destinationChainSelector,
            evm2AnyMessage
        );

        // Emit an event with message details
        emit MessageSent(
            messageId,
            _destinationChainSelector,
            _receiver,
            _text,
            _token,
            _amount,
            address(0),
            fees
        );

        // Return the message ID
        return messageId;
    }

    /**
     * @notice Returns the details of the last CCIP received message.
     * @dev This function retrieves the ID, text, token address, and token amount of the last received CCIP message.
     * @return messageId The ID of the last received CCIP message.
     * @return text The text of the last received CCIP message.
     * @return tokenAddress The address of the token in the last CCIP received message.
     * @return tokenAmount The amount of the token in the last CCIP received message.
     */
    function getLastReceivedMessageDetails()
        public
        view
        returns (
            bytes32 messageId,
            string memory text,
            address tokenAddress,
            uint256 tokenAmount
        )
    {
        return (
            s_lastReceivedMessageId,
            s_lastReceivedText,
            s_lastReceivedTokenAddress,
            s_lastReceivedTokenAmount
        );
    }

    /// handle a received message
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    )
        internal
        override
        onlyAllowlisted(
            any2EvmMessage.sourceChainSelector,
            abi.decode(any2EvmMessage.sender, (address))
        ) // Make sure source chain and sender are allowlisted
    {
        s_lastReceivedMessageId = any2EvmMessage.messageId; // fetch the messageId
        s_lastReceivedText = abi.decode(any2EvmMessage.data, (string)); // abi-decoding of the sent text
        // Expect one token to be transferred at once, but you can transfer several tokens.
        s_lastReceivedTokenAddress = any2EvmMessage.destTokenAmounts[0].token;
        s_lastReceivedTokenAmount = any2EvmMessage.destTokenAmounts[0].amount;

        emit MessageReceived(
            any2EvmMessage.messageId,
            any2EvmMessage.sourceChainSelector, // fetch the source chain identifier (aka selector)
            abi.decode(any2EvmMessage.sender, (address)), // abi-decoding of the sender address,
            abi.decode(any2EvmMessage.data, (string)),
            any2EvmMessage.destTokenAmounts[0].token,
            any2EvmMessage.destTokenAmounts[0].amount
        );
    }

    /// @notice Construct a CCIP message.
    /// @dev This function will create an EVM2AnyMessage struct with all the necessary information for programmable tokens transfer.
    /// @param _receiver The address of the receiver.
    /// @param _text The string data to be sent.
    /// @param _token The token to be transferred.
    /// @param _amount The amount of the token to be transferred.
    /// @param _feeTokenAddress The address of the token used for fees. Set address(0) for native gas.
    /// @return Client.EVM2AnyMessage Returns an EVM2AnyMessage struct which contains information for sending a CCIP message.
    function _buildCCIPMessage(
        address _receiver,
        string calldata _text,
        address _token,
        uint256 _amount,
        address _feeTokenAddress
    ) private pure returns (Client.EVM2AnyMessage memory) {
        // Set the token amounts
        Client.EVMTokenAmount[]
            memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({
            token: _token,
            amount: _amount
        });
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        return
            Client.EVM2AnyMessage({
                receiver: abi.encode(_receiver), // ABI-encoded receiver address
                data: abi.encode(_text), // ABI-encoded string
                tokenAmounts: tokenAmounts, // The amount and type of token being transferred
                extraArgs: Client._argsToBytes(
                    // Additional arguments, setting gas limit and allowing out-of-order execution.
                    // Best Practice: For simplicity, the values are hardcoded. It is advisable to use a more dynamic approach
                    // where you set the extra arguments off-chain. This allows adaptation depending on the lanes, messages,
                    // and ensures compatibility with future CCIP upgrades. Read more about it here: https://docs.chain.link/ccip/concepts/best-practices/evm#using-extraargs
                    Client.GenericExtraArgsV2({
                        gasLimit: 200_000, // Gas limit for the callback on the destination chain
                        allowOutOfOrderExecution: true // Allows the message to be executed out of order relative to other messages from the same sender
                    })
                ),
                // Set the feeToken to a feeTokenAddress, indicating specific asset will be used for fees
                feeToken: _feeTokenAddress
            });
    }

    /// @notice Fallback function to allow the contract to receive Ether.
    /// @dev This function has no function body, making it a default function for receiving Ether.
    /// It is automatically called when Ether is sent to the contract without any data.
    receive() external payable {}

    /// @notice Allows the contract owner to withdraw the entire balance of Ether from the contract.
    /// @dev This function reverts if there are no funds to withdraw or if the transfer fails.
    /// It should only be callable by the owner of the contract.
    /// @param _beneficiary The address to which the Ether should be sent.
    function withdraw(address _beneficiary) public onlyOwner {
        // Retrieve the balance of this contract
        uint256 amount = address(this).balance;

        // Revert if there is nothing to withdraw
        if (amount == 0) revert NothingToWithdraw();

        // Attempt to send the funds, capturing the success status and discarding any return data
        (bool sent, ) = _beneficiary.call{value: amount}("");

        // Revert if the send failed, with information about the attempted transfer
        if (!sent) revert FailedToWithdrawEth(msg.sender, _beneficiary, amount);
    }

    /// @notice Allows the owner of the contract to withdraw all tokens of a specific ERC20 token.
    /// @dev This function reverts with a 'NothingToWithdraw' error if there are no tokens to withdraw.
    /// @param _beneficiary The address to which the tokens will be sent.
    /// @param _token The contract address of the ERC20 token to be withdrawn.
    function withdrawToken(
        address _beneficiary,
        address _token
    ) public onlyOwner {
        // Retrieve the balance of this contract
        uint256 amount = IERC20(_token).balanceOf(address(this));

        // Revert if there is nothing to withdraw
        if (amount == 0) revert NothingToWithdraw();

        IERC20(_token).safeTransfer(_beneficiary, amount);
    }
}
Open in Remix
What is Remix?
Deploy your contracts
To use this contract:

Open the contract in Remix.

Compile your contract.

Deploy, fund your sender contract on Avalanche Fuji and enable sending messages to Ethereum Sepolia:

Open MetaMask and select the network Avalanche Fuji.
In Remix IDE, click on Deploy & Run Transactions and select Injected Provider - MetaMask from the environment list. Remix will then interact with your MetaMask wallet to communicate with Avalanche Fuji.
Fill in your blockchain's router and LINK contract addresses. The router address can be found on the CCIP Directory and the LINK contract address on the LINK token contracts page. For Avalanche Fuji:
The router address is 
0xF694E193200268f9a4868e4Aa017A0118C9a8177
Copy to clipboard
,
The LINK contract address is 
0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846
Copy to clipboard
.
Click the transact button. After you confirm the transaction, the contract address appears on the Deployed Contracts list. Note your contract address.
Open MetaMask and fund your contract with CCIP-BnM tokens. You can transfer 
0.002
Copy to clipboard
 CCIP-BnM to your contract.
Enable your contract to send CCIP messages to Ethereum Sepolia:
In Remix IDE, under Deploy & Run Transactions, open the list of functions of your smart contract deployed on Avalanche Fuji.
Call the allowlistDestinationChain, setting the destination chain selector to 
16015286601757825753
Copy to clipboard
 and setting allowed to 
true
Copy to clipboard
. Each chain selector is found on the CCIP Directory.
Deploy your receiver contract on Ethereum Sepolia and enable receiving messages from your sender contract:

Open MetaMask and select the network Ethereum Sepolia.
In Remix IDE, under Deploy & Run Transactions, make sure the environment is still Injected Provider - MetaMask.
Fill in your blockchain's router and LINK contract addresses. The router address can be found on the CCIP Directory and the LINK contract address on the LINK token contracts page. For Ethereum Sepolia, the router address is 
0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59
Copy to clipboard
 and the LINK contract address is 
0x779877A7B0D9E8603169DdbD7836e478b4624789
Copy to clipboard
.
Click the transact button. After you confirm the transaction, the contract address appears on the Deployed Contracts list. Note your contract address.
Enable your contract to receive CCIP messages from Avalanche Fuji:
In Remix IDE, under Deploy & Run Transactions, open the list of functions of your smart contract deployed on Ethereum Sepolia.
Call the allowlistSourceChain with 
14767482510784806043
Copy to clipboard
 as the source chain selector, and 
true
Copy to clipboard
 as allowed. Each chain selector is found on the CCIP Directory.
Enable your contract to receive CCIP messages from the contract that you deployed on Avalanche Fuji:
In Remix IDE, under Deploy & Run Transactions, open the list of functions of your smart contract deployed on Ethereum Sepolia.
Call the allowlistSender with the contract address of the contract that you deployed on Avalanche Fuji, and 
true
Copy to clipboard
 as allowed.
At this point, you have one sender contract on Avalanche Fuji and one receiver contract on Ethereum Sepolia. As security measures, you enabled the sender contract to send CCIP messages to Ethereum Sepolia and the receiver contract to receive CCIP messages from the sender on Avalanche Fuji.

Note: Another security measure enforces that only the router can call the _ccipReceive function. Read the explanation section for more details.

Transfer and Receive tokens and data and pay in LINK
You will transfer 0.001 CCIP-BnM and a text. The CCIP fees for using CCIP will be paid in LINK. Read this explanation for a detailed description of the code example.

Open MetaMask and connect to Avalanche Fuji. Fund your contract with LINK tokens. You can transfer 
70
Copy to clipboard
 LINK to your contract. In this example, LINK is used to pay the CCIP fees.

Note: This transaction fee is significantly higher than normal due to gas spikes on Sepolia. To run this example, you can get additional testnet LINK from faucets.chain.link or use a supported testnet other than Sepolia.

Send a string data with tokens from Avalanche Fuji:

Open MetaMask and select the network Avalanche Fuji.

In Remix IDE, under Deploy & Run Transactions, open the list of functions of your smart contract deployed on Avalanche Fuji.

Fill in the arguments of the sendMessagePayLINK function:


Argument	Value and Description
_destinationChainSelector	
16015286601757825753
Copy to clipboard

CCIP Chain identifier of the destination blockchain (Ethereum Sepolia in this example). You can find each chain selector on the CCIP Directory.
_receiver	Your receiver contract address on Ethereum Sepolia.
The destination contract address.
_text	
Hello World!
Copy to clipboard

Any string
_token	
0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4
Copy to clipboard

The CCIP-BnM contract address at the source chain (Avalanche Fuji in this example). You can find all the addresses for each supported blockchain on the CCIP Directory.
_amount	
1000000000000000
Copy to clipboard

The token amount (0.001 CCIP-BnM).
Click on transact and confirm the transaction on MetaMask.

After the transaction is successful, record the transaction hash. Here is an example of a transaction on Avalanche Fuji.

note
Gas price spikes

Under normal circumstances, transactions on the Ethereum Sepolia network require significantly fewer tokens to pay for gas. However, during exceptional periods of high gas price spikes, your transactions may fail if not sufficiently funded. In such cases, you may need to fund your contract with additional tokens. We recommend paying for your CCIP transactions in LINK tokens (rather than native tokens) as you can obtain extra LINK testnet tokens from faucets.chain.link. If you encounter a transaction failure due to these gas price spikes, please add additional LINK tokens to your contract and try again. Alternatively, you can use a supported testnet other than Sepolia.

Open the CCIP explorer and search your cross-chain transaction using the transaction hash.


Chainlink CCIP Explorer transaction details
The CCIP transaction is completed once the status is marked as "Success". In this example, the CCIP message ID is 0x99a15381125e740c43a60f03c6b011ae05a3541998ca482fb5a4814417627df8.


Chainlink CCIP Explorer transaction details success
Check the receiver contract on the destination chain:

Open MetaMask and select the network Ethereum Sepolia.

In Remix IDE, under Deploy & Run Transactions, open the list of functions of your smart contract deployed on Ethereum Sepolia.

Call the getLastReceivedMessageDetails function.


Chainlink CCIP Sepolia message details
Notice the received messageId is 0x99a15381125e740c43a60f03c6b011ae05a3541998ca482fb5a4814417627df8, the received text is Hello World!, the token address is 0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05 (CCIP-BnM token address on Ethereum Sepolia) and the token amount is 1000000000000000 (0.001 CCIP-BnM).

Note: These example contracts are designed to work bi-directionally. As an exercise, you can use them to transfer tokens with data from Avalanche Fuji to Ethereum Sepolia and from Ethereum Sepolia back to Avalanche Fuji.

Transfer and Receive tokens and data and pay in native
You will transfer 0.001 CCIP-BnM and a text. The CCIP fees for using CCIP will be paid in Avalanche's native AVAX. Read this explanation for a detailed description of the code example.

Open MetaMask and connect to Avalanche Fuji. Fund your contract with AVAX tokens. You can transfer 
0.2
Copy to clipboard
 AVAX to your contract. The native gas tokens are used to pay the CCIP fees.

Send a string data with tokens from Avalanche Fuji:

Open MetaMask and select the network Avalanche Fuji.

In Remix IDE, under Deploy & Run Transactions, open the list of functions of your smart contract deployed on Avalanche Fuji.

Fill in the arguments of the sendMessagePayNative function:


Argument	Value and Description
_destinationChainSelector	
16015286601757825753
Copy to clipboard

CCIP Chain identifier of the destination blockchain (Ethereum Sepolia in this example). You can find each chain selector on the CCIP Directory.
_receiver	Your receiver contract address at Ethereum Sepolia.
The destination contract address.
_text	
Hello World!
Copy to clipboard

Any string
_token	
0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4
Copy to clipboard

The CCIP-BnM contract address at the source chain (Avalanche Fuji in this example). You can find all the addresses for each supported blockchain on the CCIP Directory.
_amount	
1000000000000000
Copy to clipboard

The token amount (0.001 CCIP-BnM).
Click on transact and confirm the transaction on MetaMask.

Once the transaction is successful, note the transaction hash. Here is an example of a transaction on Avalanche Fuji.

note
Gas price spikes

Under normal circumstances, transactions on the Ethereum Sepolia network require significantly fewer tokens to pay for gas. However, during exceptional periods of high gas price spikes, your transactions may fail if not sufficiently funded. In such cases, you may need to fund your contract with additional tokens. We recommend paying for your CCIP transactions in LINK tokens (rather than native tokens) as you can obtain extra LINK testnet tokens from faucets.chain.link. If you encounter a transaction failure due to these gas price spikes, please add additional LINK tokens to your contract and try again. Alternatively, you can use a supported testnet other than Sepolia.

Open the CCIP explorer and search your cross-chain transaction using the transaction hash.


Chainlink CCIP Explorer transaction details
The CCIP transaction is completed once the status is marked as "Success". In this example, the CCIP message ID is 0x32bf96ac8b01fe3f04ffa548a3403b3105b4ed479eff407ff763b7539a1d43bd. Note that CCIP fees are denominated in LINK. Even if CCIP fees are paid using native gas tokens, node operators will be paid in LINK.


Chainlink CCIP Explorer transaction details success
Check the receiver contract on the destination chain:

Open MetaMask and select the network Ethereum Sepolia.

In Remix IDE, under Deploy & Run Transactions, open the list of functions of your smart contract deployed on Ethereum Sepolia.

Call the getLastReceivedMessageDetails function.


Chainlink CCIP Sepolia message details
Notice the received messageId is 0x32bf96ac8b01fe3f04ffa548a3403b3105b4ed479eff407ff763b7539a1d43bd, the received text is Hello World!, the token address is 0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05 (CCIP-BnM token address on Ethereum Sepolia) and the token amount is 1000000000000000 (0.001 CCIP-BnM).

Note: These example contracts are designed to work bi-directionally. As an exercise, you can use them to transfer tokens with data from Avalanche Fuji to Ethereum Sepolia and from Ethereum Sepolia back to Avalanche Fuji.

Explanation
note
Integrate Chainlink CCIP v1.6.0 into your project

npmyarnfoundry
If you use NPM, install the @chainlink/contracts-ccip NPM package:

copy to clipboard
npm install @chainlink/contracts-ccip@1.6.0
The smart contract featured in this tutorial is designed to interact with CCIP to transfer and receive tokens and data. The contract code contains supporting comments clarifying the functions, events, and underlying logic. Here we will further explain initializing the contract and sending data with tokens.

Initializing the contract
When deploying the contract, we define the router address and LINK contract address of the blockchain we deploy the contract on. Defining the router address is useful for the following:

Sender part:

Calls the router's getFee function to estimate the CCIP fees.
Calls the router's ccipSend function to send CCIP messages.
Receiver part:

The contract inherits from CCIPReceiver, which serves as a base contract for receiver contracts. This contract requires that child contracts implement the _ccipReceive function. _ccipReceive is called by the ccipReceive function, which ensures that only the router can deliver CCIP messages to the receiver contract.
Transferring tokens and data and pay in LINK
The sendMessagePayLINK function undertakes six primary operations:

Call the _buildCCIPMessage private function to construct a CCIP-compatible message using the EVM2AnyMessage struct:

The _receiver address is encoded in bytes to accommodate non-EVM destination blockchains with distinct address formats. The encoding is achieved through abi.encode.

The data is encoded from a string to bytes using abi.encode.

The tokenAmounts is an array, with each element comprising an EVMTokenAmount struct containing the token address and amount. The array contains one element where the _token (token address) and _amount (token amount) are passed by the user when calling the sendMessagePayLINK function.

The extraArgs specifies the gasLimit for relaying the message to the recipient contract on the destination blockchain. In this example, the gasLimit is set to `200000.

The _feeTokenAddress designates the token address used for CCIP fees. Here, address(linkToken) signifies payment in LINK.

caution
Best Practices

This example is simplified for educational purposes. For production code, please adhere to the following best practices:

Do Not Hardcode extraArgs: In this example, extraArgs are hardcoded within the contract for simplicity. It is recommended to make extraArgs mutable. For instance, you can construct extraArgs off-chain and pass them into your function calls, or store them in a storage variable that can be updated as needed. This approach ensures that extraArgs remain backward compatible with future CCIP upgrades. Refer to the Best Practices guide for more information.

Validate the Destination Chain: Always ensure that the destination chain is valid and supported before sending messages.

Understand allowOutOfOrderExecution Usage: This example sets allowOutOfOrderExecution to true (see GenericExtraArgsV2). Read the Best Practices: Setting allowOutOfOrderExecution to learn more about this parameter.

Understand CCIP Service Limits: Review the CCIP Service Limits for constraints on message data size, execution gas, and the number of tokens per transaction. If your requirements exceed these limits, you may need to contact the Chainlink Labs Team.

Following these best practices ensures that your contract is robust, future-proof, and compliant with CCIP standards.

Computes the fees by invoking the router's getFee function.

Ensures your contract balance in LINK is enough to cover the fees.

Grants the router contract permission to deduct the fees from the contract's LINK balance.

Grants the router contract permission to deduct the amount from the contract's CCIP-BnM balance.

Dispatches the CCIP message to the destination chain by executing the router's ccipSend function.

Note: As a security measure, the sendMessagePayLINK function is protected by the onlyAllowlistedDestinationChain, ensuring the contract owner has allowlisted a destination chain.

Transferring tokens and data and pay in native
The sendMessagePayNative function undertakes five primary operations:

Call the _buildCCIPMessage private function to construct a CCIP-compatible message using the EVM2AnyMessage struct:

The _receiver address is encoded in bytes to accommodate non-EVM destination blockchains with distinct address formats. The encoding is achieved through abi.encode.

The data is encoded from a string to bytes using abi.encode.

The tokenAmounts is an array, with each element comprising an EVMTokenAmount struct containing the token address and amount. The array contains one element where the _token (token address) and _amount (token amount) are passed by the user when calling the sendMessagePayNative function.

The extraArgs specifies the gasLimit for relaying the message to the recipient contract on the destination blockchain. In this example, the gasLimit is set to `200000.

The _feeTokenAddress designates the token address used for CCIP fees. Here, address(0) signifies payment in native gas tokens (ETH).

caution
Best Practices

This example is simplified for educational purposes. For production code, please adhere to the following best practices:

Do Not Hardcode extraArgs: In this example, extraArgs are hardcoded within the contract for simplicity. It is recommended to make extraArgs mutable. For instance, you can construct extraArgs off-chain and pass them into your function calls, or store them in a storage variable that can be updated as needed. This approach ensures that extraArgs remain backward compatible with future CCIP upgrades. Refer to the Best Practices guide for more information.

Validate the Destination Chain: Always ensure that the destination chain is valid and supported before sending messages.

Understand allowOutOfOrderExecution Usage: This example sets allowOutOfOrderExecution to true (see GenericExtraArgsV2). Read the Best Practices: Setting allowOutOfOrderExecution to learn more about this parameter.

Understand CCIP Service Limits: Review the CCIP Service Limits for constraints on message data size, execution gas, and the number of tokens per transaction. If your requirements exceed these limits, you may need to contact the Chainlink Labs Team.

Following these best practices ensures that your contract is robust, future-proof, and compliant with CCIP standards.

Computes the fees by invoking the router's getFee function.

Ensures your contract balance in native gas is enough to cover the fees.

Grants the router contract permission to deduct the amount from the contract's CCIP-BnM balance.

Dispatches the CCIP message to the destination chain by executing the router's ccipSend function. Note: msg.value is set because you pay in native gas.

Note: As a security measure, the sendMessagePayNative function is protected by the onlyAllowlistedDestinationChain, ensuring the contract owner has allowlisted a destination chain.

Receiving messages
On the destination blockchain, the router invokes the _ccipReceive function which expects a Any2EVMMessage struct that contains:

The CCIP messageId.
The sourceChainSelector.
The sender address in bytes format. Given that the sender is known to be a contract deployed on an EVM-compatible blockchain, the address is decoded from bytes to an Ethereum address using the ABI specifications.
The tokenAmounts is an array containing received tokens and their respective amounts. Given that only one token transfer is expected, the first element of the array is extracted.
The data, which is also in bytes format. Given a string is expected, the data is decoded from bytes to a string using the ABI specifications.
Note: Three important security measures are applied:

_ccipReceive is called by the ccipReceive function, which ensures that only the router can deliver CCIP messages to the receiver contract. See the onlyRouter modifier for more information.
The modifier onlyAllowlisted ensures that only a call from an allowlisted source chain and sender is accepted.


