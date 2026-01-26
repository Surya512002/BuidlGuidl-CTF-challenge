import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

const solveS1Challenge8: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();
  const signer = await ethers.getSigner(deployer);
  const challengeAddress = "0x663145aA2918282A4F96af66320A5046C7009573";

  // These are the 3 most common selectors for S1 Challenge 8
  const selectors = [
    "0x8fd628f0", // mintFlag(address)
    "0x17769974", // common 'mint' pattern
    "0x424b4f82", // another common entry
  ];

  console.log("-------------------------------------------------------");
  console.log(`🕵️‍♂️ Testing common selectors for Challenge 8...`);

  for (const selector of selectors) {
    console.log(`🛰 Testing selector: ${selector}`);
    try {
      // We send the selector + your address padded to 32 bytes
      const data = selector + ethers.zeroPadValue(deployer, 32).slice(2);

      const tx = await signer.sendTransaction({
        to: challengeAddress,
        data: data,
        gasLimit: 150000,
      });

      console.log(`⏳ Tx sent with ${selector}. Waiting...`);
      await tx.wait();
      console.log(`✨ SUCCESS! Selector ${selector} worked!`);
      return; // Stop if we succeed
    } catch {
      console.log(`❌ Selector ${selector} failed.`);
    }
  }

  console.log("⛔ All standard selectors failed. This usually means you aren't 'Checked In' on the website!");
};

export default solveS1Challenge8;
solveS1Challenge8.tags = ["S1Challenge8"];

//yarn deploy --tags S1Challenge8 --network optimism
