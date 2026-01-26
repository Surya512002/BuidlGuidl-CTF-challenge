import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

const solveS1Challenge11: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();
  // const signer = await ethers.getSigner(deployer);
  const challengeAddress = "0x67392ea0A56075239988B8E1E96663DAC167eF54";

  console.log("-------------------------------------------------------");
  console.log(`🔎 Calculating CREATE2 salt for: ${deployer}`);

  const originLast = parseInt(deployer.slice(-2), 16);
  const targetBitwise = originLast & 0x15;

  const factory = await ethers.getContractFactory("S1Challenge11Solver");
  const bytecode = factory.bytecode;

  let salt = 0;
  let predictedAddress = "";
  let found = false;

  // Find the magic salt
  while (!found && salt < 20000) {
    const saltHex = ethers.toBeHex(salt, 32);
    predictedAddress = ethers.getCreate2Address(
      "0x4e59b44847b379578588920cA78FbF26c0B4956C", // Standard Deterministic Proxy
      saltHex,
      ethers.keccak256(bytecode),
    );

    const senderLast = parseInt(predictedAddress.slice(-2), 16);
    if ((senderLast & 0x15) === targetBitwise) {
      console.log(`✅ Found Salt: ${salt} -> Address: ${predictedAddress}`);
      found = true;
      break;
    }
    salt++;
  }

  console.log("🛰 Deploying Solver...");
  const deployment = await hre.deployments.deploy("S1Challenge11Solver", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: ethers.toBeHex(salt, 32),
  });

  const solver = await ethers.getContractAt("S1Challenge11Solver", deployment.address);

  try {
    console.log("🚀 Calling mintFlag() via Solver...");
    const tx = await solver.solve(challengeAddress);
    await tx.wait();
    console.log("✨ SUCCESS! Flag #11 is yours.");
  } catch (error: any) {
    console.log(error, "❌ Reverted. Logic: senderLast & 0x15 must match originLast & 0x15.");
  }
};

export default solveS1Challenge11;
solveS1Challenge11.tags = ["S1Challenge11"]; // FIX: Matches your CLI command

// yarn deploy --tags S1Challenge11 --network optimism
