import { ethers } from 'ethers';

// Wallet utility functions for course payments
export class WalletService {
    private provider: any = null;
    private signer: any = null;

    async connectWallet(): Promise<{ address: string; balance: string }> {
        if (!window.ethereum) {
            throw new Error('MetaMask or another Web3 wallet is required. Please install MetaMask.');
        }

        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            this.provider = new ethers.BrowserProvider(window.ethereum);
            this.signer = await this.provider.getSigner();

            const address = await this.signer.getAddress();
            const balance = await this.provider.getBalance(address);
            const balanceInEth = ethers.formatEther(balance);

            return {
                address,
                balance: balanceInEth
            };
        } catch (error: any) {
            if (error.code === 4001) {
                throw new Error('Please connect to MetaMask to continue with the course purchase.');
            }
            throw new Error(`Failed to connect wallet: ${error.message}`);
        }
    }

    async openWallet(): Promise<{ address: string; balance: string }> {
        if (!window.ethereum) {
            throw new Error('MetaMask or another Web3 wallet is required. Please install MetaMask.');
        }

        try {
            // First ensure wallet is connected
            const walletInfo = await this.connectWallet();

            // Open MetaMask interface to show transaction history and wallet details
            await window.ethereum.request({
                method: 'wallet_requestPermissions',
                params: [{ eth_accounts: {} }]
            });

            // Alternative method to open MetaMask (works better in some cases)
            if (window.ethereum.isMetaMask) {
                // This will open the MetaMask popup
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            }

            return walletInfo;
        } catch (error: any) {
            if (error.code === 4001) {
                throw new Error('Please connect to MetaMask to view your wallet.');
            }
            throw new Error(`Failed to open wallet: ${error.message}`);
        }
    }

    async payForCourse(coursePrice: string, recipientAddress?: string): Promise<string> {
        if (!this.provider || !this.signer) {
            throw new Error('Wallet not connected. Please connect your wallet first.');
        }

        try {
            const priceInWei = ethers.parseEther(coursePrice);

            // For demo purposes, we'll send to a default address if no recipient is provided
            const defaultRecipient = '0x742d35Cc6B8B97b3f4b2B8dE8cE00bF6A7E5A5c5'; // Demo address
            const recipient = recipientAddress || defaultRecipient;

            const transaction = {
                to: recipient,
                value: priceInWei,
                gasLimit: 21000, // Standard gas limit for ETH transfer
            };

            const tx = await this.signer.sendTransaction(transaction);

            // Wait for transaction confirmation
            const receipt = await tx.wait();

            return receipt.hash;
        } catch (error: any) {
            if (error.code === 'ACTION_REJECTED') {
                throw new Error('Transaction was rejected by user.');
            }
            if (error.code === 'INSUFFICIENT_FUNDS') {
                throw new Error('Insufficient funds to complete the transaction.');
            }
            throw new Error(`Payment failed: ${error.message}`);
        }
    }

    async getBalance(): Promise<string> {
        if (!this.provider || !this.signer) {
            throw new Error('Wallet not connected');
        }

        const address = await this.signer.getAddress();
        const balance = await this.provider.getBalance(address);
        return ethers.formatEther(balance);
    }

    isConnected(): boolean {
        return this.provider !== null && this.signer !== null;
    }

    async getCurrentWalletAddress(): Promise<string | null> {
        if (!window.ethereum) {
            return null;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            return accounts.length > 0 ? accounts[0] : null;
        } catch (error) {
            console.error('Failed to get current wallet address:', error);
            return null;
        }
    }

    async switchToMainnet(): Promise<void> {
        if (!window.ethereum) {
            throw new Error('MetaMask not found');
        }

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x1' }], // Mainnet
            });
        } catch (error: any) {
            if (error.code === 4902) {
                // Chain not added, add it
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x1',
                        chainName: 'Ethereum Mainnet',
                        nativeCurrency: {
                            name: 'Ethereum',
                            symbol: 'ETH',
                            decimals: 18
                        },
                        rpcUrls: ['https://mainnet.infura.io/v3/']
                    }]
                });
            }
        }
    }
}

// Singleton instance
export const walletService = new WalletService();

// Type declarations for window.ethereum
declare global {
    interface Window {
        ethereum?: any;
    }
}
