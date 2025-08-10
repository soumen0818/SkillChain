import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import {
  Wallet as WalletIcon,
  Coins,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Send,
  Download,
  Eye,
  Copy,
  ExternalLink,
  RefreshCw,
  Award,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Target,
  Zap,
  Shield
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'earn' | 'spend' | 'receive' | 'send' | 'sale' | 'purchase' | 'reward';
  amount: string;
  currency: 'ETH' | 'ST';
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  txHash?: string;
}

interface WalletStats {
  skillTokens: number;
  ethBalance: number;
  totalEarned: number;
  totalSpent: number;
  certificatesOwned: number;
  certificatesSold?: number;
  monthlyRevenue?: number;
  studentsServed?: number;
}

interface PurchaseData {
  certificateId: string;
  title: string;
  price: string;
  currency: 'ETH' | 'ST';
  seller: string;
}

// Purchase Interface Component
function PurchaseInterface({ purchaseData, walletStats }: { purchaseData: PurchaseData; walletStats: WalletStats }) {
  const [paymentMethod, setPaymentMethod] = useState<'ETH' | 'ST'>(purchaseData.currency);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handlePurchase = async () => {
    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(purchaseData.price);
    const hasEnoughBalance = paymentMethod === 'ETH' ? 
      walletStats.ethBalance >= price : 
      walletStats.skillTokens >= price;

    if (!hasEnoughBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${paymentMethod} to complete this purchase`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Simulate transaction processing
    setTimeout(() => {
      toast({
        title: "🎉 Purchase Successful!",
        description: `You've successfully purchased "${purchaseData.title}" for ${purchaseData.price} ${paymentMethod}`,
      });
      setIsProcessing(false);
    }, 3000);
  };

  const estimatedGasFee = 0.002; // ETH
  const platformFee = parseFloat(purchaseData.price) * 0.025; // 2.5%
  const totalCost = parseFloat(purchaseData.price) + (paymentMethod === 'ETH' ? estimatedGasFee : 0);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Purchase Details */}
      <Card className="p-6 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-2xl hover:shadow-3xl transition-all duration-500">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Certificate Purchase</h3>
              <p className="text-muted-foreground">Secure blockchain transaction</p>
            </div>
          </div>

          {/* Certificate Info */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-lg mb-2">{purchaseData.title}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seller:</span>
                <span className="font-medium">{purchaseData.seller}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Certificate ID:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">{purchaseData.certificateId}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Listed Price:</span>
                <span className="font-bold text-lg text-primary">{purchaseData.price} {purchaseData.currency}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h4 className="font-semibold">Payment Method</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={paymentMethod === 'ETH' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('ETH')}
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:scale-105 transform transition-all duration-300"
              >
                <Coins className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium">Ethereum</div>
                  <div className="text-xs text-muted-foreground">Balance: {walletStats.ethBalance.toFixed(4)} ETH</div>
                </div>
              </Button>
              <Button
                variant={paymentMethod === 'ST' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('ST')}
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:scale-105 transform transition-all duration-300"
              >
                <Star className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium">SkillTokens</div>
                  <div className="text-xs text-muted-foreground">Balance: {walletStats.skillTokens.toLocaleString()} ST</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Transaction Breakdown */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <h5 className="font-medium">Transaction Breakdown</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Certificate Price:</span>
                <span>{purchaseData.price} {paymentMethod}</span>
              </div>
              {paymentMethod === 'ETH' && (
                <div className="flex justify-between">
                  <span>Estimated Gas Fee:</span>
                  <span>{estimatedGasFee.toFixed(4)} ETH</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Platform Fee (2.5%):</span>
                <span>Included in price</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total Cost:</span>
                <span>{totalCost.toFixed(4)} {paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1"
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed">
              I agree to the <Button variant="link" className="h-auto p-0 text-primary">terms and conditions</Button> and 
              understand that this transaction is final and cannot be reversed.
            </Label>
          </div>
        </div>
      </Card>

      {/* Payment Processing */}
      <Card className="p-6 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-2xl hover:shadow-3xl transition-all duration-500">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Payment Confirmation</h3>
              <p className="text-muted-foreground">Review and confirm your purchase</p>
            </div>
          </div>

          {/* Balance Check */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Current Balance</p>
                <p className="text-sm text-muted-foreground">
                  {paymentMethod === 'ETH' ? `${walletStats.ethBalance.toFixed(4)} ETH` : `${walletStats.skillTokens.toLocaleString()} ST`}
                </p>
              </div>
              <div className={`text-right ${(paymentMethod === 'ETH' ? walletStats.ethBalance : walletStats.skillTokens) >= parseFloat(purchaseData.price) ? 'text-green-600' : 'text-red-600'}`}>
                <CheckCircle className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs font-medium">
                  {(paymentMethod === 'ETH' ? walletStats.ethBalance : walletStats.skillTokens) >= parseFloat(purchaseData.price) ? 'Sufficient' : 'Insufficient'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">After Purchase</p>
                <p className="text-sm text-muted-foreground">Remaining balance</p>
              </div>
              <div className="text-right">
                <p className="font-bold">
                  {paymentMethod === 'ETH' 
                    ? `${Math.max(0, walletStats.ethBalance - totalCost).toFixed(4)} ETH`
                    : `${Math.max(0, walletStats.skillTokens - parseFloat(purchaseData.price)).toLocaleString()} ST`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="space-y-3">
            <h5 className="font-medium">Security Features</h5>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="w-4 h-4 text-green-600" />
                <span>End-to-end encryption</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Blockchain verified</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Star className="w-4 h-4 text-green-600" />
                <span>Smart contract protected</span>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <Button
            className="w-full gradient-primary hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 hover:-translate-y-1 text-lg py-6"
            onClick={handlePurchase}
            disabled={isProcessing || !agreedToTerms}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processing Transaction...
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Complete Purchase - {totalCost.toFixed(4)} {paymentMethod}
              </>
            )}
          </Button>

          {/* Processing Status */}
          {isProcessing && (
            <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Transaction Processing</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Verifying payment...</span>
                  <span className="text-blue-600">30%</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Please do not close this window. The transaction typically takes 1-3 minutes to complete.
              </p>
            </div>
          )}

          {/* Support Link */}
          <div className="text-center">
            <Button variant="link" className="text-sm text-muted-foreground hover:text-primary">
              Need help? Contact support
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function WalletPage() {
  const { user } = useAuth();
  const { listings } = useMarketplace();
  const location = useLocation();
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState(user?.walletAddress || '');
  const [activeTab, setActiveTab] = useState('overview');
  const [purchaseData, setPurchaseData] = useState<any>(null);

  // Check if we have purchase data from navigation
  useEffect(() => {
    if (location.state?.purchaseData) {
      setPurchaseData(location.state.purchaseData);
      setActiveTab('purchase'); // Switch to purchase tab if purchase data exists
      
      // Show purchase notification
      toast({
        title: "Ready to Purchase",
        description: `Proceed with purchasing "${location.state.purchaseData.title}" for ${location.state.purchaseData.price} ${location.state.purchaseData.currency}`,
      });
    }
  }, [location.state]);

  // Mock wallet data - in real app, fetch from blockchain/backend
  const [walletStats, setWalletStats] = useState<WalletStats>({
    skillTokens: user?.role === 'student' ? 3750 : 12400,
    ethBalance: user?.role === 'student' ? 0.045 : 2.847,
    totalEarned: user?.role === 'student' ? 3750 : 24800,
    totalSpent: user?.role === 'student' ? 1200 : 3200,
    certificatesOwned: user?.role === 'student' ? 3 : 8,
    certificatesSold: user?.role === 'teacher' ? 156 : undefined,
    monthlyRevenue: user?.role === 'teacher' ? 4680 : undefined,
    studentsServed: user?.role === 'teacher' ? 342 : undefined
  });

  const transactions: Transaction[] = user?.role === 'student' ? [
    {
      id: '1',
      type: 'earn',
      amount: '500',
      currency: 'ST',
      description: 'Course completion: Blockchain Fundamentals',
      date: '2024-01-15',
      status: 'completed',
      txHash: '0xabc123...'
    },
    {
      id: '2',
      type: 'purchase',
      amount: '0.15',
      currency: 'ETH',
      description: 'Certificate: Advanced Solidity Programming',
      date: '2024-01-14',
      status: 'completed',
      txHash: '0xdef456...'
    },
    {
      id: '3',
      type: 'earn',
      amount: '1200',
      currency: 'ST',
      description: 'Certificate earned: Web3 Development',
      date: '2024-01-12',
      status: 'completed'
    },
    {
      id: '4',
      type: 'spend',
      amount: '300',
      currency: 'ST',
      description: 'Premium course access',
      date: '2024-01-10',
      status: 'completed'
    }
  ] : [
    {
      id: '1',
      type: 'sale',
      amount: '0.25',
      currency: 'ETH',
      description: 'Certificate sale: Blockchain Security Audit',
      date: '2024-01-15',
      status: 'completed',
      txHash: '0xabc123...'
    },
    {
      id: '2',
      type: 'receive',
      amount: '2400',
      currency: 'ST',
      description: 'Monthly creator rewards',
      date: '2024-01-01',
      status: 'completed'
    },
    {
      id: '3',
      type: 'sale',
      amount: '0.18',
      currency: 'ETH',
      description: 'Certificate sale: DeFi Protocols Mastery',
      date: '2024-01-14',
      status: 'completed',
      txHash: '0xdef456...'
    },
    {
      id: '4',
      type: 'receive',
      amount: '1800',
      currency: 'ST',
      description: 'Course enrollment fees',
      date: '2024-01-12',
      status: 'completed'
    }
  ];

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnecting(false);
      toast({
        title: 'Wallet Connected',
        description: 'Your wallet has been successfully connected.'
      });
    }, 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: 'Address Copied',
      description: 'Wallet address copied to clipboard.'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earn':
      case 'receive':
      case 'sale':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'spend':
      case 'send':
      case 'purchase':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      default:
        return <RefreshCw className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, isPositive, subtitle }: {
    icon: any;
    title: string;
    value: string;
    change?: string;
    isPositive?: boolean;
    subtitle?: string;
  }) => (
    <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{change}</span>
          </div>
        )}
      </div>
    </Card>
  );

  const StudentWalletOverview = () => (
    <div className="space-y-8">
      {/* Balance Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Coins}
          title="SkillTokens"
          value={`${walletStats.skillTokens.toLocaleString()} ST`}
          change="+12.5%"
          isPositive={true}
          subtitle="Earned from learning"
        />
        <StatCard
          icon={WalletIcon}
          title="ETH Balance"
          value={`${walletStats.ethBalance} ETH`}
          change="-2.1%"
          isPositive={false}
          subtitle="$142.50 USD"
        />
        <StatCard
          icon={Award}
          title="Certificates Owned"
          value={walletStats.certificatesOwned.toString()}
          subtitle="NFT collection"
        />
        <StatCard
          icon={Target}
          title="Learning Progress"
          value="75%"
          change="+8%"
          isPositive={true}
          subtitle="This month"
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-primary" />
          Quick Actions
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            <Send className="w-6 h-6 text-primary" />
            <div className="text-center">
              <p className="font-medium">Send Tokens</p>
              <p className="text-xs text-muted-foreground">Transfer SkillTokens</p>
            </div>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <div className="text-center">
              <p className="font-medium">Buy Certificate</p>
              <p className="text-xs text-muted-foreground">Browse marketplace</p>
            </div>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            <CreditCard className="w-6 h-6 text-primary" />
            <div className="text-center">
              <p className="font-medium">Add Funds</p>
              <p className="text-xs text-muted-foreground">Buy ETH or ST</p>
            </div>
          </Button>
        </div>
      </Card>

      {/* Learning Rewards Progress */}
      <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-primary" />
          Learning Rewards Progress
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Next Milestone: 5,000 ST</span>
            <span className="text-sm text-muted-foreground">{walletStats.skillTokens}/5000 ST</span>
          </div>
          <Progress value={(walletStats.skillTokens / 5000) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Complete 2 more courses to unlock Premium features and earn 1,250 bonus SkillTokens
          </p>
        </div>
      </Card>
    </div>
  );

  const TeacherWalletOverview = () => (
    <div className="space-y-8">
      {/* Revenue Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Monthly Revenue"
          value={`${walletStats.monthlyRevenue} ST`}
          change="+18.5%"
          isPositive={true}
          subtitle="$1,872 USD equivalent"
        />
        <StatCard
          icon={WalletIcon}
          title="ETH Earnings"
          value={`${walletStats.ethBalance} ETH`}
          change="+25.3%"
          isPositive={true}
          subtitle="$9,024.80 USD"
        />
        <StatCard
          icon={Award}
          title="Certificates Sold"
          value={walletStats.certificatesSold?.toString() || '0'}
          change="+12"
          isPositive={true}
          subtitle="This month"
        />
        <StatCard
          icon={TrendingUp}
          title="Students Served"
          value={walletStats.studentsServed?.toString() || '0'}
          subtitle="Total learners"
        />
      </div>

      {/* Revenue Analytics */}
      <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-primary" />
          Revenue Analytics
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">42.3%</p>
            <p className="text-sm text-muted-foreground">Course Sales</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">35.7%</p>
            <p className="text-sm text-muted-foreground">Certificate Resales</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">22%</p>
            <p className="text-sm text-muted-foreground">Creator Rewards</p>
          </div>
        </div>
      </Card>

      {/* Payout & Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Download className="w-5 h-5 mr-2 text-primary" />
            Pending Payouts
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Available to withdraw</span>
              <span className="font-semibold">1.45 ETH</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">SkillTokens earned</span>
              <span className="font-semibold">2,400 ST</span>
            </div>
            <Separator />
            <Button className="w-full gradient-primary">
              <Download className="w-4 h-4 mr-2" />
              Withdraw Earnings
            </Button>
          </div>
        </Card>

        <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary" />
            Next Payments
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Course Royalties</p>
                <p className="text-xs text-muted-foreground">Due Jan 25</p>
              </div>
              <span className="font-semibold">0.34 ETH</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Creator Bonus</p>
                <p className="text-xs text-muted-foreground">Due Feb 1</p>
              </div>
              <span className="font-semibold">800 ST</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-background via-background to-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              {user?.role === 'student' ? 'Learning Wallet' : 'Creator Wallet'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {user?.role === 'student' 
                ? 'Manage your SkillTokens, certificates, and learning rewards'
                : 'Track earnings, manage payouts, and analyze revenue performance'
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleConnectWallet} disabled={isConnecting}>
              {isConnecting ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <WalletIcon className="w-4 h-4 mr-2" />
              )}
              {isConnecting ? 'Connecting...' : 'Reconnect Wallet'}
            </Button>
          </div>
        </div>

        {/* Wallet Address */}
        <Card className="p-4 mb-8 border-0 bg-white/60 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Connected Wallet</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not connected'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${purchaseData ? 'grid-cols-4' : 'grid-cols-3'} bg-white/60 backdrop-blur-md mb-8`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            {purchaseData && (
              <TabsTrigger value="purchase" className="text-primary font-semibold">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Purchase
              </TabsTrigger>
            )}
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {user?.role === 'student' ? <StudentWalletOverview /> : <TeacherWalletOverview />}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="border-0 bg-white/70 backdrop-blur-md shadow-elevation">
              <div className="p-6 border-b border-border/60">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your latest wallet activity and earnings
                </p>
              </div>
              <div className="divide-y divide-border/60">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-6 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-muted/60 flex items-center justify-center">
                          {getTransactionIcon(tx.type)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{tx.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tx.date).toLocaleDateString()} • {tx.txHash ? `${tx.txHash.slice(0, 10)}...` : 'Off-chain'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center space-x-3">
                        <div>
                          <p className={`font-semibold ${
                            tx.type === 'earn' || tx.type === 'receive' || tx.type === 'sale' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {tx.type === 'earn' || tx.type === 'receive' || tx.type === 'sale' ? '+' : '-'}
                            {tx.amount} {tx.currency}
                          </p>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(tx.status)}
                            <span className="text-xs text-muted-foreground capitalize">{tx.status}</span>
                          </div>
                        </div>
                        {tx.txHash && (
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Purchase Tab - only shown when purchase data exists */}
          {purchaseData && (
            <TabsContent value="purchase" className="space-y-6">
              <PurchaseInterface purchaseData={purchaseData} walletStats={walletStats} />
            </TabsContent>
          )}

          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
              <h3 className="text-lg font-semibold mb-6">Wallet Settings</h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="wallet-address">Primary Wallet Address</Label>
                  <div className="flex mt-2 space-x-2">
                    <Input
                      id="wallet-address"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="0x..."
                      className="font-mono"
                    />
                    <Button variant="outline">Update</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    This address will be used for all blockchain transactions and payouts
                  </p>
                </div>

                {user?.role === 'teacher' && (
                  <div>
                    <Label htmlFor="payout-schedule">Payout Schedule</Label>
                    <select className="mt-2 w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                      <option>Weekly (Recommended)</option>
                      <option>Monthly</option>
                      <option>Manual</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">
                      How often you want to receive your earnings
                    </p>
                  </div>
                )}

                <div>
                  <Label>Transaction History Export</Label>
                  <div className="flex space-x-2 mt-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
