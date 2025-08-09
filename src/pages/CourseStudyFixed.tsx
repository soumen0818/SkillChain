import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft,
  Play,
  Pause,
  Book,
  FileText,
  Video,
  Download,
  BookmarkPlus,
  MessageSquare,
  Users,
  Clock,
  CheckCircle,
  Lock,
  PlayCircle,
  FileVideo,
  FileImage,
  FileCode,
  Lightbulb,
  Target,
  Award,
  Star,
  Calendar,
  Timer,
  Volume2,
  Maximize,
  Settings,
  Share2,
  Heart,
  Flag,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Coins,
  Trophy,
  Brain,
  Zap,
  Globe,
  PenTool,
  Code2,
  Database,
  Shield,
  TrendingUp,
  Plus
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CourseData {
  id: number;
  title: string;
  instructor: string;
  description: string;
  progress: number;
  duration: string;
  difficulty: string;
  rating: number;
  students: number;
  category: string;
  skillTokens: number;
  thumbnail: string;
  completedLessons: number;
  totalLessons: number;
  modules: Module[];
}

interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: Lesson[];
  isCompleted: boolean;
  isLocked: boolean;
}

interface Lesson {
  id: number;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment' | 'lab';
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  content?: string;
  videoUrl?: string;
  resources?: Resource[];
}

interface Resource {
  id: number;
  title: string;
  type: 'pdf' | 'code' | 'link' | 'image';
  url: string;
  size?: string;
}

interface Note {
  id: number;
  lessonId: number;
  content: string;
  timestamp: string;
  videoTime?: string;
}

