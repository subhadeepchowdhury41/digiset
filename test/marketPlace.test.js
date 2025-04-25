const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT Marketplace", function () {
  let NFT;
  let nft;
  let Marketplace;
  let marketplace;
  let owner;
  let addr1;
  let addr2;
  
  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy NFT contract
    NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    
    // Deploy Marketplace contract
    Marketplace = await ethers.getContractFactory("NFTMarketplace");
    marketplace = await Marketplace.deploy();
  });
  
  describe("NFT Contract", function () {
    it("Should create a new token", async function () {
      // Create a token
      await nft.createToken("https://www.mytokenlocation.com");
      
      // Check if token exists
      const tokenURI = await nft.tokenURI(1);
      expect(tokenURI).to.equal("https://www.mytokenlocation.com");
    });
  });
  
  describe("Marketplace Contract", function () {
    it("Should create market item", async function () {
      // Create a token
      await nft.createToken("https://www.mytokenlocation.com");
      
      // Approve marketplace contract
      const nftContractAddress = await nft.getAddress();
      const marketplaceAddress = await marketplace.getAddress();
      await nft.approve(marketplaceAddress, 1);
      
      // Get listing price
      const listingPrice = await marketplace.getListingPrice();
      
      // Create market item
      await marketplace.createMarketItem(
        nftContractAddress,
        1,
        ethers.parseEther("1"), // 1 ETH
        { value: listingPrice }
      );
      
      // Check if market item exists
      const items = await marketplace.fetchMarketItems();
      expect(items.length).to.equal(1);
      expect(items[0].price).to.equal(ethers.parseEther("1"));
    });
    
    it("Should execute market sale", async function () {
      // Create a token
      await nft.connect(addr1).createToken("https://www.mytokenlocation.com");
      
      // Approve marketplace contract
      const nftContractAddress = await nft.getAddress();
      const marketplaceAddress = await marketplace.getAddress();
      await nft.connect(addr1).approve(marketplaceAddress, 1);
      
      // Get listing price
      const listingPrice = await marketplace.getListingPrice();
      
      // Create market item
      await marketplace.connect(addr1).createMarketItem(
        nftContractAddress,
        1,
        ethers.parseEther("1"), // 1 ETH
        { value: listingPrice }
      );
      
      // Execute sale
      await marketplace.connect(addr2).createMarketSale(
        nftContractAddress,
        1,
        { value: ethers.parseEther("1") }
      );
      
      // Check ownership
      const owner = await nft.ownerOf(1);
      expect(owner).to.equal(addr2.address);
      
      // Check items
      const myItems = await marketplace.connect(addr2).fetchMyNFTs();
      expect(myItems.length).to.equal(1);
    });
  });
});