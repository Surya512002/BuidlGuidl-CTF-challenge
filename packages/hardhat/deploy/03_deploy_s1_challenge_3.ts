import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log(`🚀 Deploying CtfChallenge3 to ${network.name} using ${deployer}`);

  await deploy("CtfChallenge3", {
    // This string must match the contract name in .sol
    from: deployer,
    args: ["0x03bF70f50fcF9420f27e31B47805bbd8f2f52571"],
    log: true,
    gasLimit: 1000000,
  });
};

export default func;
func.tags = ["CtfChallenge3"];

// yarn deploy --tags S1Challenge3 --network optimism --reset
