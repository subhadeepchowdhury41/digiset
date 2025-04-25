const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Deploy the NFT contract
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("NFT contract deployed to:", nftAddress);

  // Deploy the Marketplace contract
  const Marketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("Marketplace contract deployed to:", marketplaceAddress);

  // Save the contract addresses to a config file
  const config = {
    nftAddress,
    marketplaceAddress
  };
  
  fs.writeFileSync("src/config.js", `
export const nftAddress = "${nftAddress}"
export const marketplaceAddress = "${marketplaceAddress}"
  `);
  
  console.log("Config file created with contract addresses");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });