'use client';
import './globals.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkWalletConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("Please install MetaMask or another Ethereum wallet");
    }
  };

  return (
    <html lang="en">
      <body>
        <div>
          <nav className="p-6 flex items-center justify-between shadow-md shadow-gray-600">
            <div className="flex-1">
              <Link href="/" className="text-2xl font-bold">
                NFT Marketplace
              </Link>
            </div>
            <div className="flex">
              <Link href="/" className="mr-6 text-pink-500 hover:text-pink-700">
                Home
              </Link>
              <Link href="/create-nft" className="mr-6 text-pink-500 hover:text-pink-700">
                Sell NFT
              </Link>
              <Link href="/my-nfts" className="mr-6 text-pink-500 hover:text-pink-700">
                My NFTs
              </Link>
              <Link href="/dashboard" className="mr-6 text-pink-500 hover:text-pink-700">
                Dashboard
              </Link>
            </div>
            <div>
              {account ? (
                <p className="text-sm">
                  Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}
                </p>
              ) : (
                <button
                  className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
                  onClick={connectWallet}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </nav>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}