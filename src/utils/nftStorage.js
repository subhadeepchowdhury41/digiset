import { NFTStorage, File } from 'nft.storage';

const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY || 'YOUR_NFT_STORAGE_API_KEY';

/**
 * Store an NFT with metadata on IPFS via NFT.storage
 * @param {string} name - Name of the NFT
 * @param {string} description - Description of the NFT
 * @param {File} imageFile - Image file to be stored
 * @returns {string} - The IPFS URL for the metadata
 */
export async function storeNFT(name, description, imageFile) {
  console.log("NFT Storage Key:", NFT_STORAGE_KEY);

  if (!NFT_STORAGE_KEY) {
    throw new Error("NFT Storage key is not defined");
  }
  const client = new NFTStorage({ token: NFT_STORAGE_KEY });
  
  // Store image and metadata
  const metadata = await client.store({
    name,
    description,
    image: imageFile
  });
  
  console.log("Metadata stored on IPFS with URL:", metadata.url);
  return metadata.url;
}

/**
 * Convert a base64 string to a File object
 * @param {string} dataUrl - Base64 data URL
 * @param {string} filename - Name for the file
 * @returns {File} - The converted File object
 */
export async function dataURLtoFile(dataUrl, filename) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}