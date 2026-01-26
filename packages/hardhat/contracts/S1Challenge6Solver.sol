// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IChallenge6 {
    function count() external view returns (uint256);
    function mintFlag(uint256 _code) external;
}

contract CtfChallenge6 {
    IChallenge6 public challenge;

    constructor(address _challengeAddress) {
        challenge = IChallenge6(_challengeAddress);
    }

    function name() external pure returns (string memory) {
        return "BG CTF Challenge 6 Solution";
    }

    function startMint() external {
        uint256 code = challenge.count() << 8;

        // We want gasleft() to be between 190,000 and 200,000.
        // We target 198,000 to allow for the small overhead of the call itself.
        while (gasleft() > 198000) {
            // Burn a tiny amount of gas
            uint256 dummy = 0;
            dummy++;
        }

        challenge.mintFlag(code);
    }
}