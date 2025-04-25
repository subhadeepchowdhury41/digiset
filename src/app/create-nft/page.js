'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { NFTStorage } from 'nft.storage';
import NFTArtifact from '../../artifacts/contracts/NFT.sol/NFT.json';
import MarketplaceArtifact from '../../artifacts/contracts/Marketplace.sol/NFTMarketplace.json';
import { nftAddress, marketplaceAddress } from '../../config';

export default function CreateNFT() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({ name: '', description: '', price: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY || 'YOUR_NFT_STORAGE_API_KEY';
  
  async function onChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Error processing file. Please try again.");
    }
  }

  async function uploadToIPFS() {
    console.log(NFT_STORAGE_KEY);
    
    const { name, description } = formInput;
    if (!name || !description || !fileUrl) return null;
    
    setIsUploading(true);
    
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      
      const client = new NFTStorage({ token: NFT_STORAGE_KEY });
      
      const metadata = await client.store({
        name,
        description,
        image: new File([blob], 'nft.png', { type: 'image/png' })
      });
      
      setIsUploading(false);
      console.log("Metadata stored on IPFS with URL:", metadata.url);
      return metadata.url;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      setIsUploading(false);
      alert("Error uploading to IPFS. Please try again.");
      return null;
    }
  }
  
  async function createNFT() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) {
      alert("Please fill all fields and upload an image");
        return;
      }
      
      // First, upload to IPFS
      const url = await uploadToIPFS();
      if (!url) {
        alert("Error uploading to IPFS");
        return;
      }
      
      setIsCreating(true);
      
      try {
        // Create NFT
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // Mint NFT
        let contract = new ethers.Contract(nftAddress, NFTArtifact.abi, signer);
        let transaction = await contract.createToken(url);
        const tx = await transaction.wait();
        
        // Get tokenId from event
        const event = tx.logs.find(async x => 
          x.fragment && x.fragment.name === 'Transfer' && x.args.to.toLowerCase() === (await signer.getAddress()).toLowerCase()
        );
        
        const tokenId = event.args.tokenId;
        
        // Approve marketplace contract to transfer NFT
        transaction = await contract.approve(marketplaceAddress, tokenId);
        await transaction.wait();
        
        // List NFT on marketplace
        contract = new ethers.Contract(marketplaceAddress, MarketplaceArtifact.abi, signer);
        const listingPrice = await contract.getListingPrice();
        
        // Convert price from ETH to wei
        const nftPrice = ethers.parseEther(price);
        
        transaction = await contract.createMarketItem(
          nftAddress, 
          tokenId, 
          nftPrice, 
          { value: listingPrice }
        );
        
        await transaction.wait();
        
        setIsCreating(false);
        router.push('/');
      } catch (error) {
        console.error("Error creating NFT:", error);
        setIsCreating(false);
        alert("Error creating NFT. See console for details.");
      }
    }
  
    return (
      <div className="flex justify-center pt-10">
        <div className="w-1/2 flex flex-col pb-12">
          <h1 className="text-4xl font-bold mb-8">Create and Sell Your NFT</h1>
          
          <input 
            placeholder="Asset Name"
            className="mt-2 border rounded p-4 text-black"
            onChange={e => setFormInput({ ...formInput, name: e.target.value })}
          />
          
          <textarea
            placeholder="Asset Description"
            className="mt-2 border rounded p-4 text-black"
            onChange={e => setFormInput({ ...formInput, description: e.target.value })}
          />
          
          <input
            placeholder="Asset Price in ETH"
            className="mt-2 border rounded p-4 text-black"
            type="number"
            step="0.01"
            onChange={e => setFormInput({ ...formInput, price: e.target.value })}
          />
          
          <div className="mt-4">
            <p className="font-bold">Upload Image</p>
            <input
              type="file"
              name="Asset"
              className="mt-2"
              accept="image/*"
              onChange={onChange}
            />
          </div>
          
          {fileUrl && (
            <div className="mt-4">
              <p className="font-bold">Preview:</p>
              <img className="mt-2 rounded" width="350" src={fileUrl} alt="NFT preview" />
            </div>
          )}
          
          <button 
            onClick={createNFT}
            disabled={isUploading || isCreating}
            className={`mt-8 font-bold py-3 px-6 rounded ${
              isUploading || isCreating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-pink-500 hover:bg-pink-700 text-white'
            }`}
          >
            {isUploading ? 'Uploading to IPFS...' : 
             isCreating ? 'Creating NFT...' : 
             'Create & List NFT'}
          </button>
        </div>
      </div>
    );
  }