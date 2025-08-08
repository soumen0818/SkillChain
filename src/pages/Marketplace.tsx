import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SEO from '@/components/SEO';
import { Badge } from '@/components/ui/badge';
import { Coins, Shield, Trophy, ShoppingCart, Wallet, ArrowRight, Percent } from 'lucide-react';

const nftListings = [
  { id: 1, title: 'Advanced Solidity Certificate', seller: 'john.eth', priceEth: 0.2, royalty: 5, image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&auto=format&fit=crop&q=60' },
  { id: 2, title: 'DeFi Architect Badge', seller: 'sarah.eth', priceEth: 0.35, royalty: 7, image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=60' },
  { id: 3, title: 'NFT Art Mastery Certificate', seller: 'lisa.eth', priceEth: 0.18, royalty: 5, image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=60' },
];

const tokenListings = [
  { id: 1, title: 'SkillTokens Pack (1,000 ST)', seller: 'market.pool', priceUsd: 89, image: 'https://images.unsplash.com/photo-1640340434791-10c10d1e7011?w=800&auto=format&fit=crop&q=60' },
  { id: 2, title: 'SkillTokens Pack (2,500 ST)', seller: 'market.pool', priceUsd: 199, image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60' },
  { id: 3, title: 'SkillTokens Pack (5,000 ST)', seller: 'market.pool', priceUsd: 379, image: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?w=800&auto=format&fit=crop&q=60' },
];

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <SEO
        title="SkillChain Marketplace | Trade NFT Certificates & SkillTokens"
        description="Buy, sell, and trade blockchain-verified certificate NFTs and SkillTokens. Low fees, built-in royalties, and transparent on-chain records."
      />

      <header className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-3 animate-fade-in-up">
              <h1 className="text-4xl font-bold">Marketplace</h1>
              <p className="text-muted-foreground max-w-2xl">Peer-to-peer trading for NFT certificates and SkillTokens. Platform fee 2.5%; creator royalties returned to educators.</p>
              <div className="flex gap-2">
                <Badge variant="outline" className="flex items-center gap-1"><Shield className="w-4 h-4" /> Fraud‑proof NFTs</Badge>
                <Badge variant="outline" className="flex items-center gap-1"><Percent className="w-4 h-4" /> 2.5% Fee</Badge>
                <Badge className="gradient-primary text-white">Royalties</Badge>
              </div>
            </div>
            <Button className="gradient-primary hidden md:inline-flex">
              List Item <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mt-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Tabs defaultValue="nfts" className="space-y-6">
            <TabsList>
              <TabsTrigger value="nfts">Certificate NFTs</TabsTrigger>
              <TabsTrigger value="tokens">SkillTokens</TabsTrigger>
            </TabsList>

            <TabsContent value="nfts">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nftListings.map((nft, idx) => (
                  <Card key={nft.id} className="overflow-hidden hover:shadow-elevation animate-scale-in" style={{ animationDelay: `${idx * 40}ms` }}>
                    <img src={nft.image} alt={`${nft.title} NFT preview`} loading="lazy" className="w-full h-48 object-cover" />
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{nft.title}</h3>
                        <Badge variant="secondary" className="flex items-center gap-1"><Trophy className="w-4 h-4" /> NFT</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Seller: {nft.seller}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">{nft.priceEth} ETH</div>
                        <span className="text-sm text-muted-foreground">Royalty {nft.royalty}%</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">Details</Button>
                        <Button className="flex-1 gradient-primary"><ShoppingCart className="w-4 h-4 mr-2" /> Buy</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tokens">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tokenListings.map((pack, idx) => (
                  <Card key={pack.id} className="overflow-hidden hover:shadow-elevation animate-scale-in" style={{ animationDelay: `${idx * 40}ms` }}>
                    <img src={pack.image} alt={`${pack.title} pack cover`} loading="lazy" className="w-full h-48 object-cover" />
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{pack.title}</h3>
                        <Badge variant="secondary" className="flex items-center gap-1"><Coins className="w-4 h-4" /> ST</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Vendor: {pack.seller}</p>
                      <div className="text-2xl font-bold">${pack.priceUsd}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">Details</Button>
                        <Button className="flex-1 gradient-primary"><Wallet className="w-4 h-4 mr-2" /> Purchase</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
