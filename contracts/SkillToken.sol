// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@thirdweb-dev/contracts/token/TokenERC20.sol";

contract SkillToken is TokenERC20 {
    constructor(
        string memory _name,
        string memory _symbol,
        address _primarySaleRecipient
    )
        TokenERC20(
            _name,
            _symbol,
            _primarySaleRecipient
        )
    {}
}
