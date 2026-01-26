import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

const solveS1Challenge10: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();
  const signer = await ethers.getSigner(deployer);

  // The NFT Contract Address
  const nftAddress = "0xc1Ebd7a78FE7c075035c516B916A7FB3f33c26cE";

  const nftABI = [
    "function tokenIdCounter() view returns (uint256)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function tokenIdToChallengeId(uint256 tokenId) view returns (uint256)",
    "function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) external",
  ];

  const nftContract = new ethers.Contract(nftAddress, nftABI, signer);

  console.log("-------------------------------------------------------");
  console.log(`🔍 Locating Flag 1 and Flag 9 IDs for: ${deployer}`);

  let token1Id: number | null = null;
  let token9Id: number | null = null;

  // We get the total number of tokens minted to know how far to scan
  const currentCounter = await nftContract.tokenIdCounter();
  const maxSearch = Number(currentCounter);

  // Scan backwards from latest tokens (more efficient)
  for (let id = maxSearch; id >= 0; id--) {
    try {
      const owner = await nftContract.ownerOf(id);
      if (owner.toLowerCase() === deployer.toLowerCase()) {
        const challengeId = await nftContract.tokenIdToChallengeId(id);

        if (challengeId === 1n) token1Id = id;
        if (challengeId === 9n) token9Id = id;
      }
      if (token1Id !== null && token9Id !== null) break;
    } catch (e) {
      console.log(e);
      continue;
    }
  }

  if (token1Id === null || token9Id === null) {
    console.log(`❌ Error: Could not find your tokens.`);
    console.log(`Status -> Ch1 Found: ${token1Id !== null} | Ch9 Found: ${token9Id !== null}`);
    return;
  }

  console.log(`✅ Found Token 1 (ID: ${token1Id}) and Token 9 (ID: ${token9Id})`);

  // Solution: Call safeTransferFrom with Token 9 ID as the 'data'
  // Data must be hex, padded to 64 characters (32 bytes)
  const data = ethers.toBeHex(token9Id, 32);

  console.log(`🛰  Executing safeTransferFrom callback...`);

  try {
    // Explicitly call the overloaded safeTransferFrom function
    const tx = await nftContract.getFunction("safeTransferFrom(address,address,uint256,bytes)")(
      deployer,
      nftAddress, // To: Challenge 10 (which is the NFT contract itself)
      token1Id, // TokenId: Challenge 1 ID
      data, // Data: Challenge 9 ID
    );

    console.log("⏳ Transaction sent. Waiting for Flag 10 mint...");
    await tx.wait();
    console.log("✨ SUCCESS! Flag #10 acquired.");
  } catch (error: any) {
    console.log("❌ Execution Reverted.");
    console.error("Reason:", error.message);
  }
};

export default solveS1Challenge10;
solveS1Challenge10.tags = ["S1Challenge10"];

//yarn deploy --tags S1Challenge10 --network optimism
