// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@thirdweb-dev/contracts/governance/VoteERC20.sol";

contract SkillDAO is VoteERC20 {
    constructor(
        string memory _name,
        string memory _symbol,
        address _primarySaleRecipient
    )
        VoteERC20(
            _name,
            _symbol,
            _primarySaleRecipient
        )
    {}
}
