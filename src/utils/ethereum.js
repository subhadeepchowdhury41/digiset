import { ethers } from 'ethers';
import NFTArtifact from '../artifacts/contracts/NFT.sol/NFT.json';
import MarketplaceArtifact from '../artifacts/contracts/Marketplace.sol/NFTMarketplace.json';

export async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      return {
        address: accounts[0],
        provider,
        signer
      };
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      throw error;
    }
  } else {
    throw new Error("Please install MetaMask to use this application");
  }
}

export async function fetchContract(contractAddress, contractAbi, signerOrProvider) {
  return new ethers.Contract(contractAddress, contractAbi, signerOrProvider);
}

export async function mintNFT(contractAddress, tokenURI, signer) {
  const nftContract = new ethers.Contract(contractAddress, NFTArtifact.abi, signer);
  const transaction = await nftContract.createToken(tokenURI);
  return transaction.wait();
}

export async function approveMarketplace(nftAddress, marketplaceAddress, tokenId, signer) {
  const nftContract = new ethers.Contract(nftAddress, NFTArtifact.abi, signer);
  const transaction = await nftContract.approve(marketplaceAddress, tokenId);
  return transaction.wait();
}

export async function listNFT(marketplaceAddress, nftAddress, tokenId, price, signer) {
  const marketplaceContract = new ethers.Contract(marketplaceAddress, MarketplaceArtifact.abi, signer);
  const listingPrice = await marketplaceContract.getListingPrice();
  
  const transaction = await marketplaceContract.createMarketItem(
    nftAddress,
    tokenId,
    ethers.parseEther(price.toString()),
    { value: listingPrice }
  );
  
  return transaction.wait();
}

export async function buyNFT(marketplaceAddress, nftAddress, itemId, price, signer) {
  const marketplaceContract = new ethers.Contract(marketplaceAddress, MarketplaceArtifact.abi, signer);
  
  const transaction = await marketplaceContract.createMarketSale(
    nftAddress,
    itemId,
    { value: ethers.parseEther(price.toString()) }
  );
  
  return transaction.wait();
}