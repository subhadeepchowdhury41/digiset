# NFT Marketplace

A decentralized NFT marketplace built with Hardhat, NFT.storage, and Next.js.

## Features

- Mint your own NFTs and store metadata on IPFS via NFT.storage
- List NFTs for sale on the marketplace
- Browse all NFTs listed for sale
- Purchase NFTs with ETH
- View your owned NFTs
- Dashboard to track your created and sold NFTs

## Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MetaMask](https://metamask.io/) (or another Ethereum wallet)
- [NFT.storage](https://nft.storage/) API key

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/nft-marketplace.git
cd nft-marketplace
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_NFT_STORAGE_KEY=your_nft_storage_api_key_here
```

### 4. Start the local Hardhat node

```bash
npm run chain
```

This will start a local Ethereum blockchain with 20 accounts pre-loaded with ETH for testing.

### 5. Deploy the contracts

In a new terminal window:

```bash
npm run deploy
```

This will deploy the NFT and Marketplace contracts to your local network and create a configuration file with the contract addresses.

### 6. Start the frontend application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### 7. Connect MetaMask to the local network

- Open MetaMask
- Add a new network:
  - Network Name: Hardhat Local
  - New RPC URL: http://127.0.0.1:8545/
  - Chain ID: 1337
  - Currency Symbol: ETH
- Import one of the test accounts using the private keys printed when you started the Hardhat node

## Project Structure

```
nft-marketplace/
├── contracts/           # Smart contracts
├── scripts/             # Contract deployment scripts
├── test/                # Contract tests
├── src/
│   ├── artifacts/       # Compiled contract ABIs (generated)
│   ├── utils/           # Utility functions
│   └── app/             # Next.js app directory
├── hardhat.config.js    # Hardhat configuration
└── next.config.js       # Next.js configuration
```

## Smart Contracts

### NFT.sol

An ERC-721 token contract for minting new NFTs.

### Marketplace.sol

The marketplace contract that handles listing, buying, and tracking NFTs.

## Scripts

### deploy.js

Deploys the NFT and Marketplace contracts to the blockchain.

## How to Use

1. **Connect Wallet**: Click the "Connect Wallet" button to connect your MetaMask wallet.
2. **Create NFT**: Navigate to "Sell NFT" to create a new NFT. Fill in the details, upload an image, and click "Create & List NFT".
3. **Browse NFTs**: On the homepage, you can see all NFTs listed for sale. Click "Buy" to purchase an NFT.
4. **My NFTs**: Navigate to "My NFTs" to see all NFTs you own.
5. **Dashboard**: Navigate to "Dashboard" to see all NFTs you've created and sold.

## Development

### Running Tests

```bash
npm test
```

### Modifying Smart Contracts

If you modify the smart contracts, you'll need to redeploy them:

```bash
npm run deploy
```

## License

MIT

## Acknowledgements

- [Hardhat](https://hardhat.org/)
- [NFT.storage](https://nft.storage/)
- [Next.js](https://nextjs.org/)
- [OpenZeppelin](https://openzeppelin.com/)
