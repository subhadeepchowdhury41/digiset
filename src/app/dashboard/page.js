'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTArtifact from '../../artifacts/contracts/NFT.sol/NFT.json';
import MarketplaceArtifact from '../../artifacts/contracts/Marketplace.sol/NFTMarketplace.json';
import { nftAddress, marketplaceAddress } from '../../config';

export default function Dashboard() {
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    try {
      setLoadingState('loading');
      
      if (!window.ethereum) {
        console.error("Ethereum provider not available");
        setLoadingState('ethereum-not-available');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tokenContract = new ethers.Contract(nftAddress, NFTArtifact.abi, provider);
      const marketContract = new ethers.Contract(marketplaceAddress, MarketplaceArtifact.abi, signer);
      
      // Get all NFTs created by the connected wallet
      const data = await marketContract.fetchItemsCreated();
      
      const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        // For a real app, you would fetch metadata from tokenUri
        const meta = {
          name: `NFT #${i.tokenId}`,
          description: `This is NFT #${i.tokenId} created by you`,
          image: `https://via.placeholder.com/350?text=CreatedNFT+${i.tokenId}`
        };
        
        const price = ethers.formatEther(i.price.toString());
        
        return {
          price,
          tokenId: Number(i.tokenId),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
          sold: i.sold
        };
      }));
      
      // Filter for items that have been sold
      const soldItems = items.filter(i => i.sold);
      
      setNfts(items);
      setSold(soldItems);
      setLoadingState('loaded');
    } catch (error) {
      console.error("Error loading created NFTs:", error);
      setLoadingState('error');
    }
  }

  if (loadingState === 'loading') 
    return <h1 className="px-20 py-10 text-3xl">Loading your created NFTs...</h1>
    
  if (loadingState === 'ethereum-not-available') 
    return <h1 className="px-20 py-10 text-3xl">Please install MetaMask to view your created NFTs</h1>
  
  if (loadingState === 'error') 
    return <h1 className="px-20 py-10 text-3xl">Error loading your NFTs. Please try again.</h1>
  
  if (loadingState === 'loaded' && !nfts.length) 
    return <h1 className="px-20 py-10 text-3xl">No NFTs created</h1>
  
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Creator Dashboard</h1>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Items Created ({nfts.length})</h2>
        <div className="flex flex-wrap">
          {nfts.map((nft, i) => (
            <div key={i} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
              <div className="border shadow rounded-lg overflow-hidden">
                <img src={nft.image} className="w-full h-64 object-cover" />
                <div className="p-4">
                  <p className="h-16 text-2xl font-semibold">{nft.name}</p>
                  <div className="h-20 overflow-hidden">
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">{nft.price} ETH</p>
                  {nft.sold ? (
                    <p className="text-green-500 font-bold">Sold</p>
                  ) : (
                    <p className="text-yellow-500 font-bold">Listed for Sale</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {sold.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Items Sold ({sold.length})</h2>
          <div className="flex flex-wrap">
            {sold.map((nft, i) => (
              <div key={i} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                <div className="border shadow rounded-lg overflow-hidden">
                  <img src={nft.image} className="w-full h-64 object-cover" />
                  <div className="p-4">
                    <p className="h-16 text-2xl font-semibold">{nft.name}</p>
                    <div className="h-20 overflow-hidden">
                      <p className="text-gray-400">{nft.description}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-black">
                    <p className="text-2xl font-bold text-white">Sold for {nft.price} ETH</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}