import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployS1Challenge6: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const { ethers } = hre;

  const challengeAddress = "0x75961D2da1DEeBaEC24cD0E180187E6D55F55840";

  const deployment = await deploy("CtfChallenge6", {
    from: deployer,
    args: [challengeAddress],
    log: true,
  });

  const solver = await ethers.getContractAt("CtfChallenge6", deployment.address);

  // ... existing imports ...

  console.log("🛰 Sending transaction with MUCH higher gas for burning...");

  try {
    // 800,000 is safe. The contract will only use what it needs to hit the 198k target.
    const tx = await solver.startMint({
      gasLimit: 800000,
    });
    console.log("⏳ Transaction sent... burning gas to hit the window...");
    await tx.wait();
    console.log("✨ SUCCESS! Flag #10 is yours.");
  } catch (error: any) {
    console.log("❌ Failed.");
    // If it still fails, it might be the 'code' (count) is wrong.
    console.error("Reason:", error.message);
  }
  // ...
};

export default deployS1Challenge6;
deployS1Challenge6.tags = ["S1Challenge6"];

// yarn deploy --tags S1Challenge6 --network optimism
