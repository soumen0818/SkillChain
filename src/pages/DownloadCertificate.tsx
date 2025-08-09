import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft,
  Download,
  FileText,
  Image,
  Share2,
  Eye,
  Copy,
  Mail,
  Printer,
  Smartphone,
  Monitor,
  Tablet,
  Award,
  Trophy,
  Star,
  Calendar,
  Users,
  Clock,
  Verified,
  ExternalLink,
  Cloud,
  Folder,
  Archive,
  Zap,
  Crown,
  Medal,
  Sparkles,
  QrCode,
  Link,
  Globe,
  Shield
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface DownloadOption {
  id: string;
  title: string;
  description: string;
  format: string;
  size: string;
  icon: any;
  resolution?: string;
  purpose: string;
}

interface CertificateData {
  id: number;
  courseTitle: string;
  instructor: string;
  studentName: string;
  completionDate: string;
  grade: string;
  credentialId: string;
  issuingOrganization: string;
  blockchainHash: string;
  verificationUrl: string;
}

export default function DownloadCertificate() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedFormat, setSelectedFormat] = useState('pdf-standard');
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('download');

  // Mock certificate data
  const certificateData: CertificateData = {
    id: parseInt(courseId || '1'),
    courseTitle: 'Blockchain Fundamentals',
    instructor: 'Dr. Sarah Johnson',
    studentName: user?.username || 'John Doe',
    completionDate: '2024-12-09',
    grade: 'A+',
    credentialId: 'BC-FUND-2024-001',
    issuingOrganization: 'SkillChain Academy',
    blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    verificationUrl: 'https://skillchain.com/verify/BC-FUND-2024-001'
  };

  const downloadOptions: DownloadOption[] = [
    {
      id: 'pdf-standard',
      title: 'Standard PDF Certificate',
      description: 'High-quality PDF suitable for printing and sharing',
      format: 'PDF',
      size: '2.4 MB',
      icon: FileText,
      resolution: '300 DPI',
      purpose: 'General use, printing, email sharing'
    },
    {
      id: 'pdf-portfolio',
      title: 'Portfolio PDF',
      description: 'Enhanced PDF with detailed course information',
      format: 'PDF',
      size: '4.1 MB',
      icon: Archive,
      resolution: '300 DPI',
      purpose: 'Professional portfolios, job applications'
    },
    {
      id: 'image-hd',
      title: 'High Definition Image',
      description: 'PNG image perfect for social media and websites',
      format: 'PNG',
      size: '1.8 MB',
      icon: Image,
      resolution: '1920×1080',
      purpose: 'LinkedIn, social media, website display'
    },
    {
      id: 'image-print',
      title: 'Print-Ready Image',
      description: 'High-resolution image for professional printing',
      format: 'PNG',
      size: '5.2 MB',
      icon: Printer,
      resolution: '3840×2160',
      purpose: 'Professional printing, framing'
    },
    {
      id: 'digital-badge',
      title: 'Digital Badge',
      description: 'Compact badge format for email signatures',
      format: 'PNG',
      size: '245 KB',
      icon: Medal,
      resolution: '400×400',
      purpose: 'Email signatures, digital profiles'
    },
    {
      id: 'blockchain-proof',
      title: 'Blockchain Verification',
      description: 'Digital proof with QR code for instant verification',
      format: 'PDF',
      size: '1.1 MB',
      icon: Shield,
      resolution: '300 DPI',
      purpose: 'Instant verification, blockchain proof'
    }
  ];

  const handleDownload = async (option: DownloadOption) => {
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      toast({
        title: "Download Started",
        description: `Your ${option.title} is being downloaded.`,
      });
      
      // In a real app, this would trigger the actual download
      const link = document.createElement('a');
      link.href = '#'; // Would be the actual file URL
      link.download = `SkillChain_Certificate_${certificateData.credentialId}.${option.format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 2000);
  };

  const handleBulkDownload = async () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      toast({
        title: "Bulk Download Started",
        description: "All certificate formats are being downloaded as a ZIP file.",
      });
    }, 3000);
  };

  const copyVerificationLink = () => {
    navigator.clipboard.writeText(certificateData.verificationUrl);
    toast({
      title: "Copied!",
      description: "Verification link copied to clipboard.",
    });
  };

  const shareViaEmail = () => {
    const subject = `Certificate: ${certificateData.courseTitle}`;
    const body = `I've completed ${certificateData.courseTitle} and earned my certificate!\n\nYou can verify it here: ${certificateData.verificationUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const shareToLinkedIn = () => {
    const text = `I'm excited to share that I've completed ${certificateData.courseTitle} and earned my blockchain certificate!`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateData.verificationUrl)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pt-20 pb-12">
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
          
          <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white rounded-2xl p-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Download className="w-8 h-8" />
                  <h1 className="text-3xl font-bold">Download Certificate</h1>
                </div>
                <p className="text-green-100 text-lg mb-4">{certificateData.courseTitle}</p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Instructor: {certificateData.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Completed: {new Date(certificateData.completionDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Grade: {certificateData.grade}</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-3">
                  <Trophy className="w-12 h-12" />
                </div>
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  Verified Certificate
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="download">Download Options</TabsTrigger>
            <TabsTrigger value="share">Share & Verify</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="download" className="space-y-8">
            {/* Quick Actions */}
            <Card className="p-6 shadow-lg border-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Quick Actions</h3>
                <Button 
                  onClick={handleBulkDownload}
                  disabled={isDownloading}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Download All Formats
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center space-y-2"
                  onClick={() => handleDownload(downloadOptions[0])}
                >
                  <FileText className="w-6 h-6" />
                  <span>Standard PDF</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center space-y-2"
                  onClick={() => handleDownload(downloadOptions[2])}
                >
                  <Image className="w-6 h-6" />
                  <span>HD Image</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center space-y-2"
                  onClick={() => handleDownload(downloadOptions[4])}
                >
                  <Medal className="w-6 h-6" />
                  <span>Digital Badge</span>
                </Button>
              </div>
            </Card>

            {/* Download Options */}
            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-xl font-semibold mb-6">All Download Options</h3>
              <div className="grid gap-4">
                {downloadOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <div key={option.id} className="p-6 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{option.title}</h4>
                            <p className="text-muted-foreground mb-3">{option.description}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <Badge variant="secondary">{option.format}</Badge>
                              <span className="text-muted-foreground">Size: {option.size}</span>
                              {option.resolution && (
                                <span className="text-muted-foreground">Resolution: {option.resolution}</span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                              <strong>Best for:</strong> {option.purpose}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button 
                            onClick={() => handleDownload(option)}
                            disabled={isDownloading}
                          >
                            {isDownloading ? (
                              <Zap className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4 mr-2" />
                            )}
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Device Specific Downloads */}
            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-xl font-semibold mb-6">Device-Optimized Downloads</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                  <Monitor className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Desktop/Laptop</h4>
                  <p className="text-sm text-muted-foreground mb-4">High-resolution PDF and images</p>
                  <Button size="sm" variant="outline">Download for Desktop</Button>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                  <Tablet className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Tablet</h4>
                  <p className="text-sm text-muted-foreground mb-4">Optimized for tablet viewing</p>
                  <Button size="sm" variant="outline">Download for Tablet</Button>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                  <Smartphone className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Mobile</h4>
                  <p className="text-sm text-muted-foreground mb-4">Mobile-friendly format</p>
                  <Button size="sm" variant="outline">Download for Mobile</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="share" className="space-y-8">
            {/* Sharing Options */}
            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-xl font-semibold mb-6">Share Your Achievement</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Social Media</h4>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={shareToLinkedIn}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Share on LinkedIn
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share on Twitter
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Globe className="w-4 h-4 mr-2" />
                      Share on Facebook
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Direct Sharing</h4>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={shareViaEmail}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Share via Email
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={copyVerificationLink}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Verification Link
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate QR Code
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Verification Info */}
            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-xl font-semibold mb-6">Certificate Verification</h3>
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <Verified className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold">Blockchain Verified</h4>
                      <p className="text-sm text-muted-foreground">This certificate is immutably recorded on the blockchain</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Credential ID:</span>
                      <div className="font-mono mt-1">{certificateData.credentialId}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Blockchain Hash:</span>
                      <div className="font-mono mt-1 truncate">{certificateData.blockchainHash}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <h5 className="font-semibold mb-2">Verification URL</h5>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-2 bg-muted rounded text-sm">{certificateData.verificationUrl}</code>
                    <Button variant="outline" size="sm" onClick={copyVerificationLink}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-8">
            {/* Certificate Preview */}
            <Card className="overflow-hidden shadow-2xl border-0">
              <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 p-12 text-white">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/20 text-white">Official Certificate</Badge>
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
                      <div className="text-2xl font-bold">{certificateData.credentialId}</div>
                      <div className="text-sm text-blue-200">Credential ID</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{new Date(certificateData.completionDate).toLocaleDateString()}</div>
                      <div className="text-sm text-blue-200">Date of Completion</div>
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

            {/* Preview Actions */}
            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-xl font-semibold mb-6">Preview Actions</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Full Screen Preview
                </Button>
                <Button variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Preview
                </Button>
                <Button variant="outline">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile Preview
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Preview
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
