import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Award,
  Star,
  Eye,
  Share2,
  ShoppingCart,
  ExternalLink,
  Copy,
  Calendar,
  User,
  CheckCircle,
  Globe,
  Shield,
  TrendingUp,
  Heart,
  MessageSquare,
  BarChart3,
  Coins,
  DollarSign,
  Clock,
  Target,
  Zap,
  Info,
  AlertTriangle,
  Download
} from 'lucide-react';

export default function CertificateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { listings, getActiveListing } = useMarketplace();
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Find the certificate listing
  const listing = listings.find(item => item.id === id);

  useEffect(() => {
    // Increment view count when page loads
    setViewCount(prev => prev + 1);
  }, []);

  if (!listing) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Certificate Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The certificate you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/student/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "Certificate removed from your favorites" : "Certificate added to your favorites"
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: listing.title,
        text: `Check out this ${listing.category} certificate on SkillChain`,
        url: window.location.href
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Certificate link copied to clipboard"
      });
    }
  };

  const handleCopyTokenId = () => {
    navigator.clipboard.writeText(listing.tokenId);
    toast({
      title: "Copied!",
      description: "Token ID copied to clipboard"
    });
  };

  const handleBuyNow = () => {
    if (listing.seller === user?.username) {
      toast({
        title: "Cannot purchase",
        description: "You cannot purchase your own certificate",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Redirecting to Wallet",
      description: "Opening secure payment interface..."
    });
    
    // Navigate to wallet with purchase intent
    setTimeout(() => {
      navigate('/wallet', { 
        state: { 
          purchaseData: {
            certificateId: listing.id,
            title: listing.title,
            price: listing.price,
            currency: listing.currency,
            seller: listing.seller
          }
        }
      });
    }, 1000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'blockchain': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700';
      case 'web3': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
      case 'nft': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700';
      case 'defi': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700';
      case 'trading': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300';
      case 'Rare': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Epic': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/student/dashboard')}
            className="mb-4 hover:bg-primary/10 hover:text-primary hover:scale-105 transform transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Certificate Preview */}
            <Card className="p-8 shadow-2xl border-0 bg-gradient-to-br from-white via-gray-50/80 to-white dark:from-gray-900 dark:via-gray-800/80 dark:to-gray-900 hover:shadow-3xl transform transition-all duration-500">
              <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-8 text-white mb-6 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-3">
                      <Award className="w-12 h-12" />
                      <div>
                        <Badge className={`${getRarityColor(listing.rarity)} text-black dark:text-white mb-2`}>
                          {listing.rarity}
                        </Badge>
                        <p className="text-white/80 text-sm">NFT Certificate</p>
                      </div>
                    </div>
                    <Badge className={`${getCategoryColor(listing.category)} text-black dark:text-white`}>
                      {listing.category.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">{listing.title}</h1>
                    <p className="text-white/90">Issued by {listing.issuer}</p>
                    <div className="flex justify-center space-x-8 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-xl">{listing.grade}</div>
                        <div className="text-white/70">Grade</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-xl">{new Date(listing.issueDate).getFullYear()}</div>
                        <div className="text-white/70">Year</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-300">
                  <Eye className="w-6 h-6 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
                  <div className="font-bold text-blue-900 dark:text-blue-100">{listing.views + viewCount}</div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">Views</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-300">
                  <Heart className={`w-6 h-6 mx-auto mb-2 ${isLiked ? 'text-red-600 fill-current' : 'text-red-600 dark:text-red-400'}`} />
                  <div className="font-bold text-red-900 dark:text-red-100">{listing.likes + (isLiked ? 1 : 0)}</div>
                  <div className="text-xs text-red-700 dark:text-red-300">Likes</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-300">
                  <TrendingUp className="w-6 h-6 mx-auto text-green-600 dark:text-green-400 mb-2" />
                  <div className="font-bold text-green-900 dark:text-green-100">+15%</div>
                  <div className="text-xs text-green-700 dark:text-green-300">Value</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-300">
                  <Star className="w-6 h-6 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
                  <div className="font-bold text-purple-900 dark:text-purple-100">4.8</div>
                  <div className="text-xs text-purple-700 dark:text-purple-300">Rating</div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Description</h3>
                <div className="text-muted-foreground">
                  <p className={showFullDescription ? '' : 'line-clamp-3'}>
                    {listing.description}
                  </p>
                  {listing.description.length > 200 && (
                    <Button 
                      variant="link" 
                      className="p-0 mt-2 text-primary hover:text-primary/80"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                    >
                      {showFullDescription ? 'Show less' : 'Read more'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Skills Verified</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="hover:bg-primary/10 hover:text-primary transition-colors duration-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Technical Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Technical Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token ID:</span>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">{listing.tokenId}</code>
                        <Button size="sm" variant="ghost" onClick={handleCopyTokenId} className="p-1 h-auto">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Issue Date:</span>
                      <span>{new Date(listing.issueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Listed Date:</span>
                      <span>{new Date(listing.listingDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Blockchain:</span>
                      <span>Ethereum</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Standard:</span>
                      <span>ERC-721</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verified:</span>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Authentic</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Transaction History */}
            <Card className="p-6 shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-semibold mb-6">Price History</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Listed for Sale</p>
                      <p className="text-sm text-muted-foreground">{new Date(listing.listingDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{listing.price} {listing.currency}</p>
                    <p className="text-sm text-muted-foreground">Current Price</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Certificate Issued</p>
                      <p className="text-sm text-muted-foreground">{new Date(listing.issueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">Free</p>
                    <p className="text-sm text-muted-foreground">Original Issue</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="p-6 shadow-2xl border-0 bg-gradient-to-br from-primary/5 to-secondary/5 sticky top-24 hover:shadow-3xl transform transition-all duration-500">
              <div className="space-y-6">
                {/* Price */}
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-foreground">{listing.price} {listing.currency}</div>
                  {listing.alternativePrice && (
                    <div className="text-muted-foreground">
                      or {listing.alternativePrice} {listing.alternativeCurrency}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">Current Price</div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {listing.seller === user?.username ? (
                    <div className="space-y-2">
                      <Badge className="w-full justify-center py-2">Your Listing</Badge>
                      <Button 
                        className="w-full gradient-primary hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 group"
                        onClick={() => navigate(`/list-certificate/${listing.certificateId}`)}
                      >
                        <Target className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                        Manage Listing
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button 
                        className="w-full gradient-primary hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 hover:-translate-y-1 group text-lg py-6"
                        onClick={handleBuyNow}
                      >
                        <ShoppingCart className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                        Buy Now
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full hover:bg-secondary hover:shadow-lg hover:scale-105 transform transition-all duration-300 group"
                      >
                        <DollarSign className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                        Make Offer
                      </Button>
                    </>
                  )}
                </div>

                <Separator />

                {/* Additional Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLike}
                    className={`hover:scale-105 transform transition-all duration-300 ${isLiked ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : 'hover:bg-red-50 hover:border-red-200 hover:text-red-600'}`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleShare}
                    className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 hover:scale-105 transform transition-all duration-300 group"
                  >
                    <Share2 className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                    Share
                  </Button>
                </div>

                {/* Seller Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Seller Information</h4>
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-300">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{listing.seller}</p>
                      <p className="text-sm text-muted-foreground">Certificate Owner</p>
                    </div>
                    <Button size="sm" variant="ghost" className="hover:bg-primary/10 hover:text-primary">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Market Insights */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Market Insights</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Average Price:</span>
                      <span className="font-medium">0.08 ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price Change (24h):</span>
                      <span className="font-medium text-green-600">+12.5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Sales:</span>
                      <span className="font-medium">156</span>
                    </div>
                  </div>
                </div>

                {/* Warning for own listing */}
                {listing.seller === user?.username && (
                  <div className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      This is your own certificate listing. You can manage or edit it from your dashboard.
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Tags */}
            {listing.tags && listing.tags.length > 0 && (
              <Card className="p-6 shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <h4 className="font-semibold mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {listing.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all duration-300 hover:scale-105">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="p-6 shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <h4 className="font-semibold mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 hover:scale-105 transform transition-all duration-300 group"
                  onClick={() => navigate(`/verify-certificate/${listing.certificateId}`)}
                >
                  <CheckCircle className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  Verify Authenticity
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-green-50 hover:border-green-200 hover:text-green-600 hover:scale-105 transform transition-all duration-300 group"
                  onClick={() => window.open(`https://etherscan.io/token/${listing.tokenId}`, '_blank')}
                >
                  <Globe className="w-4 h-4 mr-2 group-hover:animate-spin" />
                  View on Blockchain
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 hover:scale-105 transform transition-all duration-300 group"
                >
                  <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  Download Certificate
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
