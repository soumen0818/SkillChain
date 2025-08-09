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

  // Mock course data - in real app, this would be fetched based on courseId
  const courseData: CourseData = {
    id: parseInt(courseId || '1'),
    title: 'Blockchain Fundamentals',
    instructor: 'Dr. Sarah Johnson',
    description: 'Master the foundations of blockchain technology, cryptocurrency, and decentralized systems. Learn how to build, deploy, and interact with smart contracts.',
    progress: 65,
    duration: '8 weeks',
    difficulty: 'Beginner',
    rating: 4.8,
    students: 1247,
    category: 'Blockchain',
    skillTokens: 500,
    thumbnail: 'https://images.unsplash.com/photo-1518896012122-3dcff33c6334?w=800&h=400&fit=crop',
    completedLessons: 16,
    totalLessons: 25,
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
          },
          {
            id: 3,
            title: 'Knowledge Check',
            type: 'quiz',
            duration: '10 min',
            isCompleted: true,
            isLocked: false
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
            id: 4,
            title: 'Hash Functions',
            type: 'video',
            duration: '25 min',
            isCompleted: true,
            isLocked: false,
            videoUrl: 'https://example.com/video2'
          },
          {
            id: 5,
            title: 'Digital Signatures',
            type: 'video',
            duration: '30 min',
            isCompleted: false,
            isLocked: false,
            videoUrl: 'https://example.com/video3'
          },
          {
            id: 6,
            title: 'Practical Cryptography Lab',
            type: 'lab',
            duration: '45 min',
            isCompleted: false,
            isLocked: false
          }
        ]
      },
      {
        id: 3,
        title: 'Smart Contracts',
        description: 'Introduction to smart contracts and Solidity programming',
        duration: '4 hours',
        isCompleted: false,
        isLocked: false,
        lessons: [
          {
            id: 7,
            title: 'Smart Contract Basics',
            type: 'video',
            duration: '35 min',
            isCompleted: false,
            isLocked: false
          },
          {
            id: 8,
            title: 'Solidity Programming',
            type: 'video',
            duration: '40 min',
            isCompleted: false,
            isLocked: false
          },
          {
            id: 9,
            title: 'Deploy Your First Contract',
            type: 'assignment',
            duration: '60 min',
            isCompleted: false,
            isLocked: false
          }
        ]
      },
      {
        id: 4,
        title: 'Advanced Topics',
        description: 'DeFi, NFTs, and advanced blockchain concepts',
        duration: '3 hours',
        isCompleted: false,
        isLocked: true,
        lessons: [
          {
            id: 10,
            title: 'DeFi Protocols',
            type: 'video',
            duration: '30 min',
            isCompleted: false,
            isLocked: true
          },
          {
            id: 11,
            title: 'NFT Standards',
            type: 'reading',
            duration: '25 min',
            isCompleted: false,
            isLocked: true
          }
        ]
      }
    ]
  };

  const mockNotes: Note[] = [
    {
      id: 1,
      lessonId: 1,
      content: 'Blockchain is a distributed ledger technology that maintains a continuously growing list of records.',
      timestamp: '2024-12-09T10:30:00Z',
      videoTime: '5:23'
    },
    {
      id: 2,
      lessonId: 1,
      content: 'Key properties: Immutability, Transparency, Decentralization',
      timestamp: '2024-12-09T10:35:00Z',
      videoTime: '8:15'
    }
  ];

  useEffect(() => {
    setNotes(mockNotes);
    // Set first available lesson as selected
    const firstLesson = courseData.modules[0]?.lessons[0];
    if (firstLesson && !firstLesson.isLocked) {
      setSelectedLesson(firstLesson);
    }
  }, []);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'reading': return Book;
      case 'quiz': return Brain;
      case 'assignment': return PenTool;
      case 'lab': return Code2;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-blue-600 bg-blue-50';
      case 'reading': return 'text-green-600 bg-green-50';
      case 'quiz': return 'text-purple-600 bg-purple-50';
      case 'assignment': return 'text-orange-600 bg-orange-50';
      case 'lab': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const addNote = () => {
    if (newNote.trim() && selectedLesson) {
      const note: Note = {
        id: Date.now(),
        lessonId: selectedLesson.id,
        content: newNote.trim(),
        timestamp: new Date().toISOString(),
        videoTime: selectedLesson.type === 'video' ? `${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')}` : undefined
      };
      setNotes(prev => [...prev, note]);
      setNewNote('');
    }
  };

  const filteredLessons = courseData.modules.flatMap(module => 
    module.lessons.filter(lesson => 
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-20 pb-12">
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
          
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl p-8 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
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
                <div className="flex items-center space-x-6 text-sm">
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
              <div className="text-right">
                <div className="text-4xl font-bold mb-2">{courseData.progress}%</div>
                <div className="text-blue-100 text-sm mb-4">Complete</div>
                <div className="w-32">
                  <Progress value={courseData.progress} className="bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Course Content Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-lg border-0 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Course Content</h3>
                <span className="text-sm text-muted-foreground">
                  {courseData.completedLessons}/{courseData.totalLessons}
                </span>
              </div>
              
              <div className="mb-4">
                <Input
                  placeholder="Search lessons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-sm"
                />
              </div>

              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {courseData.modules.map((module) => (
                    <div key={module.id}>
                      <Button
                        variant="ghost"
                        onClick={() => toggleModule(module.id)}
                        className="w-full justify-between p-3 h-auto"
                        disabled={module.isLocked}
                      >
                        <div className="flex items-center space-x-3">
                          {module.isLocked ? (
                            <Lock className="w-4 h-4" />
                          ) : module.isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <PlayCircle className="w-4 h-4" />
                          )}
                          <div className="text-left">
                            <div className="font-medium text-sm">{module.title}</div>
                            <div className="text-xs text-muted-foreground">{module.duration}</div>
                          </div>
                        </div>
                        {expandedModules.includes(module.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                      
                      {expandedModules.includes(module.id) && (
                        <div className="ml-4 mt-2 space-y-2">
                          {module.lessons.map((lesson) => {
                            const TypeIcon = getTypeIcon(lesson.type);
                            return (
                              <Button
                                key={lesson.id}
                                variant={selectedLesson?.id === lesson.id ? "secondary" : "ghost"}
                                onClick={() => !lesson.isLocked && setSelectedLesson(lesson)}
                                className="w-full justify-start p-3 h-auto"
                                disabled={lesson.isLocked}
                              >
                                <div className="flex items-center space-x-3">
                                  {lesson.isLocked ? (
                                    <Lock className="w-4 h-4" />
                                  ) : lesson.isCompleted ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <TypeIcon className="w-4 h-4" />
                                  )}
                                  <div className="text-left">
                                    <div className="font-medium text-sm">{lesson.title}</div>
                                    <div className="flex items-center space-x-2">
                                      <Badge className={`text-xs ${getTypeColor(lesson.type)}`}>
                                        {lesson.type}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                                    </div>
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

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {selectedLesson ? (
              <div className="space-y-6">
                {/* Lesson Header */}
                <Card className="p-6 shadow-lg border-0">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
                      <div className="flex items-center space-x-4">
                        <Badge className={getTypeColor(selectedLesson.type)}>
                          {selectedLesson.type.toUpperCase()}
                        </Badge>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{selectedLesson.duration}</span>
                        </div>
                        {selectedLesson.isCompleted && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
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
                </Card>

                {/* Lesson Content */}
                <Card className="shadow-lg border-0 overflow-hidden">
                  {selectedLesson.type === 'video' && (
                    <div className="relative bg-black aspect-video">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-center">
                          <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg mb-4">Video Player</p>
                          <p className="text-sm opacity-75">Duration: {selectedLesson.duration}</p>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
                        <div className="flex items-center space-x-4 text-white">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="text-white hover:bg-white/20"
                          >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                          </Button>
                          <div className="flex-1">
                            <Progress value={40} className="bg-white/20" />
                          </div>
                          <span className="text-sm">05:23 / 15:00</span>
                          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                            <Volume2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                            <Maximize className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedLesson.type === 'reading' && (
                    <div className="p-8">
                      <div className="prose max-w-none">
                        <h3 className="text-xl font-semibold mb-4">Reading Material</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {selectedLesson.content || 'This is where the reading content would be displayed. It would include comprehensive material about the lesson topic with proper formatting, images, and interactive elements.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedLesson.type === 'quiz' && (
                    <div className="p-8">
                      <div className="text-center">
                        <Brain className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-4">Knowledge Check</h3>
                        <p className="text-muted-foreground mb-6">
                          Test your understanding with interactive questions
                        </p>
                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start Quiz
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedLesson.type === 'assignment' && (
                    <div className="p-8">
                      <div className="text-center">
                        <PenTool className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-4">Assignment</h3>
                        <p className="text-muted-foreground mb-6">
                          Complete this practical assignment to apply your knowledge
                        </p>
                        <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                          <Target className="w-4 h-4 mr-2" />
                          View Assignment
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedLesson.type === 'lab' && (
                    <div className="p-8">
                      <div className="text-center">
                        <Code2 className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-4">Hands-on Lab</h3>
                        <p className="text-muted-foreground mb-6">
                          Practice with real code and interactive exercises
                        </p>
                        <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                          <Zap className="w-4 h-4 mr-2" />
                          Launch Lab
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Resources and Notes */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Resources */}
                  {selectedLesson.resources && selectedLesson.resources.length > 0 && (
                    <Card className="p-6 shadow-lg border-0">
                      <h3 className="font-semibold mb-4 flex items-center">
                        <Download className="w-5 h-5 mr-2" />
                        Resources
                      </h3>
                      <div className="space-y-3">
                        {selectedLesson.resources.map((resource) => (
                          <div key={resource.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50">
                            <div className="flex items-center space-x-3">
                              {resource.type === 'pdf' && <FileText className="w-5 h-5 text-red-500" />}
                              {resource.type === 'code' && <FileCode className="w-5 h-5 text-blue-500" />}
                              {resource.type === 'link' && <Globe className="w-5 h-5 text-green-500" />}
                              {resource.type === 'image' && <FileImage className="w-5 h-5 text-purple-500" />}
                              <div>
                                <div className="font-medium text-sm">{resource.title}</div>
                                {resource.size && (
                                  <div className="text-xs text-muted-foreground">{resource.size}</div>
                                )}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Notes */}
                  <Card className="p-6 shadow-lg border-0">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      My Notes
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Add a note..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="resize-none"
                          rows={3}
                        />
                        <Button 
                          onClick={addNote}
                          disabled={!newNote.trim()}
                          size="sm"
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Note
                        </Button>
                      </div>
                      <Separator />
                      <ScrollArea className="h-48">
                        <div className="space-y-3">
                          {notes
                            .filter(note => note.lessonId === selectedLesson.id)
                            .map((note) => (
                              <div key={note.id} className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm mb-2">{note.content}</p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{new Date(note.timestamp).toLocaleDateString()}</span>
                                  {note.videoTime && (
                                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                                      {note.videoTime}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </Card>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous Lesson
                  </Button>
                  <div className="flex space-x-3">
                    {!selectedLesson.isCompleted && (
                      <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Complete
                      </Button>
                    )}
                    <Button>
                      Next Lesson
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Card className="p-12 text-center shadow-lg border-0">
                <Book className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Lesson</h3>
                <p className="text-muted-foreground">
                  Choose a lesson from the course content to start learning
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