export default function CourseStudy() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('content');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<number[]>([1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Function to get course data based on courseId
  const getCourseData = (id: string): CourseData => {
    const courseIdNum = parseInt(id || '1');
    
    switch (courseIdNum) {
      case 1:
        return {
          id: 1,
          title: 'Blockchain Fundamentals',
          instructor: 'Dr. Sarah Johnson',
          description: 'Master the foundations of blockchain technology, cryptocurrency, and decentralized systems. Learn how to build, deploy, and interact with smart contracts.',
          progress: 75,
          duration: '8 weeks',
          difficulty: 'Beginner to Intermediate',
          rating: 4.8,
          students: 1247,
          category: 'Blockchain',
          skillTokens: 500,
          thumbnail: 'https://images.unsplash.com/photo-1518896012122-3dcff33c6334?w=800&h=400&fit=crop',
          completedLessons: 6,
          totalLessons: 8,
          modules: [
            {
              id: 1,
              title: 'Introduction to Blockchain',
              description: 'Understanding the fundamentals of blockchain technology',
              duration: '2 hours',
              isCompleted: true,
              isLocked: false,
              lessons: [
                {
                  id: 1,
                  title: 'What is Blockchain?',
                  type: 'video',
                  duration: '15 min',
                  isCompleted: true,
                  isLocked: false,
                  videoUrl: 'https://example.com/video1',
                  resources: [
                    { id: 1, title: 'Blockchain Basics PDF', type: 'pdf', url: '/resources/blockchain-basics.pdf', size: '2.3 MB' },
                    { id: 2, title: 'Code Examples', type: 'code', url: '/resources/examples.js' }
                  ]
                },
                {
                  id: 2,
                  title: 'History of Cryptocurrency',
                  type: 'reading',
                  duration: '20 min',
                  isCompleted: true,
                  isLocked: false,
                  content: 'Detailed reading material about cryptocurrency history...'
                }
              ]
            },
            {
              id: 2,
              title: 'Cryptography & Security',
              description: 'Learn about cryptographic principles and security measures',
              duration: '3 hours',
              isCompleted: false,
              isLocked: false,
              lessons: [
                {
                  id: 3,
                  title: 'Hash Functions',
                  type: 'video',
                  duration: '25 min',
                  isCompleted: true,
                  isLocked: false
                },
                {
                  id: 4,
                  title: 'Digital Signatures',
                  type: 'video',
                  duration: '30 min',
                  isCompleted: false,
                  isLocked: false
                }
              ]
            },
            {
              id: 3,
              title: 'Smart Contracts',
              description: 'Introduction to smart contracts and their applications',
              duration: '4 hours',
              isCompleted: false,
              isLocked: false,
              lessons: [
                {
                  id: 5,
                  title: 'Smart Contract Basics',
                  type: 'video',
                  duration: '35 min',
                  isCompleted: false,
                  isLocked: false
                },
                {
                  id: 6,
                  title: 'Solidity Introduction',
                  type: 'video',
                  duration: '45 min',
                  isCompleted: false,
                  isLocked: false
                }
              ]
            }
          ]
        };

      case 2:
        return {
          id: 2,
          title: 'Web3 Development',
          instructor: 'Mark Thompson',
          description: 'Learn to build decentralized applications using modern web technologies. Master React.js, Web3.js, and frontend integration with blockchain.',
          progress: 45,
          duration: '12 weeks',
          difficulty: 'Intermediate to Advanced',
          rating: 4.7,
          students: 892,
          category: 'Web3',
          skillTokens: 750,
          thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
          completedLessons: 5,
          totalLessons: 12,
          modules: [
            {
              id: 1,
              title: 'JavaScript Fundamentals',
              description: 'Essential JavaScript concepts for Web3 development',
              duration: '3 hours',
              isCompleted: true,
              isLocked: false,
              lessons: [
                {
                  id: 1,
                  title: 'Modern JavaScript ES6+',
                  type: 'video',
                  duration: '45 min',
                  isCompleted: true,
                  isLocked: false,
                  resources: [
                    { id: 1, title: 'ES6 Cheat Sheet', type: 'pdf', url: '/resources/es6-guide.pdf', size: '1.8 MB' }
                  ]
                },
                {
                  id: 2,
                  title: 'Async/Await and Promises',
                  type: 'video',
                  duration: '35 min',
                  isCompleted: true,
                  isLocked: false
                }
              ]
            },
            {
              id: 2,
              title: 'React.js for DApps',
              description: 'Building user interfaces for decentralized applications',
              duration: '4 hours',
              isCompleted: false,
              isLocked: false,
              lessons: [
                {
                  id: 3,
                  title: 'React Components & Hooks',
                  type: 'video',
                  duration: '50 min',
                  isCompleted: true,
                  isLocked: false
                },
                {
                  id: 4,
                  title: 'State Management in DApps',
                  type: 'video',
                  duration: '40 min',
                  isCompleted: false,
                  isLocked: false
                }
              ]
            },
            {
              id: 3,
              title: 'Web3.js Integration',
              description: 'Connect your frontend to the blockchain',
              duration: '5 hours',
              isCompleted: false,
              isLocked: false,
              lessons: [
                {
                  id: 5,
                  title: 'Web3.js Library Setup',
                  type: 'video',
                  duration: '30 min',
                  isCompleted: false,
                  isLocked: false
                },
                {
                  id: 6,
                  title: 'Wallet Connection',
                  type: 'lab',
                  duration: '60 min',
                  isCompleted: false,
                  isLocked: false
                }
              ]
            }
          ]
        };

      case 3:
        return {
          id: 3,
          title: 'NFT Art Creation',
          instructor: 'Lisa Chen',
          description: 'Create, mint, and sell digital art as NFTs. Learn about metadata, IPFS storage, and marketplace integration.',
          progress: 90,
          duration: '6 weeks',
          difficulty: 'Beginner to Intermediate',
          rating: 4.9,
          students: 1582,
          category: 'NFT',
          skillTokens: 400,
          thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=400&fit=crop',
          completedLessons: 5,
          totalLessons: 6,
          modules: [
            {
              id: 1,
              title: 'Digital Art Basics',
              description: 'Introduction to digital art creation tools and techniques',
              duration: '2 hours',
              isCompleted: true,
              isLocked: false,
              lessons: [
                {
                  id: 1,
                  title: 'Digital Art Tools Overview',
                  type: 'video',
                  duration: '25 min',
                  isCompleted: true,
                  isLocked: false,
                  resources: [
                    { id: 1, title: 'Photoshop Basics', type: 'pdf', url: '/resources/photoshop-guide.pdf', size: '3.2 MB' }
                  ]
                },
                {
                  id: 2,
                  title: 'Creating Your First Digital Art',
                  type: 'assignment',
                  duration: '90 min',
                  isCompleted: true,
                  isLocked: false
                }
              ]
            },
            {
              id: 2,
              title: 'NFT Standards & Metadata',
              description: 'Understanding ERC-721, ERC-1155, and metadata creation',
              duration: '3 hours',
              isCompleted: true,
              isLocked: false,
              lessons: [
                {
                  id: 3,
                  title: 'ERC-721 vs ERC-1155',
                  type: 'video',
                  duration: '30 min',
                  isCompleted: true,
                  isLocked: false
                },
                {
                  id: 4,
                  title: 'Creating NFT Metadata',
                  type: 'lab',
                  duration: '45 min',
                  isCompleted: true,
                  isLocked: false
                }
              ]
            },
            {
              id: 3,
              title: 'IPFS & Minting',
              description: 'Store your art on IPFS and mint NFTs',
              duration: '2 hours',
              isCompleted: false,
              isLocked: false,
              lessons: [
                {
                  id: 5,
                  title: 'IPFS Storage Setup',
                  type: 'video',
                  duration: '35 min',
                  isCompleted: false,
                  isLocked: false
                },
                {
                  id: 6,
                  title: 'Final Project: Mint Your NFT',
                  type: 'assignment',
                  duration: '120 min',
                  isCompleted: false,
                  isLocked: false
                }
              ]
            }
          ]
        };

      default:
        // Default to blockchain fundamentals
        return {
          id: parseInt(id || '1'),
          title: 'Blockchain Fundamentals',
          instructor: 'Dr. Sarah Johnson',
          description: 'Master the foundations of blockchain technology, cryptocurrency, and decentralized systems.',
          progress: 65,
          duration: '8 weeks',
          difficulty: 'Beginner',
          rating: 4.8,
          students: 1247,
          category: 'Blockchain',
          skillTokens: 500,
          thumbnail: 'https://images.unsplash.com/photo-1518896012122-3dcff33c6334?w=800&h=400&fit=crop',
          completedLessons: 6,
          totalLessons: 8,
          modules: [
            {
              id: 1,
              title: 'Introduction to Blockchain',
              description: 'Understanding the fundamentals of blockchain technology',
              duration: '2 hours',
              isCompleted: true,
              isLocked: false,
              lessons: [
                {
                  id: 1,
                  title: 'What is Blockchain?',
                  type: 'video',
                  duration: '15 min',
                  isCompleted: true,
                  isLocked: false
                }
              ]
            }
          ]
        };
    }
  };

  const courseData: CourseData = getCourseData(courseId || '1');

  // Initialize selectedLesson with the first lesson of the first module
  useEffect(() => {
    const firstLesson = courseData.modules[0]?.lessons[0];
    if (firstLesson && !selectedLesson) {
      setSelectedLesson(firstLesson);
    }
  }, [courseData, selectedLesson]);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const addNote = () => {
    if (newNote.trim() && selectedLesson) {
      const note: Note = {
        id: Date.now(),
        lessonId: selectedLesson.id,
        content: newNote,
        timestamp: new Date().toLocaleString(),
        videoTime: selectedLesson.type === 'video' ? `${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')}` : undefined
      };
      setNotes(prev => [...prev, note]);
      setNewNote('');
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return FileVideo;
      case 'reading': return Book;
      case 'quiz': return Brain;
      case 'assignment': return PenTool;
      case 'lab': return Code2;
      default: return FileText;
    }
  };

  const filteredLessons = courseData.modules.flatMap(module => 
    module.lessons.filter(lesson => 
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 pb-12">
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
          
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-6">
                  <Badge className="bg-white/20 text-white hover:bg-white/30">
                    {courseData.category}
                  </Badge>
                  <Badge className="bg-white/20 text-white hover:bg-white/30">
                    {courseData.difficulty}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{courseData.rating}</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-3">{courseData.title}</h1>
                <p className="text-blue-100 mb-4 max-w-2xl">{courseData.description}</p>
                <div className="flex items-center space-x-6 text-sm text-blue-100">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{courseData.students} students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{courseData.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Coins className="w-4 h-4" />
                    <span>{courseData.skillTokens} SkillTokens</span>
                  </div>
                </div>
              </div>
              <div className="text-center min-w-[200px]">
                <div className="text-4xl font-bold mb-2">{courseData.progress}%</div>
                <p className="text-blue-100 mb-3">Progress</p>
                <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                  <Progress value={courseData.progress} className="bg-white/20" />
                </div>
                <div className="flex justify-between text-sm text-blue-200">
                  <span>Completed</span>
                  <span>
                    {courseData.completedLessons}/{courseData.totalLessons}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Course Content Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Course Content</h3>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {courseData.modules.map((module) => (
                    <div key={module.id} className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-3 h-auto"
                        onClick={() => toggleModule(module.id)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{module.title}</div>
                          <div className="text-xs text-muted-foreground">{module.duration}</div>
                        </div>
                        {expandedModules.includes(module.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                      
                      {expandedModules.includes(module.id) && (
                        <div className="ml-4 space-y-2">
                          {module.lessons.map((lesson) => {
                            const LessonIcon = getLessonIcon(lesson.type);
                            return (
                              <Button
                                key={lesson.id}
                                variant={selectedLesson?.id === lesson.id ? "default" : "ghost"}
                                className="w-full justify-start p-3 h-auto"
                                onClick={() => setSelectedLesson(lesson)}
                                disabled={lesson.isLocked}
                              >
                                <div className="flex items-center space-x-3">
                                  {lesson.isLocked ? (
                                    <Lock className="w-4 h-4" />
                                  ) : lesson.isCompleted ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <LessonIcon className="w-4 h-4" />
                                  )}
                                  <div className="text-left">
                                    <div className="font-medium text-sm">{lesson.title}</div>
                                    <div className="text-xs text-muted-foreground">{lesson.duration}</div>
                                  </div>
                                </div>
                              </Button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Main Learning Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>

              <TabsContent value="content">
                {selectedLesson ? (
                  <Card className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">{selectedLesson.title}</h2>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{selectedLesson.type}</Badge>
                          <Badge variant="outline">{selectedLesson.duration}</Badge>
                        </div>
                      </div>
                    </div>

                    {selectedLesson.type === 'video' && (
                      <div className="mb-6">
                        <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
                          <div className="text-center text-white">
                            <PlayCircle className="w-16 h-16 mx-auto mb-4" />
                            <p className="text-lg">Video Player</p>
                            <p className="text-sm text-gray-400">Duration: {selectedLesson.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Button
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="gradient-primary"
                            >
                              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                              {isPlaying ? 'Pause' : 'Play'}
                            </Button>
                            <div className="flex items-center space-x-2">
                              <Volume2 className="w-4 h-4" />
                              <Maximize className="w-4 h-4" />
                              <Settings className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <BookmarkPlus className="w-4 h-4 mr-2" />
                              Bookmark
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedLesson.type === 'reading' && (
                      <div className="prose max-w-none mb-6">
                        <div className="bg-blue-50 p-6 rounded-lg">
                          <h3 className="text-lg font-semibold mb-4">Reading Material</h3>
                          <p>{selectedLesson.content || 'Reading content would be displayed here...'}</p>
                        </div>
                      </div>
                    )}

                    {selectedLesson.type === 'quiz' && (
                      <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                        <div className="text-center">
                          <Brain className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
                          <h3 className="text-xl font-semibold mb-4">Knowledge Check</h3>
                          <p className="text-gray-600 mb-6">Test your understanding of the concepts covered in this module.</p>
                          <Button className="gradient-primary">
                            Start Quiz
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedLesson.type === 'assignment' && (
                      <div className="bg-green-50 p-6 rounded-lg mb-6">
                        <div className="text-center">
                          <PenTool className="w-16 h-16 mx-auto mb-4 text-green-600" />
                          <h3 className="text-xl font-semibold mb-4">Assignment</h3>
                          <p className="text-gray-600 mb-6">Complete this practical assignment to apply what you've learned.</p>
                          <Button className="gradient-primary">
                            View Assignment
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedLesson.type === 'lab' && (
                      <div className="bg-purple-50 p-6 rounded-lg mb-6">
                        <div className="text-center">
                          <Code2 className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                          <h3 className="text-xl font-semibold mb-4">Hands-on Lab</h3>
                          <p className="text-gray-600 mb-6">Practice in a real coding environment.</p>
                          <Button className="gradient-primary">
                            Launch Lab
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous Lesson
                      </Button>
                      <Button className="gradient-primary">
                        Next Lesson
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-12 text-center">
                    <Book className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">Select a Lesson</h3>
                    <p className="text-gray-600">Choose a lesson from the course content to start learning.</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="notes">
                <Card className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">My Notes</h3>
                    <div className="flex space-x-2">
                      <Textarea 
                        placeholder="Add a note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={addNote} className="gradient-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Note
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {notes.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">No notes yet. Add your first note!</p>
                      </div>
                    ) : (
                      notes.map((note) => (
                        <div key={note.id} className="p-4 border border-border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm text-muted-foreground">
                              Lesson {note.lessonId} {note.videoTime && `• ${note.videoTime}`}
                            </span>
                            <span className="text-xs text-muted-foreground">{note.timestamp}</span>
                          </div>
                          <p>{note.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="resources">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Course Resources</h3>
                  {selectedLesson?.resources && selectedLesson.resources.length > 0 ? (
                    <div className="space-y-4">
                      {selectedLesson.resources.map((resource) => (
                        <div key={resource.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div>
                              <h4 className="font-medium">{resource.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {resource.type.toUpperCase()} {resource.size && `• ${resource.size}`}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">No resources available for this lesson.</p>
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="discussion">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Discussion Forum</h3>
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Join the discussion with other students and instructors.</p>
                    <Button className="mt-4 gradient-primary">
                      Start Discussion
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
