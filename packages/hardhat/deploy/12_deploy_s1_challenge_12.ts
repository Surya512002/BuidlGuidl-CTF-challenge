//ethers file
// import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

const solveS1Challenge12: DeployFunction = async function (hre) {
  // const { deployer } = await hre.getNamedAccounts();
  // const signer = await hre.ethers.getSigner(deployer);
  const challengeAddress = "0x8c7A3c2c44aB16f693d1731b10C271C7d2967769";
  const challenge = await hre.ethers.getContractAt("Season1Challenge12", challengeAddress);

  console.log("-------------------------------------------------------");
  console.log("🛠️  Season 1 Finale: Challenge 12 (Fjord/Prague Ready)");

  // --- STEP 1: PRE-MINT ---
  const tx = await challenge.preMintFlag();
  const receipt = await tx.wait();
  if (!receipt) throw new Error("Pre-mint failed");

  const targetBlockNumber = Number(receipt.blockNumber) + 2;
  console.log(`✅ Registered at: ${receipt.blockNumber}. Target: ${targetBlockNumber}`);

  // --- STEP 2: WAIT ---
  while (Number(await hre.ethers.provider.getBlockNumber()) <= targetBlockNumber) {
    process.stdout.write(".");
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log("\n💎 Target block reached. Constructing header...");

  // --- STEP 3: FETCH & ENCODE ---
  const blockData: any = await hre.ethers.provider.send("eth_getBlockByNumber", [
    hre.ethers.toBeHex(targetBlockNumber),
    false,
  ]);

  /**
   * Helper to fix "invalid BytesLike" by ensuring even length
   * and converting 0x0 values to 0x for RLP
   */
  const evenPad = (hex: any) => {
    if (!hex || hex === "0x" || hex === "0x0" || hex === "0x00") return "0x";
    let clean = hex.startsWith("0x") ? hex.slice(2) : hex;
    if (clean.length % 2 !== 0) clean = "0" + clean;
    return "0x" + clean;
  };

  const blockHeader: string[] = [
    evenPad(blockData.parentHash),
    evenPad(blockData.sha3Uncles),
    evenPad(blockData.miner),
    evenPad(blockData.stateRoot),
    evenPad(blockData.transactionsRoot),
    evenPad(blockData.receiptsRoot),
    evenPad(blockData.logsBloom),
    evenPad(blockData.difficulty),
    evenPad(blockData.number),
    evenPad(blockData.gasLimit),
    evenPad(blockData.gasUsed),
    evenPad(blockData.timestamp),
    evenPad(blockData.extraData),
    evenPad(blockData.mixHash),
    "0x0000000000000000", // standard 8-byte nonce
    evenPad(blockData.baseFeePerGas),
    evenPad(blockData.withdrawalsRoot),
    evenPad(blockData.blobGasUsed),
    evenPad(blockData.excessBlobGas),
    evenPad(blockData.parentBeaconBlockRoot),
    evenPad(blockData.requestsHash),
  ].filter(f => f !== undefined);

  // Use ethers v6 RLP encoding
  let encoded: string;
  try {
    encoded = hre.ethers.encodeRlp(blockHeader);
  } catch (e: any) {
    console.log("❌ RLP Encoding Error:", e.message);
    return;
  }

  const computedHash = hre.ethers.keccak256(encoded);
  console.log("Computed hash:", computedHash);
  console.log("Original hash:", blockData.hash);

  if (computedHash !== blockData.hash) {
    console.log("❌ Hash mismatch! The network likely added or removed a field.");
    console.log(`Length of header array used: ${blockHeader.length}`);
    return;
  }

  // --- STEP 4: MINT ---
  console.log("🛰️  Sending mintFlag...");
  try {
    const mintTx = await challenge.mintFlag(encoded, { gasLimit: 1000000 });
    await mintTx.wait();
    console.log("✨ SUCCESS! FLAG #12 ACQUIRED. SEASON 1 COMPLETE! 🚩");
  } catch (error: any) {
    console.error("❌ Transaction Reverted:", error.message);
  }
};

export default solveS1Challenge12;
solveS1Challenge12.tags = ["S1Challenge12"];

//yarn deploy --tags S1Challenge12 --network optimism --reset
