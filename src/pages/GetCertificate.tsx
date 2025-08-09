import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft,
  Award,
  Trophy,
  Star,
  Download,
  Share2,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  Target,
  Coins,
  Globe,
  Wallet,
  ExternalLink,
  Copy,
  Eye,
  FileText,
  Shield,
  Verified,
  Sparkles,
  Crown,
  Medal,
  Gift,
  Heart,
  Zap,
  Brain,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface CertificateData {
  id: number;
  courseTitle: string;
  instructor: string;
  completionDate: string;
  grade: string;
  score: number;
  duration: string;
  credentialId: string;
  blockchainHash: string;
  nftTokenId: string;
  skillsEarned: string[];
  requirements: CertificateRequirement[];
  studentName: string;
  issuingOrganization: string;
  validityPeriod: string;
  credentialUrl: string;
  thumbnailUrl: string;
  isEligible: boolean;
  progress: number;
  missingRequirements: string[];
}

interface CertificateRequirement {
  id: number;
  requirement: string;
  isCompleted: boolean;
  completionDate?: string;
  description: string;
}

export default function GetCertificate() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock certificate data
  const certificateData: CertificateData = {
    id: parseInt(courseId || '1'),
    courseTitle: 'Blockchain Fundamentals',
    instructor: 'Dr. Sarah Johnson',
    completionDate: '2024-12-09',
    grade: 'A+',
    score: 95,
    duration: '8 weeks',
    credentialId: 'BC-FUND-2024-001',
    blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    nftTokenId: 'SKL-NFT-001',
    skillsEarned: ['Blockchain Technology', 'Cryptocurrency', 'Smart Contracts', 'DeFi Basics', 'Security Principles'],
    studentName: user?.name || 'John Doe',
    issuingOrganization: 'SkillChain Academy',
    validityPeriod: 'Lifetime',
    credentialUrl: 'https://skillchain.com/verify/BC-FUND-2024-001',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
    isEligible: true,
    progress: 95,
    requirements: [
      {
        id: 1,
        requirement: 'Complete all course modules',
        isCompleted: true,
        completionDate: '2024-12-05',
        description: 'Finish all 8 modules with passing grades'
      },
      {
        id: 2,
        requirement: 'Pass all quizzes with 80%+',
        isCompleted: true,
        completionDate: '2024-12-07',
        description: 'Achieve minimum 80% on all module quizzes'
      },
      {
        id: 3,
        requirement: 'Submit final project',
        isCompleted: true,
        completionDate: '2024-12-08',
        description: 'Complete and submit the capstone project'
      },
      {
        id: 4,
        requirement: 'Peer review participation',
        isCompleted: true,
        completionDate: '2024-12-09',
        description: 'Participate in peer review assignments'
      },
      {
        id: 5,
        requirement: 'Course feedback submitted',
        isCompleted: false,
        description: 'Provide feedback on course content and experience'
      }
    ],
    missingRequirements: ['Course feedback submitted']
  };

  const handleGenerateCertificate = async () => {
    if (!certificateData.isEligible) {
      toast({
        title: "Requirements Not Met",
        description: "Please complete all requirements before generating your certificate.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    // Simulate certificate generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Certificate Generated!",
        description: "Your blockchain certificate has been created and minted as an NFT.",
      });
    }, 3000);
  };

  const copyCredentialId = () => {
    navigator.clipboard.writeText(certificateData.credentialId);
    toast({
      title: "Copied!",
      description: "Credential ID copied to clipboard.",
    });
  };

  const copyBlockchainHash = () => {
    navigator.clipboard.writeText(certificateData.blockchainHash);
    toast({
      title: "Copied!",
      description: "Blockchain hash copied to clipboard.",
    });
  };

  const shareCredential = () => {
    navigator.clipboard.writeText(certificateData.credentialUrl);
    toast({
      title: "Link Copied!",
      description: "Certificate verification link copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/my-courses')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Courses
          </Button>
          
          <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white rounded-2xl p-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Trophy className="w-8 h-8" />
                  <h1 className="text-3xl font-bold">Certificate Achievement</h1>
                </div>
                <p className="text-yellow-100 text-lg mb-4">{certificateData.courseTitle}</p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Instructor: {certificateData.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {certificateData.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Grade: {certificateData.grade}</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-3">
                  <Award className="w-12 h-12" />
                </div>
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  {certificateData.isEligible ? 'Ready to Claim' : 'Requirements Needed'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Preview */}
        <Card className="mb-8 overflow-hidden shadow-2xl border-0">
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 p-12 text-white">
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/20 text-white">NFT Certificate</Badge>
            </div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-8 left-8">
                <Crown className="w-24 h-24" />
              </div>
              <div className="absolute bottom-8 right-8">
                <Medal className="w-32 h-32" />
              </div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="mb-8">
                <Sparkles className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-4xl font-bold mb-2">Certificate of Completion</h2>
                <p className="text-blue-100">This certifies that</p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-5xl font-bold mb-4">{certificateData.studentName}</h3>
                <p className="text-xl text-blue-100">has successfully completed</p>
              </div>
              
              <div className="mb-8">
                <h4 className="text-3xl font-semibold mb-2">{certificateData.courseTitle}</h4>
                <p className="text-lg text-blue-100">with a grade of <span className="font-bold">{certificateData.grade}</span></p>
              </div>
              
              <div className="flex items-center justify-center space-x-12 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">{certificateData.score}%</div>
                  <div className="text-sm text-blue-200">Final Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{certificateData.duration}</div>
                  <div className="text-sm text-blue-200">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{new Date(certificateData.completionDate).toLocaleDateString()}</div>
                  <div className="text-sm text-blue-200">Completion Date</div>
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-6">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="font-semibold">{certificateData.instructor}</div>
                    <div className="text-sm text-blue-200">Course Instructor</div>
                  </div>
                  <div className="text-center">
                    <Verified className="w-8 h-8 mx-auto mb-1" />
                    <div className="text-xs text-blue-200">Blockchain Verified</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{certificateData.issuingOrganization}</div>
                    <div className="text-sm text-blue-200">Issuing Authority</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="skills">Skills Earned</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Certificate Details */}
              <Card className="p-6 shadow-lg border-0">
                <h3 className="text-xl font-semibold mb-6">Certificate Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credential ID:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">{certificateData.credentialId}</span>
                      <Button variant="ghost" size="sm" onClick={copyCredentialId}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issue Date:</span>
                    <span>{new Date(certificateData.completionDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Validity:</span>
                    <span>{certificateData.validityPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NFT Token ID:</span>
                    <span className="font-mono text-sm">{certificateData.nftTokenId}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Blockchain Hash:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs max-w-32 truncate">{certificateData.blockchainHash}</span>
                      <Button variant="ghost" size="sm" onClick={copyBlockchainHash}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <Card className="p-6 shadow-lg border-0">
                <h3 className="text-xl font-semibold mb-6">Certificate Actions</h3>
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                    onClick={handleGenerateCertificate}
                    disabled={!certificateData.isEligible || isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Generating Certificate...
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4 mr-2" />
                        {certificateData.isEligible ? 'Generate Certificate' : 'Requirements Needed'}
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" className="w-full" onClick={shareCredential}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Credential
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Certificate
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Wallet className="w-4 h-4 mr-2" />
                    Add to Wallet
                  </Button>
                </div>
              </Card>
            </div>

            {/* Progress Summary */}
            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-xl font-semibold mb-6">Certification Progress</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Overall Progress</span>
                  <span className="text-2xl font-bold text-green-600">{certificateData.progress}%</span>
                </div>
                <Progress value={certificateData.progress} className="h-3" />
                
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-900">
                      {certificateData.requirements.filter(r => r.isCompleted).length}
                    </div>
                    <div className="text-sm text-green-700">Requirements Met</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-900">
                      {certificateData.missingRequirements.length}
                    </div>
                    <div className="text-sm text-yellow-700">Pending</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-900">{certificateData.score}%</div>
                    <div className="text-sm text-blue-700">Final Score</div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-xl font-semibold mb-6">Certification Requirements</h3>
              <div className="space-y-4">
                {certificateData.requirements.map((req) => (
                  <div key={req.id} className={`p-4 rounded-lg border ${req.isCompleted ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        {req.isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{req.requirement}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{req.description}</p>
                        {req.isCompleted && req.completionDate && (
                          <Badge variant="secondary">
                            Completed {new Date(req.completionDate).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-xl font-semibold mb-6">Blockchain Verification</h3>
              <div className="space-y-6">
                <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                  <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">Immutable Verification</h4>
                  <p className="text-muted-foreground mb-4">
                    Your certificate is secured on the blockchain and can be verified by anyone
                  </p>
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Blockchain
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 border border-border rounded-lg">
                    <h5 className="font-semibold mb-2">Smart Contract Address</h5>
                    <p className="font-mono text-sm text-muted-foreground">0xabc123...def456</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <h5 className="font-semibold mb-2">Transaction Hash</h5>
                    <p className="font-mono text-sm text-muted-foreground">{certificateData.blockchainHash.slice(0, 16)}...</p>
                  </div>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg">
                  <h5 className="font-semibold mb-3">Verification URL</h5>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-2 bg-background rounded text-sm">{certificateData.credentialUrl}</code>
                    <Button variant="outline" size="sm" onClick={shareCredential}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-xl font-semibold mb-6">Skills & Competencies Earned</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {certificateData.skillsEarned.map((skill, index) => (
                  <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{skill}</h4>
                        <p className="text-sm text-muted-foreground">Verified Competency</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Professional Recognition</h4>
                <p className="text-muted-foreground">
                  This certificate demonstrates your expertise and can be shared with employers and professional networks
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
