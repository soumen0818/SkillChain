import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface MarketplaceListing {
  id: string;
  certificateId: string;
  title: string;
  seller: string;
  price: string;
  currency: 'ETH' | 'ST';
  alternativePrice?: string;
  alternativeCurrency?: 'ETH' | 'ST';
  description: string;
  category: string;
  issuer: string;
  issueDate: string;
  grade: string;
  skills: string[];
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  listingDate: string;
  duration: number; // days
  views: number;
  likes: number;
  tokenId: string;
  image?: string;
  isAuction: boolean;
  status: 'active' | 'sold' | 'expired' | 'cancelled';
  tags: string[];
}

interface MarketplaceContextType {
  listings: MarketplaceListing[];
  addListing: (listing: Omit<MarketplaceListing, 'id' | 'listingDate' | 'views' | 'likes' | 'status'>) => void;
  removeListing: (id: string) => void;
  updateListing: (id: string, updates: Partial<MarketplaceListing>) => void;
  getUserListings: (seller: string) => MarketplaceListing[];
  getActiveListing: (certificateId: string) => MarketplaceListing | undefined;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};

interface MarketplaceProviderProps {
  children: ReactNode;
}

export const MarketplaceProvider: React.FC<MarketplaceProviderProps> = ({ children }) => {
  const [listings, setListings] = useState<MarketplaceListing[]>([
    // Default marketplace listings
    {
      id: 'mkt-001',
      certificateId: 'cert-external-001',
      title: 'Advanced Solidity Programming',
      seller: 'blockchain.dev',
      price: '0.25',
      currency: 'ETH',
      alternativePrice: '600',
      alternativeCurrency: 'ST',
      description: 'Comprehensive certification in advanced Solidity programming techniques, smart contract optimization, and security best practices.',
      category: 'blockchain',
      issuer: 'Ethereum Foundation',
      issueDate: '2024-01-10',
      grade: 'A+',
      skills: ['Solidity', 'Smart Contracts', 'Gas Optimization', 'Security Auditing'],
      rarity: 'Epic',
      listingDate: '2024-01-20',
      duration: 30,
      views: 245,
      likes: 18,
      tokenId: 'SOL-ADV-001',
      isAuction: false,
      status: 'active',
      tags: ['solidity', 'ethereum', 'smart-contracts']
    },
    {
      id: 'mkt-002',
      certificateId: 'cert-external-002',
      title: 'React Web3 Integration Mastery',
      seller: 'web3.expert',
      price: '0.18',
      currency: 'ETH',
      alternativePrice: '450',
      alternativeCurrency: 'ST',
      description: 'Master the integration of React applications with Web3 technologies, including wallet connections and DApp development.',
      category: 'web3',
      issuer: 'Web3 Academy',
      issueDate: '2024-01-08',
      grade: 'A',
      skills: ['React', 'Web3.js', 'Ethers.js', 'DApp Development'],
      rarity: 'Rare',
      listingDate: '2024-01-18',
      duration: 30,
      views: 189,
      likes: 12,
      tokenId: 'REACT-WEB3-001',
      isAuction: false,
      status: 'active',
      tags: ['react', 'web3', 'frontend']
    },
    {
      id: 'mkt-003',
      certificateId: 'cert-external-003',
      title: 'NFT Marketplace Development',
      seller: 'nft.creator',
      price: '0.22',
      currency: 'ETH',
      alternativePrice: '550',
      alternativeCurrency: 'ST',
      description: 'Learn to build complete NFT marketplaces from smart contracts to frontend interfaces with advanced features.',
      category: 'nft',
      issuer: 'OpenSea Academy',
      issueDate: '2024-01-12',
      grade: 'A+',
      skills: ['NFT Standards', 'Marketplace Logic', 'IPFS', 'Frontend Development'],
      rarity: 'Epic',
      listingDate: '2024-01-22',
      duration: 30,
      views: 312,
      likes: 25,
      tokenId: 'NFT-MKT-001',
      isAuction: false,
      status: 'active',
      tags: ['nft', 'marketplace', 'erc721']
    },
    {
      id: 'mkt-004',
      certificateId: 'cert-external-004',
      title: 'DeFi Yield Farming Strategies',
      seller: 'defi.master',
      price: '0.30',
      currency: 'ETH',
      alternativePrice: '750',
      alternativeCurrency: 'ST',
      description: 'Advanced strategies for DeFi yield farming, liquidity provision, and risk management in decentralized finance protocols.',
      category: 'defi',
      issuer: 'DeFi Institute',
      issueDate: '2024-01-14',
      grade: 'A+',
      skills: ['Yield Farming', 'Liquidity Mining', 'AMM Protocols', 'Risk Management'],
      rarity: 'Legendary',
      listingDate: '2024-01-25',
      duration: 30,
      views: 456,
      likes: 34,
      tokenId: 'DEFI-YIELD-001',
      isAuction: false,
      status: 'active',
      tags: ['defi', 'yield-farming', 'liquidity']
    }
  ]);

  const addListing = (listingData: Omit<MarketplaceListing, 'id' | 'listingDate' | 'views' | 'likes' | 'status'>) => {
    const newListing: MarketplaceListing = {
      ...listingData,
      id: `mkt-${Date.now()}`,
      listingDate: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      status: 'active'
    };
    setListings(prev => [newListing, ...prev]);
  };

  const removeListing = (id: string) => {
    setListings(prev => prev.filter(listing => listing.id !== id));
  };

  const updateListing = (id: string, updates: Partial<MarketplaceListing>) => {
    setListings(prev => prev.map(listing => 
      listing.id === id ? { ...listing, ...updates } : listing
    ));
  };

  const getUserListings = (seller: string) => {
    return listings.filter(listing => listing.seller === seller && listing.status === 'active');
  };

  const getActiveListing = (certificateId: string) => {
    return listings.find(listing => 
      listing.certificateId === certificateId && listing.status === 'active'
    );
  };

  return (
    <MarketplaceContext.Provider value={{
      listings,
      addListing,
      removeListing,
      updateListing,
      getUserListings,
      getActiveListing
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};
