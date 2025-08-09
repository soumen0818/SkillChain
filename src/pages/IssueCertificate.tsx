import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Award,
  User,
  BookOpen,
  Star,
  CheckCircle,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Download,
  Eye,
  Send,
  Shield,
  Coins,
  Globe,
  Clock,
  Target,
  Users,
  FileText,
  Search,
  Filter,
  Zap,
  Sparkles,
  Crown,
  Trophy,
  Gem,
  Plus,
  Edit
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  coursesCompleted: string[];
  courseProgress: { [courseId: string]: StudentProgress };
  joinDate: string;
  avatar?: string;
}

interface StudentProgress {
  courseId: string;
  progress: number;
  grade: number;
  completedModules: number;
  totalModules: number;
  quizScores: number[];
  assignmentScores: number[];
  timeSpent: string;
  lastActivity: string;
  certificateIssued: boolean;
  certificateId?: string;
}

interface Certificate {
  id: string;
  studentId: string;
  courseId: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  grade: number;
  completionTime: string;
  walletAddress: string;
  nftTokenId: string;
  blockchainTxHash: string;
  skillTokensAwarded: number;
  certificateType: 'completion' | 'excellence' | 'mastery';
}

export default function IssueCertificate() {
  const { user } = useAuth();
  const { getTeacherCourses, getCourseById } = useCourses();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [certificateType, setCertificateType] = useState<'completion' | 'excellence' | 'mastery'>('completion');
  const [customMessage, setCustomMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [activeTab, setActiveTab] = useState('issue');
  const [issuedCertificates, setIssuedCertificates] = useState<Certificate[]>([]);
  const [isIssuing, setIsIssuing] = useState(false);

  // Get teacher's courses
  const courses = user?._id ? getTeacherCourses(user._id) : [];

  // Mock student data - in real app, this would come from your backend
  const mockStudents: Student[] = [
    {
      id: 'student1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      walletAddress: '0x1234...5678',
      coursesCompleted: ['1', '2'],
      courseProgress: {
        '1': {
          courseId: '1',
          progress: 100,
          grade: 95,
          completedModules: 8,
          totalModules: 8,
          quizScores: [92, 96, 88, 94],
          assignmentScores: [90, 98, 85],
          timeSpent: '24 hours',
          lastActivity: '2 days ago',
          certificateIssued: false
        },
        '2': {
          courseId: '2',
          progress: 85,
          grade: 88,
          completedModules: 10,
          totalModules: 12,
          quizScores: [85, 90, 88],
          assignmentScores: [87, 89],
          timeSpent: '32 hours',
          lastActivity: '1 day ago',
          certificateIssued: false
        }
      },
      joinDate: '2024-01-15',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5aa?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'student2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      walletAddress: '0x9876...4321',
      coursesCompleted: ['1'],
      courseProgress: {
        '1': {
          courseId: '1',
          progress: 100,
          grade: 92,
          completedModules: 8,
          totalModules: 8,
          quizScores: [88, 94, 90, 96],
          assignmentScores: [85, 92, 90],
          timeSpent: '28 hours',
          lastActivity: '1 week ago',
          certificateIssued: true,
          certificateId: 'cert_001'
        }
      },
      joinDate: '2024-02-01',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'student3',
      name: 'Carol Davis',
      email: 'carol@example.com',
      walletAddress: '0x5555...7777',
      coursesCompleted: [],
      courseProgress: {
        '1': {
          courseId: '1',
          progress: 100,
          grade: 98,
          completedModules: 8,
          totalModules: 8,
          quizScores: [96, 98, 95, 100],
          assignmentScores: [95, 100, 98],
          timeSpent: '22 hours',
          lastActivity: '3 days ago',
          certificateIssued: false
        }
      },
      joinDate: '2024-01-20'
    }
  ];

  useEffect(() => {
    setStudents(mockStudents);
    // Load issued certificates from localStorage or your backend
    const savedCertificates = localStorage.getItem('issuedCertificates');
    if (savedCertificates) {
      setIssuedCertificates(JSON.parse(savedCertificates));
    }
  }, []);

  const getEligibleStudents = () => {
    if (!selectedCourse) return [];
    
    return students.filter(student => {
      const progress = student.courseProgress[selectedCourse];
      if (!progress) return false;
      
      const meetsFilter = filterBy === 'all' || 
        (filterBy === 'completed' && progress.progress === 100) ||
        (filterBy === 'pending' && progress.progress === 100 && !progress.certificateIssued) ||
        (filterBy === 'issued' && progress.certificateIssued);

      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());

      return meetsFilter && matchesSearch;
    });
  };

  const getCertificateTypeInfo = (type: string, grade: number) => {
    switch (type) {
      case 'excellence':
        return {
          title: 'Certificate of Excellence',
          description: 'Outstanding performance (90%+ grade)',
          icon: Crown,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          requirement: grade >= 90,
          skillTokens: 150
        };
      case 'mastery':
        return {
          title: 'Certificate of Mastery',
          description: 'Exceptional performance (95%+ grade)',
          icon: Trophy,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          requirement: grade >= 95,
          skillTokens: 200
        };
      default:
        return {
          title: 'Certificate of Completion',
          description: 'Successfully completed the course',
          icon: Award,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          requirement: true,
          skillTokens: 100
        };
    }
  };

  const handleIssueCertificate = async () => {
    if (!selectedCourse || !selectedStudent) {
      toast({
        title: "Error",
        description: "Please select both a course and student.",
        variant: "destructive"
      });
      return;
    }

    const student = students.find(s => s.id === selectedStudent);
    const course = getCourseById(selectedCourse);
    const progress = student?.courseProgress[selectedCourse];

    if (!student || !course || !progress) return;

    setIsIssuing(true);

    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newCertificate: Certificate = {
        id: `cert_${Date.now()}`,
        studentId: selectedStudent,
        courseId: selectedCourse,
        studentName: student.name,
        courseName: course.title,
        issueDate: new Date().toISOString().split('T')[0],
        grade: progress.grade,
        completionTime: progress.timeSpent,
        walletAddress: student.walletAddress,
        nftTokenId: `NFT_${Math.random().toString(36).substr(2, 9)}`,
        blockchainTxHash: `0x${Math.random().toString(36).substr(2, 16)}...`,
        skillTokensAwarded: getCertificateTypeInfo(certificateType, progress.grade).skillTokens,
        certificateType
      };

      const updatedCertificates = [...issuedCertificates, newCertificate];
      setIssuedCertificates(updatedCertificates);
      localStorage.setItem('issuedCertificates', JSON.stringify(updatedCertificates));

      // Update student progress
      const updatedStudents = students.map(s => 
        s.id === selectedStudent 
          ? {
              ...s,
              courseProgress: {
                ...s.courseProgress,
                [selectedCourse]: {
                  ...s.courseProgress[selectedCourse],
                  certificateIssued: true,
                  certificateId: newCertificate.id
                }
              }
            }
          : s
      );
      setStudents(updatedStudents);

      toast({
        title: "Certificate Issued Successfully! 🎉",
        description: `NFT certificate sent to ${student.name}'s wallet.`,
      });

      // Reset form
      setSelectedStudent('');
      setCertificateType('completion');
      setCustomMessage('');
      setActiveTab('history');

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to issue certificate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsIssuing(false);
    }
  };

  const selectedStudentData = selectedStudent ? students.find(s => s.id === selectedStudent) : null;
  const selectedStudentProgress = selectedStudentData && selectedCourse 
    ? selectedStudentData.courseProgress[selectedCourse] 
    : null;

  const selectedCourseData = selectedCourse ? getCourseById(selectedCourse) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/teacher-dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Issue NFT Certificates</h1>
                <p className="text-purple-100">
                  Reward your students with blockchain-verified certificates
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="issue">Issue Certificate</TabsTrigger>
            <TabsTrigger value="history">Certificate History</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="issue" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Course Selection */}
                <Card className="p-6 shadow-lg border-0">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                    Select Course
                  </h3>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choose a course to issue certificates for" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          <div className="flex items-center space-x-3">
                            <img 
                              src={course.thumbnail} 
                              alt={course.title}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium">{course.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {course.students} students enrolled
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Card>

                {/* Student Selection */}
                {selectedCourse && (
                  <Card className="p-6 shadow-lg border-0">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-600" />
                        Select Student
                      </h3>
                      <div className="flex space-x-3">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                          <Input
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                          />
                        </div>
                        <Select value={filterBy} onValueChange={setFilterBy}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Students</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending Certificates</SelectItem>
                            <SelectItem value="issued">Already Issued</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 max-h-96 overflow-y-auto">
                      {getEligibleStudents().map((student) => {
                        const progress = student.courseProgress[selectedCourse];
                        const isSelected = selectedStudent === student.id;
                        
                        return (
                          <div
                            key={student.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedStudent(student.id)}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                {student.avatar ? (
                                  <img 
                                    src={student.avatar} 
                                    alt={student.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-semibold">
                                    {student.name.charAt(0)}
                                  </div>
                                )}
                                {progress?.certificateIssued && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold">{student.name}</h4>
                                  <div className="flex items-center space-x-2">
                                    <Badge 
                                      variant={progress?.progress === 100 ? 'default' : 'secondary'}
                                      className={
                                        progress?.progress === 100 
                                          ? 'bg-green-500 hover:bg-green-600' 
                                          : 'bg-yellow-500 hover:bg-yellow-600'
                                      }
                                    >
                                      {progress?.progress}% Complete
                                    </Badge>
                                    {progress?.certificateIssued && (
                                      <Badge className="bg-blue-500 hover:bg-blue-600">
                                        Certified
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{student.email}</p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span>Grade: {progress?.grade}%</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span>Time: {progress?.timeSpent}</span>
                                  </div>
                                </div>
                                <Progress value={progress?.progress || 0} className="h-2 mt-2" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}

                {/* Certificate Configuration */}
                {selectedStudent && selectedStudentProgress && (
                  <Card className="p-6 shadow-lg border-0">
                    <h3 className="text-xl font-semibold mb-6 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-purple-600" />
                      Certificate Configuration
                    </h3>

                    <div className="space-y-6">
                      {/* Certificate Type Selection */}
                      <div className="space-y-4">
                        <Label className="text-base font-semibold">Certificate Type</Label>
                        <div className="grid gap-4">
                          {['completion', 'excellence', 'mastery'].map((type) => {
                            const info = getCertificateTypeInfo(type, selectedStudentProgress.grade);
                            const IconComponent = info.icon;
                            
                            return (
                              <div
                                key={type}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                  certificateType === type
                                    ? `${info.borderColor} ${info.bgColor}`
                                    : 'border-gray-200 hover:border-gray-300'
                                } ${!info.requirement ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => info.requirement && setCertificateType(type as any)}
                              >
                                <div className="flex items-center space-x-4">
                                  <div className={`w-12 h-12 ${info.bgColor} rounded-full flex items-center justify-center`}>
                                    <IconComponent className={`w-6 h-6 ${info.color}`} />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold flex items-center">
                                      {info.title}
                                      {!info.requirement && (
                                        <Badge variant="outline" className="ml-2 text-xs">
                                          Grade too low
                                        </Badge>
                                      )}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">{info.description}</p>
                                    <div className="flex items-center space-x-4 mt-2 text-xs">
                                      <div className="flex items-center space-x-1">
                                        <Coins className="w-3 h-3 text-yellow-500" />
                                        <span>{info.skillTokens} SKILL tokens</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Shield className="w-3 h-3 text-blue-500" />
                                        <span>Blockchain verified</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom Message */}
                      <div className="space-y-2">
                        <Label htmlFor="message">Custom Message (Optional)</Label>
                        <Textarea
                          id="message"
                          placeholder="Add a personal message for the student..."
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Course Info */}
                {selectedCourseData && (
                  <Card className="p-6 shadow-lg border-0">
                    <h4 className="font-semibold mb-4">Course Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={selectedCourseData.thumbnail} 
                          alt={selectedCourseData.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h5 className="font-medium">{selectedCourseData.title}</h5>
                          <p className="text-sm text-muted-foreground">{selectedCourseData.category}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Students</span>
                          <p className="font-medium">{selectedCourseData.students}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Modules</span>
                          <p className="font-medium">{selectedCourseData.modules}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration</span>
                          <p className="font-medium">{selectedCourseData.duration}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Level</span>
                          <p className="font-medium">{selectedCourseData.level}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Student Performance */}
                {selectedStudentData && selectedStudentProgress && (
                  <Card className="p-6 shadow-lg border-0">
                    <h4 className="font-semibold mb-4">Student Performance</h4>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {selectedStudentProgress.grade}%
                        </div>
                        <p className="text-sm text-muted-foreground">Overall Grade</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{selectedStudentProgress.progress}%</span>
                        </div>
                        <Progress value={selectedStudentProgress.progress} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Modules Completed</span>
                          <span className="font-medium">
                            {selectedStudentProgress.completedModules}/{selectedStudentProgress.totalModules}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>Quiz Average</span>
                          <span className="font-medium">
                            {Math.round(selectedStudentProgress.quizScores.reduce((a, b) => a + b, 0) / selectedStudentProgress.quizScores.length)}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>Time Spent</span>
                          <span className="font-medium">{selectedStudentProgress.timeSpent}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Certificate Statistics */}
                <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
                  <h4 className="font-semibold mb-4 text-purple-900">📊 Certificate Stats</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-700">Total Issued</span>
                      <span className="font-semibold text-purple-900">{issuedCertificates.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">This Month</span>
                      <span className="font-semibold text-purple-900">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Pending</span>
                      <span className="font-semibold text-purple-900">
                        {getEligibleStudents().filter(s => 
                          s.courseProgress[selectedCourse]?.progress === 100 && 
                          !s.courseProgress[selectedCourse]?.certificateIssued
                        ).length}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Issue Button */}
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold"
                  onClick={handleIssueCertificate}
                  disabled={!selectedStudent || !selectedStudentProgress || isIssuing}
                >
                  {isIssuing ? (
                    <>
                      <Zap className="w-5 h-5 mr-2 animate-pulse" />
                      Minting NFT Certificate...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Issue Certificate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Certificate History</h3>
              <div className="flex space-x-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {issuedCertificates.map((certificate) => (
                <Card key={certificate.id} className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{certificate.studentName}</h4>
                        <p className="text-sm text-muted-foreground">{certificate.courseName}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                          <span>Grade: {certificate.grade}%</span>
                          <span>•</span>
                          <span>{certificate.issueDate}</span>
                          <span>•</span>
                          <span>NFT #{certificate.nftTokenId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`capitalize ${
                        certificate.certificateType === 'mastery' ? 'bg-purple-500 hover:bg-purple-600' :
                        certificate.certificateType === 'excellence' ? 'bg-yellow-500 hover:bg-yellow-600' :
                        'bg-blue-500 hover:bg-blue-600'
                      }`}>
                        {certificate.certificateType}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {issuedCertificates.length === 0 && (
                <Card className="p-12 text-center">
                  <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Certificates Issued Yet</h3>
                  <p className="text-muted-foreground">
                    Start issuing certificates to reward your students' achievements.
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Certificate Templates</h3>
              <Button className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  name: 'Blockchain Fundamentals', 
                  type: 'completion', 
                  color: 'blue',
                  preview: 'https://images.unsplash.com/photo-1589902494062-2c33c8b3f797?w=300&h=200&fit=crop'
                },
                { 
                  name: 'Excellence Certificate', 
                  type: 'excellence', 
                  color: 'yellow',
                  preview: 'https://images.unsplash.com/photo-1606787517778-3cf06d5fa107?w=300&h=200&fit=crop'
                },
                { 
                  name: 'Mastery Certificate', 
                  type: 'mastery', 
                  color: 'purple',
                  preview: 'https://images.unsplash.com/photo-1604719334677-9c0f2b6b4b7e?w=300&h=200&fit=crop'
                }
              ].map((template, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={template.preview} 
                      alt={template.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={`${
                        template.color === 'purple' ? 'bg-purple-500 hover:bg-purple-600' :
                        template.color === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600' :
                        'bg-blue-500 hover:bg-blue-600'
                      }`}>
                        {template.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">{template.name}</h4>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
