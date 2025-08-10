// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@thirdweb-dev/contracts/token/TokenERC721.sol";

contract SkillBadge is TokenERC721 {
    constructor(
        string memory _name,
        string memory _symbol,
        address _primarySaleRecipient
    )
        TokenERC721(
            _name,
            _symbol,
            _primarySaleRecipient
        )
    {}
}
