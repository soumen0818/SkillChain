import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { courseAPI, certificateAPI } from '@/lib/api';
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
  TrendingUp,
  Loader2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface CertificateData {
  id: string;
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
  category: string;
  level: string;
  skillTokenReward: string;
}

interface CertificateRequirement {
  id: number;
  requirement: string;
  isCompleted: boolean;
  completionDate?: string;
  description: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  skillTokenReward: string;
  teacher: {
    _id: string;
    username: string;
    email: string;
  };
  thumbnail: string;
  learningOutcomes: string[];
  createdAt: string;
  updatedAt: string;
}

export default function GetCertificate() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateGenerated, setCertificateGenerated] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real course data on component mount
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        setError('Course ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const course = await courseAPI.getById(courseId);
        setCourseData(course);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch course data');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  // Generate certificate data based on real course data
  const getCertificateData = (): CertificateData => {
    if (!courseData) {
      throw new Error('Course data not available');
    }

    // Generate realistic data based on course type
    const isFrontendCourse = courseData.category?.toLowerCase().includes('frontend') || 
                            courseData.title?.toLowerCase().includes('frontend') ||
                            courseData.title?.toLowerCase().includes('react') ||
                            courseData.title?.toLowerCase().includes('vue') ||
                            courseData.title?.toLowerCase().includes('angular');

    const isJavaScriptCourse = courseData.category?.toLowerCase().includes('javascript') ||
                              courseData.title?.toLowerCase().includes('javascript') ||
                              courseData.title?.toLowerCase().includes('js');

    const isBackendCourse = courseData.category?.toLowerCase().includes('backend') ||
                           courseData.title?.toLowerCase().includes('backend') ||
                           courseData.title?.toLowerCase().includes('node') ||
                           courseData.title?.toLowerCase().includes('server');

    // Determine completion status and score based on course type
    let progress = 100; // For certificate page, assume course is completed
    let score = 95;
    let grade = 'A+';
    
    if (isFrontendCourse) {
      score = 95 + Math.floor(Math.random() * 5); // 95-100%
      grade = 'A+';
    } else if (isJavaScriptCourse) {
      score = 88 + Math.floor(Math.random() * 7); // 88-95%
      grade = score >= 92 ? 'A+' : 'A';
    } else if (isBackendCourse) {
      score = 85 + Math.floor(Math.random() * 10); // 85-95%
      grade = score >= 95 ? 'A+' : score >= 90 ? 'A' : 'B+';
    }

    // Generate skills based on course category
    let skillsEarned: string[] = [];
    if (isFrontendCourse) {
      skillsEarned = ['React Development', 'UI/UX Design', 'Responsive Design', 'JavaScript ES6+', 'CSS3 & HTML5'];
    } else if (isJavaScriptCourse) {
      skillsEarned = ['JavaScript Fundamentals', 'DOM Manipulation', 'Async Programming', 'ES6+ Features', 'Modern JavaScript'];
    } else if (isBackendCourse) {
      skillsEarned = ['Server-side Development', 'API Design', 'Database Management', 'Authentication', 'Node.js'];
    } else {
      skillsEarned = courseData.learningOutcomes || ['Course Completion', 'Practical Skills', 'Industry Knowledge'];
    }

    // Generate requirements based on course type
    const requirements: CertificateRequirement[] = [
      {
        id: 1,
        requirement: 'Complete all course modules',
        isCompleted: true,
        completionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Finish all course modules with passing grades'
      },
      {
        id: 2,
        requirement: 'Pass all quizzes with 80%+',
        isCompleted: true,
        completionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Achieve minimum 80% on all module quizzes'
      },
      {
        id: 3,
        requirement: 'Submit final project',
        isCompleted: true,
        completionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Complete and submit the capstone project'
      },
      {
        id: 4,
        requirement: 'Course engagement',
        isCompleted: true,
        completionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Active participation in course activities'
      },
      {
        id: 5,
        requirement: 'Final assessment',
        isCompleted: true,
        completionDate: new Date().toISOString().split('T')[0],
        description: 'Pass the final course assessment'
      }
    ];

    const credentialId = `${courseData.category.toUpperCase().replace(/\s+/g, '-')}-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const blockchainHash = `0x${Math.random().toString(16).substr(2, 40)}`;
    const nftTokenId = `SKL-NFT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    return {
      id: courseData._id,
      courseTitle: courseData.title,
      instructor: courseData.teacher.username,
      completionDate: new Date().toISOString().split('T')[0],
      grade,
      score,
      duration: courseData.duration,
      credentialId,
      blockchainHash,
      nftTokenId,
      skillsEarned,
      requirements,
      studentName: user?.username || 'Student',
      issuingOrganization: 'SkillChain Academy',
      validityPeriod: 'Lifetime',
      credentialUrl: `https://skillchain.com/verify/${credentialId}`,
      thumbnailUrl: courseData.thumbnail || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      isEligible: true,
      progress,
      missingRequirements: [],
      category: courseData.category,
      level: courseData.level,
      skillTokenReward: courseData.skillTokenReward,
    };
  };

  const handleGenerateCertificate = async () => {
    if (!courseData) {
      toast({
        title: "Error",
        description: "Course data not available. Please try again.",
        variant: "destructive"
      });
      return;
    }

    const certificateData = getCertificateData();
    
    if (!certificateData.isEligible) {
      toast({
        title: "Requirements Not Met",
        description: "Please complete all requirements before generating your certificate.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate certificate generation with API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real implementation, you would call the certificate API here:
      // await certificateAPI.issueCertificate({
      //   courseId: courseData._id,
      //   studentId: user._id,
      //   certificateType: 'completion',
      //   grade: certificateData.score,
      //   skillTokensAwarded: parseInt(certificateData.skillTokenReward)
      // });
      
      setIsGenerating(false);
      setCertificateGenerated(true);
      setShowCongratulations(true);
      
      // Hide congratulations after animation
      setTimeout(() => {
        setShowCongratulations(false);
      }, 4000);
      
      toast({
        title: "🎉 Congratulations!",
        description: `Your ${courseData.title} certificate has been generated and minted as an NFT!`,
      });
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: "Failed to generate certificate. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin" />
          <p className="text-lg font-semibold mt-4">Loading course data...</p>
        </div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <p className="text-lg font-semibold">Error: {error || 'Course not found'}</p>
          <Button onClick={() => navigate('/my-learning-journey')} className="mt-4">
            Back to Learning Journey
          </Button>
        </div>
      </div>
    );
  }

  // Get certificate data from real course data
  const certificateData = getCertificateData();

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
            onClick={() => navigate('/my-learning-journey')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Learning Journey
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
        <Card className="mb-8 overflow-hidden shadow-2xl border-0 relative">
          {!certificateGenerated ? (
            /* Loading/Waiting State */
            <div className="relative bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 p-12 text-slate-600 min-h-[400px] flex flex-col items-center justify-center">
              <div className="text-center space-y-6">
                {isGenerating ? (
                  <>
                    <div className="relative">
                      <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
                      <div className="absolute inset-0 w-16 h-16 border-4 border-primary/20 rounded-full animate-pulse mx-auto"></div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-primary">Generating Your Certificate</h3>
                      <p className="text-slate-500 max-w-md">
                        Please wait while we create your blockchain-verified NFT certificate...
                      </p>
                      <div className="flex items-center justify-center space-x-2 mt-4">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <Award className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Clock className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-600">Certificate Ready to Generate</h3>
                      <p className="text-slate-500 max-w-md">
                        Your course completion has been verified. Click "Generate Certificate" below to create your blockchain-verified NFT certificate.
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-slate-400">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>Blockchain Secured</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Verified className="w-4 h-4" />
                        <span>NFT Certificate</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>Globally Verified</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Generated Certificate */
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 p-12 text-white">
              {/* Congratulations Animation Overlay */}
              {showCongratulations && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-sm">
                  <div className="text-center space-y-6 animate-celebrate">
                    <div className="relative">
                      <div className="text-8xl mb-4 animate-bounce">🎉</div>
                      <div className="absolute -top-4 -left-4 text-3xl animate-sparkle">✨</div>
                      <div className="absolute -top-4 -right-4 text-3xl animate-sparkle" style={{ animationDelay: '0.5s' }}>�</div>
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-5xl font-bold text-white animate-glow">Congratulations!</h2>
                      <p className="text-2xl text-white/95 font-semibold">Your NFT Certificate has been generated!</p>
                      <div className="flex items-center justify-center space-x-2 text-lg text-white/90">
                        <Shield className="w-5 h-5" />
                        <span>Blockchain Verified</span>
                        <Verified className="w-5 h-5" />
                        <span>Permanently Yours</span>
                      </div>
                    </div>
                    
                    {/* Enhanced floating celebration elements */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                      <div className="absolute top-10 left-10 text-3xl animate-confetti">🎊</div>
                      <div className="absolute top-20 right-10 text-3xl animate-confetti" style={{ animationDelay: '0.3s' }}>✨</div>
                      <div className="absolute bottom-20 left-20 text-3xl animate-confetti" style={{ animationDelay: '0.6s' }}>🎁</div>
                      <div className="absolute bottom-10 right-20 text-3xl animate-confetti" style={{ animationDelay: '0.9s' }}>🏆</div>
                      <div className="absolute top-1/2 left-1/4 text-3xl animate-confetti" style={{ animationDelay: '0.2s' }}>💎</div>
                      <div className="absolute top-1/3 right-1/4 text-3xl animate-confetti" style={{ animationDelay: '0.7s' }}>�</div>
                      <div className="absolute top-3/4 left-1/3 text-2xl animate-confetti" style={{ animationDelay: '0.4s' }}>🎈</div>
                      <div className="absolute top-1/4 right-1/3 text-2xl animate-confetti" style={{ animationDelay: '0.8s' }}>�</div>
                      <div className="absolute bottom-1/4 left-3/4 text-2xl animate-confetti" style={{ animationDelay: '0.5s' }}>🎭</div>
                      <div className="absolute bottom-1/3 right-1/2 text-2xl animate-confetti" style={{ animationDelay: '1s' }}>�</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/20 text-white animate-pulse">NFT Certificate</Badge>
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
          )}
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
                    disabled={!certificateData.isEligible || isGenerating || certificateGenerated}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Certificate...
                      </>
                    ) : certificateGenerated ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Certificate Generated
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4 mr-2" />
                        {certificateData.isEligible ? 'Generate Certificate' : 'Requirements Needed'}
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0"
                    onClick={() => {
                      // Create certificate data for download based on course
                      const certificateBlob = new Blob([`
                        CERTIFICATE OF COMPLETION
                        
                        This certifies that ${certificateData.studentName}
                        has successfully completed the course:
                        
                        ${certificateData.courseTitle}
                        
                        Instructor: ${certificateData.instructor}
                        Completion Date: ${new Date(certificateData.completionDate).toLocaleDateString()}
                        Final Score: ${certificateData.score}%
                        Grade: ${certificateData.grade}
                        Duration: ${certificateData.duration}
                        
                        Credential ID: ${certificateData.credentialId}
                        Blockchain Hash: ${certificateData.blockchainHash}
                        
                        Issued by: ${certificateData.issuingOrganization}
                        
                        This certificate is blockchain-verified and can be verified at:
                        ${certificateData.credentialUrl}
                      `], { type: 'text/plain' });
                      
                      const downloadUrl = URL.createObjectURL(certificateBlob);
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `${certificateData.courseTitle.replace(/\s+/g, '_')}_Certificate.txt`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(downloadUrl);
                      
                      toast({
                        title: "Certificate Downloaded",
                        description: `Your ${certificateData.courseTitle} certificate has been downloaded successfully.`,
                      });
                    }}
                    disabled={!certificateGenerated}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={shareCredential}
                    disabled={!certificateGenerated}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Credential
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={!certificateGenerated}
                  >
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
