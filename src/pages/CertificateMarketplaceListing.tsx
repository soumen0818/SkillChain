import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft,
  ShoppingCart,
  DollarSign,
  Tag,
  TrendingUp,
  Award,
  Eye,
  Share2,
  Coins,
  Clock,
  Users,
  BarChart3,
  Settings,
  AlertCircle,
  CheckCircle,
  Info,
  Wallet,
  Globe,
  Zap,
  Star,
  Upload,
  Image
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CertificateListingData {
  id: string;
  title: string;
  category: string;
  issuer: string;
  issueDate: string;
  currentOwner: string;
  tokenId: string;
  description: string;
  skills: string[];
  grade: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  marketValue: string;
  suggestedPrice: string;
}

export default function CertificateMarketplaceListing() {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const { addListing, getActiveListing } = useMarketplace();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'list' | 'preview' | 'analytics'>('list');
  const [listingForm, setListingForm] = useState({
    price: '',
    currency: 'ETH',
    alternativePrice: '',
    alternativeCurrency: 'ST',
    duration: '30',
    title: '',
    description: '',
    tags: '',
    isAuction: false,
    reservePrice: '',
    instantSale: true
  });
  const [isListing, setIsListing] = useState(false);

  // Mock certificate data
  const certificateData: CertificateListingData = {
    id: certificateId || 'NFT-001',
    title: 'NFT Art Creation Mastery',
    category: 'nft',
    issuer: 'SkillChain Academy',
    issueDate: '2024-01-15',
    currentOwner: 'John Doe',
    tokenId: 'SKL-NFT-001',
    description: 'Advanced certification in NFT art creation, covering digital art fundamentals, blockchain minting, and marketplace strategies.',
    skills: ['Digital Art Creation', 'NFT Standards', 'IPFS Storage', 'Metadata Creation', 'Blockchain Minting'],
    grade: 'A+',
    rarity: 'Rare',
    marketValue: '0.12 ETH',
    suggestedPrice: '0.15 ETH'
  };

  const marketStats = {
    averagePrice: '0.08 ETH',
    totalSales: 156,
    priceChange: '+12.5%',
    volumeToday: '2.4 ETH',
    topSale: '0.25 ETH',
    floorPrice: '0.05 ETH'
  };

  const recentSales = [
    { id: 1, title: 'Blockchain Fundamentals', price: '0.08 ETH', date: '2h ago', category: 'blockchain' },
    { id: 2, title: 'Web3 Development', price: '0.15 ETH', date: '5h ago', category: 'web3' },
    { id: 3, title: 'DeFi Protocols', price: '0.22 ETH', date: '1d ago', category: 'defi' },
    { id: 4, title: 'Smart Contract Security', price: '0.18 ETH', date: '2d ago', category: 'blockchain' }
  ];

  const handleFormChange = (field: string, value: string | boolean) => {
    setListingForm(prev => ({ ...prev, [field]: value }));
  };

  const handleListCertificate = async () => {
    if (!listingForm.price || !listingForm.title) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Check if certificate is already listed
    const existingListing = getActiveListing(certificateData.id);
    if (existingListing) {
      toast({
        title: "Already Listed",
        description: "This certificate is already listed in the marketplace.",
        variant: "destructive"
      });
      return;
    }

    setIsListing(true);
    
    // Simulate listing process
    setTimeout(() => {
      // Add to marketplace
      addListing({
        certificateId: certificateData.id,
        title: listingForm.title || certificateData.title,
        seller: user?.username || 'Anonymous',
        price: listingForm.price,
        currency: listingForm.currency as 'ETH' | 'ST',
        alternativePrice: listingForm.alternativePrice,
        alternativeCurrency: listingForm.alternativeCurrency as 'ETH' | 'ST',
        description: listingForm.description || certificateData.description,
        category: certificateData.category,
        issuer: certificateData.issuer,
        issueDate: certificateData.issueDate,
        grade: certificateData.grade,
        skills: certificateData.skills,
        rarity: certificateData.rarity,
        duration: parseInt(listingForm.duration),
        tokenId: certificateData.tokenId,
        isAuction: listingForm.isAuction,
        tags: listingForm.tags ? listingForm.tags.split(',').map(tag => tag.trim()) : []
      });

      setIsListing(false);
      toast({
        title: "🎉 Certificate Listed Successfully!",
        description: `Your certificate is now available in the marketplace for ${listingForm.price} ${listingForm.currency}`,
      });
      
      // Navigate back to dashboard
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1500);
    }, 2000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-100 text-gray-800';
      case 'Rare': return 'bg-blue-100 text-blue-800';
      case 'Epic': return 'bg-purple-100 text-purple-800';
      case 'Legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'blockchain': return 'bg-blue-100 text-blue-800';
      case 'web3': return 'bg-green-100 text-green-800';
      case 'nft': return 'bg-purple-100 text-purple-800';
      case 'defi': return 'bg-orange-100 text-orange-800';
      case 'trading': return 'bg-red-100 text-red-800';
      case 'metaverse': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/student/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">List Certificate for Sale</h1>
              <p className="text-muted-foreground mt-2">
                Turn your blockchain certificate into a valuable digital asset
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-8 h-8 text-primary" />
              <Badge variant="secondary">NFT Marketplace</Badge>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-sm">
          <Button
            variant={activeTab === 'list' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('list')}
            className="flex-1"
          >
            <Tag className="w-4 h-4 mr-2" />
            Create Listing
          </Button>
          <Button
            variant={activeTab === 'preview' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('preview')}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('analytics')}
            className="flex-1"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Market Analytics
          </Button>
        </div>

        {/* Create Listing Tab */}
        {activeTab === 'list' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Certificate Preview */}
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-6">Certificate Details</h3>
              <div className="space-y-6">
                {/* Certificate Image/Preview */}
                <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-lg p-6 text-white">
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getRarityColor(certificateData.rarity)} text-black`}>
                      {certificateData.rarity}
                    </Badge>
                  </div>
                  <div className="text-center space-y-4">
                    <Award className="w-16 h-16 mx-auto" />
                    <div>
                      <h4 className="text-xl font-bold">{certificateData.title}</h4>
                      <p className="text-blue-100">Issued by {certificateData.issuer}</p>
                    </div>
                    <div className="flex justify-center space-x-4 text-sm">
                      <div>
                        <div className="font-bold">{certificateData.grade}</div>
                        <div className="text-blue-200">Grade</div>
                      </div>
                      <div>
                        <div className="font-bold">{new Date(certificateData.issueDate).getFullYear()}</div>
                        <div className="text-blue-200">Year</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certificate Info */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token ID:</span>
                    <span className="font-mono text-sm">{certificateData.tokenId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge className={getCategoryColor(certificateData.category)}>
                      {certificateData.category.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Value:</span>
                    <span className="font-bold text-green-600">{certificateData.marketValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Suggested Price:</span>
                    <span className="font-bold text-blue-600">{certificateData.suggestedPrice}</span>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <Label className="text-sm font-medium">Skills Verified</Label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {certificateData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Listing Form */}
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-6">Listing Configuration</h3>
              <div className="space-y-6">
                {/* Pricing */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Listing Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter a catchy title for your listing"
                      value={listingForm.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what makes this certificate valuable..."
                      value={listingForm.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <div className="flex">
                        <Input
                          id="price"
                          placeholder="0.00"
                          value={listingForm.price}
                          onChange={(e) => handleFormChange('price', e.target.value)}
                          className="rounded-r-none"
                        />
                        <select 
                          className="border border-l-0 rounded-l-none rounded-r px-3 bg-background"
                          value={listingForm.currency}
                          onChange={(e) => handleFormChange('currency', e.target.value)}
                        >
                          <option value="ETH">ETH</option>
                          <option value="MATIC">MATIC</option>
                          <option value="BNB">BNB</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="altPrice">Alternative Price</Label>
                      <div className="flex">
                        <Input
                          id="altPrice"
                          placeholder="0"
                          value={listingForm.alternativePrice}
                          onChange={(e) => handleFormChange('alternativePrice', e.target.value)}
                          className="rounded-r-none"
                        />
                        <select 
                          className="border border-l-0 rounded-l-none rounded-r px-3 bg-background"
                          value={listingForm.alternativeCurrency}
                          onChange={(e) => handleFormChange('alternativeCurrency', e.target.value)}
                        >
                          <option value="ST">ST</option>
                          <option value="USDC">USDC</option>
                          <option value="DAI">DAI</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration">Listing Duration</Label>
                    <select 
                      id="duration"
                      className="w-full border rounded px-3 py-2 bg-background"
                      value={listingForm.duration}
                      onChange={(e) => handleFormChange('duration', e.target.value)}
                    >
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      placeholder="blockchain, nft, art, certification, rare"
                      value={listingForm.tags}
                      onChange={(e) => handleFormChange('tags', e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Listing Options */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Listing Options</h4>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="instantSale"
                      checked={listingForm.instantSale}
                      onChange={(e) => handleFormChange('instantSale', e.target.checked)}
                    />
                    <Label htmlFor="instantSale">Enable instant sale</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isAuction"
                      checked={listingForm.isAuction}
                      onChange={(e) => handleFormChange('isAuction', e.target.checked)}
                    />
                    <Label htmlFor="isAuction">Enable auction (7-day duration)</Label>
                  </div>

                  {listingForm.isAuction && (
                    <div>
                      <Label htmlFor="reservePrice">Reserve Price (minimum bid)</Label>
                      <Input
                        id="reservePrice"
                        placeholder="0.01"
                        value={listingForm.reservePrice}
                        onChange={(e) => handleFormChange('reservePrice', e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Fees Information */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Marketplace Fees</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Platform Fee:</span>
                      <span>2.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Creator Royalty:</span>
                      <span>1.0%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gas Fee:</span>
                      <span>~$5-15</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium text-foreground">
                      <span>You'll receive:</span>
                      <span>~96.5% of sale price</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleListCertificate}
                    disabled={isListing}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                  >
                    {isListing ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Creating Listing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        List Certificate for Sale
                      </>
                    )}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => setActiveTab('preview')}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Advanced
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-6">Marketplace Preview</h3>
            <div className="max-w-md mx-auto">
              {/* This would show how the listing appears in the marketplace */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 space-y-4">
                <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-lg p-4 text-white">
                  <div className="absolute top-2 right-2">
                    <Badge className={`${getRarityColor(certificateData.rarity)} text-black text-xs`}>
                      {certificateData.rarity}
                    </Badge>
                  </div>
                  <div className="text-center space-y-2">
                    <Award className="w-12 h-12 mx-auto" />
                    <h4 className="font-bold">{listingForm.title || certificateData.title}</h4>
                    <p className="text-xs text-blue-100">{certificateData.issuer}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">{listingForm.price || '0.00'} {listingForm.currency}</span>
                    <Badge className={getCategoryColor(certificateData.category)}>
                      {certificateData.category.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {listingForm.alternativePrice && (
                    <div className="text-sm text-muted-foreground">
                      or {listingForm.alternativePrice} {listingForm.alternativeCurrency}
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {listingForm.description || certificateData.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      <span>0 views</span>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" className="text-xs">
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Market Stats */}
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Average Price', value: marketStats.averagePrice, icon: DollarSign, color: 'text-green-600' },
                { label: 'Total Sales', value: marketStats.totalSales.toString(), icon: TrendingUp, color: 'text-blue-600' },
                { label: 'Price Change', value: marketStats.priceChange, icon: BarChart3, color: 'text-purple-600' },
                { label: 'Volume Today', value: marketStats.volumeToday, icon: Coins, color: 'text-yellow-600' },
                { label: 'Top Sale', value: marketStats.topSale, icon: Star, color: 'text-orange-600' },
                { label: 'Floor Price', value: marketStats.floorPrice, icon: Zap, color: 'text-red-600' }
              ].map((stat, index) => (
                <Card key={index} className="p-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-lg font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </Card>
              ))}
            </div>

            {/* Recent Sales */}
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-6">Recent Sales - Similar Certificates</h3>
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{sale.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getCategoryColor(sale.category)}>
                            {sale.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{sale.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{sale.price}</div>
                      <div className="text-xs text-muted-foreground">Sale Price</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Pricing Recommendations */}
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-6">Pricing Recommendations</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">Conservative</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">0.10 ETH</div>
                  <p className="text-sm text-blue-700">90% chance of quick sale</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-800">Recommended</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">0.15 ETH</div>
                  <p className="text-sm text-green-700">Optimal price-to-time ratio</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-purple-800">Optimistic</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">0.20 ETH</div>
                  <p className="text-sm text-purple-700">Maximum potential value</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
