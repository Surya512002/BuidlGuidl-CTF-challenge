//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface IChallenge11 {
    function mintFlag() external;
}

contract S1Challenge11Solver {
    function solve(address _challenge) external {
        IChallenge11(_challenge).mintFlag();
    }
}