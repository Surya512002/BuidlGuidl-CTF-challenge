// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IChallenge2 {
    // The specific function name for Challenge 2 (S1)
    function justCallMe() external; 
}

contract Challenge2Solution {
    constructor(address _target) {
        // Call the correct function name
        IChallenge2(_target).justCallMe();
    }
}