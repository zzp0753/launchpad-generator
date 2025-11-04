// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SaleFixed is Ownable {
    string public saleName;

    constructor(string memory _name) Ownable(msg.sender) {
        saleName = _name;
    }
}
