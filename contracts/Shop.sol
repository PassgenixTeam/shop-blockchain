// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {AddressUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {SafeERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import {ECDSAUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

import "hardhat/console.sol";

contract Shop is OwnableUpgradeable, ReentrancyGuardUpgradeable {
    using AddressUpgradeable for address;
    using AddressUpgradeable for address payable;
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using ECDSAUpgradeable for bytes32;

    struct Order {
        address customer;
        address paymentToken;
        uint256 price;
        bytes signature;
        string data;
    }

    address public signer;
    mapping(bytes32 => Order) public orders;
    mapping(address => bool) public permittedTokens;

    // -----------Events-----------

    event SetPermittedToken(address token, bool isPermitted);
    event MadeOrder(
        address customer,
        address paymentToken,
        uint256 price,
        bytes signature,
        string data
    );

    // -----------Initializer-----------

    /**
     * @notice Execute once by the factory at time of deployment.
     * @param _owner account that set the owner contract.
     */
    function initialize(address _owner, address _signer) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();

        transferOwnership(_owner);
        signer = _signer;
    }

    // -----------External Functions-----------

    /**
     * @notice Add or remove permitted token.
     * @param _token Token address.
     * @param _isPermitted Is permitted.
     */
    function setPermittedToken(
        address _token,
        bool _isPermitted
    ) external onlyOwner {
        require(_token != address(0), "Invalid payment token");

        permittedTokens[_token] = _isPermitted;
        emit SetPermittedToken(_token, _isPermitted);
    }

    /**
     * @notice Make order with signature.
     * @param _txMessage Message from signer.
     * @param _signature Signature from signer.
     * @param _paymentToken Payment token address.
     * @param _price Price to transfer.
     * @param _data Data of product.
     */
    function makeOrder(
        bytes32 _txMessage,
        bytes memory _signature,
        address _paymentToken,
        uint256 _price,
        string memory _data
    ) external {
        require(permittedTokens[_paymentToken], "Invalid payment token");
        require(_price > 0, "Invalid price");
        require(
            orders[_txMessage].customer == address(0),
            "Duplicated transaction message"
        );

        bytes32 generatedTxMessage = generateTxMessage(
            _msgSender(),
            _paymentToken,
            _price,
            _data
        );
        require(
            _txMessage == generatedTxMessage,
            "Invalid transaction message"
        );

        bytes32 ethSignedHash = _txMessage.toEthSignedMessageHash();
        require(
            ethSignedHash.recover(_signature) == signer,
            "Invalid signature"
        );

        Order storage order = orders[_txMessage];
        order.customer = _msgSender();
        order.paymentToken = _paymentToken;
        order.price = _price;
        order.signature = _signature;
        order.data = _data;

        IERC20Upgradeable(_paymentToken).safeTransferFrom(
            _msgSender(),
            address(this),
            _price
        );

        emit MadeOrder(
            order.customer,
            order.paymentToken,
            order.price,
            order.signature,
            order.data
        );
    }

    // -----------View Functions-----------

    /**
     * @notice Generate transaction message, using for verifying.
     * @param _customer Customer's address.
     * @param _paymentToken Payment token address.
     * @param _price Price to transfer.
     * @param _data Data of product.
     */
    function generateTxMessage(
        address _customer,
        address _paymentToken,
        uint256 _price,
        string memory _data
    ) public pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(_customer, _paymentToken, _price, _data)
            );
    }
}
