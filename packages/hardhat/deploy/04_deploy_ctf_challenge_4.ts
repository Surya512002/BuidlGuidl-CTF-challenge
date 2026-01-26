import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HDNodeWallet, Mnemonic } from "ethers";

const solveS1Challenge4: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();
  // const _signer = await hre.ethers.getSigner(deployer);

  // 1. The "Secret" Mnemonic used by Scaffold-ETH/Hardhat
  const mnemonicPhrase = "test test test test test test test test test test test junk";
  const derivationPath = "m/44'/60'/0'/0/12";

  // 2. Derive the Secret Minter Account
  const mnemonic = Mnemonic.fromPhrase(mnemonicPhrase);
  const secretMinter = HDNodeWallet.fromMnemonic(mnemonic, derivationPath);

  console.log("-------------------------------------------------------");
  console.log(`🔑 Secret Minter Address: ${secretMinter.address}`);
  console.log(`👤 Your Wallet (msg.sender): ${deployer}`);
  console.log("-------------------------------------------------------");

  // 3. Prepare the Message Hash
  // Logic: keccak256(abi.encode("BG CTF Challenge 4", your_address))
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  const encodedMessage = abiCoder.encode(["string", "address"], ["BG CTF Challenge 4", deployer]);
  const messageHash = ethers.keccak256(encodedMessage);

  // 4. Sign the message using the SECRET account's private key
  // We use signMessage which handles the "\x19Ethereum Signed Message" prefix automatically
  console.log("✍️  Signing with the secret account...");
  const signature = await secretMinter.signMessage(ethers.getBytes(messageHash));

  // 5. Call the contract using YOUR MetaMask (signer)
  const challengeAddress = "0x9c4A48Dd70a3219877a252E9a0d45Fc1Db808a1D";
  const challengeContract = await ethers.getContractAt("Season1Challenge4", challengeAddress);

  console.log("🛰  Sending transaction...");
  try {
    // Note: We pass secretMinter.address as the first argument
    const tx = await challengeContract.mintFlag(secretMinter.address, signature);
    console.log(`🔗 Tx Hash: ${tx.hash}`);
    await tx.wait();
    console.log("✨ SUCCESS! Flag #7 is yours.");
  } catch (error: any) {
    console.log("❌ Failed!");
    console.error("Reason:", error.reason || error.message);
  }
};

export default solveS1Challenge4;
solveS1Challenge4.tags = ["S1Challenge4"];
