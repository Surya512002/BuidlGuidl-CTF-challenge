import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

const solveS1Challenge9: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();
  // const signer = await ethers.getSigner(deployer);
  const challengeAddress = "0x1Fd913F2250ae5A4d9F8881ADf3153C6e5E2cBb1";

  console.log("-------------------------------------------------------");
  console.log(`🕵️‍♂️ Cracking Challenge 9 Storage for: ${deployer}`);

  // 1. Read private variables from storage
  // Slot 0: nftContract
  // Slot 1: password
  // Slot 2: count
  const passwordHex = await ethers.provider.getStorage(challengeAddress, 1);
  const countHex = await ethers.provider.getStorage(challengeAddress, 2);
  const count = BigInt(countHex);

  console.log(`🔑 Raw Password: ${passwordHex}`);
  console.log(`🔢 Current Count: ${count}`);

  // 2. Replicate the Masking Logic
  // bytes32 mask = ~(bytes32(uint256(0xFF) << ((31 - (count % 32)) * 8)));
  const shiftAmount = (31n - (count % 32n)) * 8n;
  const maskValue = ~(0xffn << shiftAmount);

  // Note: bytes32 is 256 bits, so we need to ensure the mask is 256 bits
  const maskHex = "0x" + (maskValue & ((1n << 256n) - 1n)).toString(16).padStart(64, "0");

  // 3. Calculate New Password
  // newPassword = password & mask
  const passwordBN = BigInt(passwordHex);
  const maskBN = BigInt(maskHex);
  const newPasswordBN = passwordBN & maskBN;
  const newPassword = "0x" + newPasswordBN.toString(16).padStart(64, "0");

  console.log(`🎭 Calculated Mask: ${maskHex}`);
  console.log(`🎯 Expected Password: ${newPassword}`);

  // 4. Submit the Flag
  const challengeContract = await ethers.getContractAt("Season1Challenge9", challengeAddress);

  try {
    const tx = await challengeContract.mintFlag(newPassword);
    console.log("⏳ Sending transaction...");
    await tx.wait();
    console.log("✨ SUCCESS! Flag #13 is yours.");
  } catch (error: any) {
    console.log("❌ Failed!");
    console.error("Reason:", error.reason || error.message);
  }
};

export default solveS1Challenge9;
solveS1Challenge9.tags = ["S1Challenge9"];

//yarn deploy --tags S1Challenge9 --network optimism
