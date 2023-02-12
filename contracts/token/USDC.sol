// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDC is ERC20 {
    constructor(
        address[] memory _initialHolders,
        uint256 _amount
    ) ERC20("USD Coin", "USDC") {
        for (uint256 i = 0; i < _initialHolders.length; ++i)
            _mint(_initialHolders[0], _amount);
    }
}
