import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Shield,
  CheckCircle,
  Copy,
  ExternalLink,
  Search,
  Verified,
  Award,
  Globe,
  Lock,
  Eye,
  Download,
  Share2,
  AlertCircle,
  Clock,
  User,
  Calendar,
  FileText,
  Fingerprint,
  Database,
  QrCode
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CertificateVerificationData {
  id: string;
  title: string;
  recipient: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  blockchainHash: string;
  nftTokenId: string;
  contractAddress: string;
  ipfsHash: string;
  isValid: boolean;
  verificationTimestamp: string;
  skillsEarned: string[];
  grade: string;
  completionDate: string;
  duration: string;
}

export default function CertificateVerification() {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<CertificateVerificationData | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Mock certificate data - in real app, this would come from blockchain/API
  const mockCertificateData: CertificateVerificationData = {
    id: certificateId || 'NFT-001',
    title: 'NFT Art Creation Mastery',
    recipient: 'John Doe',
    issuer: 'SkillChain Academy',
    issueDate: '2024-01-15',
    credentialId: 'SC-NFT-2024-001',
    blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    nftTokenId: 'SKL-NFT-001',
    contractAddress: '0xABC123...DEF456',
    ipfsHash: 'QmX9Z8Y7W6V5U4T3S2R1Q0P9O8N7M6L5K4J3I2H1G0F',
    isValid: true,
    verificationTimestamp: new Date().toISOString(),
    skillsEarned: ['Digital Art Creation', 'NFT Standards (ERC-721)', 'IPFS Storage', 'Metadata Creation', 'Blockchain Minting'],
    grade: 'A+',
    completionDate: '2024-01-10',
    duration: '6 weeks'
  };

  const handleVerification = async (query?: string) => {
    const searchId = query || searchQuery || certificateId;
    
    if (!searchId) {
      toast({
        title: "Invalid Input",
        description: "Please enter a certificate ID, blockchain hash, or NFT token ID.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    setVerificationStatus('idle');

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      // Mock verification - in real app, this would query blockchain
      if (searchId.includes('NFT') || searchId.includes('SC-') || searchId.includes('0x')) {
        setVerificationResult(mockCertificateData);
        setVerificationStatus('success');
        toast({
          title: "✅ Certificate Verified",
          description: "This certificate is authentic and valid on the blockchain.",
        });
      } else {
        setVerificationStatus('error');
        toast({
          title: "❌ Verification Failed",
          description: "Certificate not found or invalid.",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const shareVerification = () => {
    const shareUrl = `${window.location.origin}/verify-certificate/${verificationResult?.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied!",
      description: "Verification link copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Certificate Verification</h1>
                <p className="text-muted-foreground">Verify the authenticity of blockchain certificates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-8 p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Verify a Certificate</h3>
              <p className="text-muted-foreground">
                Enter a certificate ID, blockchain hash, or NFT token ID to verify its authenticity
              </p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <Label htmlFor="search" className="sr-only">Certificate ID</Label>
                <Input
                  id="search"
                  placeholder="Enter Certificate ID, Hash, or Token ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-center"
                />
              </div>
              
              <Button 
                onClick={() => handleVerification()}
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isVerifying ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Verify Certificate
                  </>
                )}
              </Button>
            </div>

            {/* Quick verification options */}
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <span className="text-muted-foreground">Quick examples:</span>
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto text-xs"
                onClick={() => handleVerification('NFT-001')}
              >
                NFT-001
              </Button>
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto text-xs"
                onClick={() => handleVerification('SC-NFT-2024-001')}
              >
                SC-NFT-2024-001
              </Button>
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto text-xs"
                onClick={() => handleVerification('0x1a2b3c4d')}
              >
                0x1a2b3c4d...
              </Button>
            </div>
          </div>
        </Card>

        {/* Verification Results */}
        {verificationStatus === 'success' && verificationResult && (
          <div className="space-y-6">
            {/* Status Banner */}
            <Card className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
              <div className="flex items-center space-x-4">
                <CheckCircle className="w-12 h-12" />
                <div>
                  <h3 className="text-xl font-bold">✅ Certificate Verified</h3>
                  <p className="text-green-100">
                    This certificate is authentic and has been verified on the blockchain
                  </p>
                  <p className="text-xs text-green-200 mt-1">
                    Verified on {new Date(verificationResult.verificationTimestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            {/* Certificate Details */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Certificate Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                    <p className="text-lg font-semibold">{verificationResult.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Recipient</Label>
                      <p className="font-medium">{verificationResult.recipient}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Issuer</Label>
                      <p className="font-medium">{verificationResult.issuer}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Issue Date</Label>
                      <p className="font-medium">{new Date(verificationResult.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Grade</Label>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {verificationResult.grade}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
                    <p className="font-medium">{verificationResult.duration}</p>
                  </div>
                </div>
              </Card>

              {/* Blockchain Details */}
              <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Blockchain Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Credential ID</Label>
                    <div className="flex items-center space-x-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                        {verificationResult.credentialId}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(verificationResult.credentialId, 'Credential ID')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">NFT Token ID</Label>
                    <div className="flex items-center space-x-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                        {verificationResult.nftTokenId}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(verificationResult.nftTokenId, 'NFT Token ID')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Blockchain Hash</Label>
                    <div className="flex items-center space-x-2">
                      <code className="bg-muted px-2 py-1 rounded text-xs flex-1 truncate">
                        {verificationResult.blockchainHash}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(verificationResult.blockchainHash, 'Blockchain Hash')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Smart Contract</Label>
                    <div className="flex items-center space-x-2">
                      <code className="bg-muted px-2 py-1 rounded text-xs flex-1">
                        {verificationResult.contractAddress}
                      </code>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">IPFS Hash</Label>
                    <div className="flex items-center space-x-2">
                      <code className="bg-muted px-2 py-1 rounded text-xs flex-1 truncate">
                        {verificationResult.ipfsHash}
                      </code>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Skills Earned */}
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-6">Skills & Competencies Verified</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {verificationResult.skillsEarned.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-6">Verification Actions</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" onClick={shareVerification}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Verification
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Blockchain
                </Button>
                <Button variant="outline">
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR Code
                </Button>
              </div>
            </Card>
          </div>
        )}

        {verificationStatus === 'error' && (
          <Card className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
            <div className="flex items-center space-x-4">
              <AlertCircle className="w-12 h-12" />
              <div>
                <h3 className="text-xl font-bold">❌ Verification Failed</h3>
                <p className="text-red-100">
                  The certificate could not be found or verified on the blockchain
                </p>
                <p className="text-xs text-red-200 mt-1">
                  Please check the ID and try again, or contact the issuing organization
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* How Verification Works */}
        <Card className="mt-8 p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-6">How Certificate Verification Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold">1. Search</h4>
              <p className="text-sm text-muted-foreground">
                Enter the certificate ID, blockchain hash, or NFT token ID
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold">2. Blockchain Lookup</h4>
              <p className="text-sm text-muted-foreground">
                We query the blockchain to verify the certificate's authenticity
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Verified className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold">3. Verification</h4>
              <p className="text-sm text-muted-foreground">
                Get instant results with complete certificate details and proof
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
