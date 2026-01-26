import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployS2Challenge4: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const { ethers } = hre;

  // Official S2 Challenge 4 Address (Buenos Aires)
  const challengeAddress = "0x49918e16349416Ae13827758Bc8F8267e25D7B1c";

  console.log("-------------------------------------------------------");
  console.log(`🚀 Deploying Solver for Challenge 4...`);
  console.log(`👤 Using account: ${deployer}`);

  // Deploy and fund with 0.005 ETH (plenty for 1 gwei + gas)
  // We only need a tiny amount. 0.0001 ETH is plenty for 1 Gwei + gas
  const deployment = await deploy("S2Challenge4Solver", {
    from: deployer,
    args: [challengeAddress],
    value: ethers.parseUnits("0.0001", "ether").toString(),
    log: true,
    autoMine: true,
  });

  const solver = await ethers.getContractAt("S2Challenge4Solver", deployment.address);

  console.log("🛰  Calling solve()...");

  try {
    const tx = await solver.solve({
      gasLimit: 300000, // Explicit gas limit for safety
    });
    console.log("⏳ Transaction sent... waiting for confirmation.");
    await tx.wait();
    console.log("✨ SUCCESS! Flag #8 (Pay Me) should be yours.");
  } catch (error: any) {
    console.log("❌ Failed!");
    console.error("Reason:", error.reason || error.message);
  }
};

export default deployS2Challenge4;
deployS2Challenge4.tags = ["S2Challenge4"];

//yarn deploy --tags S2Challenge4 --network optimism
