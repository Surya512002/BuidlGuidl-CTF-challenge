import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deploySolution: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // --- DELETE OR COMMENT OUT THIS LINE ---
  // const challenge2 = await hre.ethers.getContract("Challenge2");

  // --- ADD THIS LINE ---
  // PASTE THE REAL ADDRESS FROM THE WEBSITE BELOW
  const challenge2Address = "0x0b997E0a306c47EEc755Df75fad7F41977C5582d";

  console.log("😈 Attacking Challenge 2 at:", challenge2Address);

  await deploy("Challenge2Solution", {
    from: deployer,
    args: [challenge2Address], // Use the variable you just created
    log: true,
    autoMine: true,
  });
};

export default deploySolution;
deploySolution.tags = ["Challenge2Solution"];
