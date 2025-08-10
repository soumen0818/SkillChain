import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { courseAPI } from '@/lib/api';
import ChatComponent from '@/components/ChatComponent';
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
  Plus,
  Loader2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

// Updated interfaces to match backend structure
interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  price: string;
  skillTokenReward: string;
  prerequisites: string[];
  learningOutcomes: string[];
  thumbnail: string;
  status: 'draft' | 'active' | 'paused';
  teacher: {
    _id: string;
    username: string;
    email: string;
  };
  syllabus: Module[];
  students: string[];
  createdAt: string;
  updatedAt: string;
}

interface Module {
  _id?: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
}

interface Lesson {
  _id?: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  videoUrl?: string;
  documentUrl?: string;
  content?: string;
  duration?: string;
  order: number;
}

interface Note {
  id: number;
  lessonId: string;
  content: string;
  timestamp: string;
  videoTime?: string;
}

export default function CourseStudyReal() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State management
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('content');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [progress, setProgress] = useState(0);

  // Fetch course data from backend
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setError('Course ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching course with ID:', courseId);
        const courseData = await courseAPI.getById(courseId);
        console.log('Fetched course data:', courseData);
        
        setCourse(courseData);
        
        // Auto-expand first module and select first lesson
        if (courseData.syllabus && courseData.syllabus.length > 0) {
          const firstModule = courseData.syllabus[0];
          setExpandedModules([firstModule._id || '0']);
          setSelectedModule(firstModule);
          
          if (firstModule.lessons && firstModule.lessons.length > 0) {
            setSelectedLesson(firstModule.lessons[0]);
          }
        }
        
        // Calculate progress (mock for now - you can enhance this)
        const totalLessons = courseData.syllabus?.reduce((total, module) => total + module.lessons.length, 0) || 0;
        const completedLessons = Math.floor(totalLessons * 0.3); // Mock 30% completion
        setProgress(totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0);
        
      } catch (err: any) {
        setError(err.message || 'Failed to load course');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Toggle module expansion
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Select lesson
  const selectLesson = (lesson: Lesson, module: Module) => {
    setSelectedLesson(lesson);
    setSelectedModule(module);
    console.log('Selected lesson:', lesson);
    console.log('From module:', module);
  };

  // Add note
  const addNote = () => {
    if (newNote.trim() && selectedLesson) {
      const note: Note = {
        id: Date.now(),
        lessonId: selectedLesson._id || '',
        content: newNote,
        timestamp: new Date().toLocaleString(),
        videoTime: selectedLesson.type === 'video' ? `${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')}` : undefined
      };
      setNotes(prev => [...prev, note]);
      setNewNote('');
      toast({
        title: "Note added",
        description: "Your note has been saved successfully.",
      });
    }
  };

  // Get lesson icon
  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return FileVideo;
      case 'document': return FileText;
      case 'quiz': return Brain;
      case 'assignment': return PenTool;
      default: return Book;
    }
  };

  // Process video URL for different sources
  const processVideoUrl = (url: string) => {
    if (!url) return null;
    
    console.log('Processing video URL:', url);
    
    // Handle different video sources
    if (url.includes('cloudinary.com')) {
      return url;
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Convert YouTube URL to embed format
      const videoId = url.includes('youtu.be') 
        ? url.split('/').pop()?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } else if (url.includes('vimeo.com')) {
      // Convert Vimeo URL to embed format
      const videoId = url.split('/').pop();
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    
    return url;
  };

  // Render video player
  const renderVideoPlayer = (videoUrl: string) => {
    const processedUrl = processVideoUrl(videoUrl);
    
    console.log('Rendering video player for URL:', processedUrl);
    
    if (!processedUrl) {
      return (
        <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
          <div className="text-center text-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p>Video not available</p>
          </div>
        </div>
      );
    }

    if (processedUrl.includes('youtube.com') || processedUrl.includes('vimeo.com')) {
      return (
        <div className="bg-gray-900 rounded-lg aspect-video">
          <iframe
            src={processedUrl}
            className="w-full h-full rounded-lg"
            allowFullScreen
            title="Lesson Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      );
    }

    return (
      <div className="bg-gray-900 rounded-lg aspect-video">
        <video
          controls
          className="w-full h-full rounded-lg"
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={processedUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  // Render PDF viewer
  const renderPDFViewer = (documentUrl: string) => {
    if (!documentUrl) {
      return (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No document available</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border">
        <iframe
          src={`${documentUrl}#toolbar=1&navpanes=1&scrollbar=1`}
          className="w-full h-96 rounded-lg"
          title="Lesson Document"
        />
        <div className="p-4 border-t">
          <Button 
            onClick={() => window.open(documentUrl, '_blank')}
            variant="outline"
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin mb-4" />
          <h3 className="text-lg font-semibold mb-2">Loading Course</h3>
          <p className="text-gray-600">Please wait while we fetch the course content...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Course Not Found</h3>
          <p className="text-gray-600 mb-4">{error || 'The requested course could not be loaded.'}</p>
          <Button onClick={() => navigate('/my-learning-journey')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Journey
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/my-learning-journey')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back Previous
          </Button>
          
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-6">
                  <Badge className="bg-white/20 text-white hover:bg-white/30">
                    {course.category}
                  </Badge>
                  <Badge className="bg-white/20 text-white hover:bg-white/30">
                    {course.level}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span>4.8</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
                <p className="text-blue-100 mb-4 max-w-2xl">{course.description}</p>
                <div className="flex items-center space-x-6 text-sm text-blue-100">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{course.students.length} students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Coins className="w-4 h-4" />
                    <span>{course.skillTokenReward} SkillTokens</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>By {course.teacher.username}</span>
                  </div>
                </div>
              </div>
              <div className="text-center min-w-[200px]">
                <div className="text-4xl font-bold mb-2">{progress.toFixed(0)}%</div>
                <p className="text-blue-100 mb-3">Progress</p>
                <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-blue-200">
                  <span>Completed</span>
                  <span>{progress.toFixed(0)}%</span>
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
                  {course.syllabus?.map((module, moduleIndex) => (
                    <div key={module._id || moduleIndex} className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-3 h-auto"
                        onClick={() => toggleModule(module._id || moduleIndex.toString())}
                      >
                        <div className="text-left">
                          <div className="font-medium">{module.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {module.lessons.length} lessons
                          </div>
                        </div>
                        {expandedModules.includes(module._id || moduleIndex.toString()) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                      
                      {expandedModules.includes(module._id || moduleIndex.toString()) && (
                        <div className="ml-4 space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => {
                            const LessonIcon = getLessonIcon(lesson.type);
                            const isSelected = selectedLesson?._id === lesson._id || 
                              (selectedLesson?.title === lesson.title && selectedModule?.title === module.title);
                            
                            return (
                              <Button
                                key={lesson._id || lessonIndex}
                                variant={isSelected ? "default" : "ghost"}
                                className="w-full justify-start p-3 h-auto"
                                onClick={() => selectLesson(lesson, module)}
                              >
                                <div className="flex items-center space-x-3">
                                  <LessonIcon className="w-4 h-4" />
                                  <div className="text-left">
                                    <div className="font-medium text-sm">{lesson.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {lesson.type} {lesson.duration && `• ${lesson.duration}`}
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
                          {selectedLesson.duration && (
                            <Badge variant="outline">{selectedLesson.duration}</Badge>
                          )}
                        </div>
                      </div>
                      {selectedLesson.description && (
                        <p className="text-gray-600 mb-4">{selectedLesson.description}</p>
                      )}
                    </div>

                    {/* Video Content */}
                    {selectedLesson.type === 'video' && selectedLesson.videoUrl && (
                      <div className="mb-6">
                        {renderVideoPlayer(selectedLesson.videoUrl)}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-4">
                            <Button
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                              {isPlaying ? 'Pause' : 'Play'}
                            </Button>
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

                    {/* Document Content */}
                    {selectedLesson.type === 'document' && selectedLesson.documentUrl && (
                      <div className="mb-6">
                        {renderPDFViewer(selectedLesson.documentUrl)}
                      </div>
                    )}

                    {/* Text Content */}
                    {selectedLesson.content && (
                      <div className="prose max-w-none mb-6">
                        <div className="bg-blue-50 p-6 rounded-lg">
                          <h3 className="text-lg font-semibold mb-4">Lesson Content</h3>
                          <div className="whitespace-pre-wrap">{selectedLesson.content}</div>
                        </div>
                      </div>
                    )}

                    {/* Quiz placeholder */}
                    {selectedLesson.type === 'quiz' && (
                      <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                        <div className="text-center">
                          <Brain className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
                          <h3 className="text-xl font-semibold mb-4">Knowledge Check</h3>
                          <p className="text-gray-600 mb-6">Test your understanding of the concepts covered in this lesson.</p>
                          <Button className="bg-yellow-600 hover:bg-yellow-700">
                            Start Quiz
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Assignment placeholder */}
                    {selectedLesson.type === 'assignment' && (
                      <div className="bg-green-50 p-6 rounded-lg mb-6">
                        <div className="text-center">
                          <PenTool className="w-16 h-16 mx-auto mb-4 text-green-600" />
                          <h3 className="text-xl font-semibold mb-4">Assignment</h3>
                          <p className="text-gray-600 mb-6">Complete this practical assignment to apply what you've learned.</p>
                          <Button className="bg-green-600 hover:bg-green-700">
                            View Assignment
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between">
                      <Button variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous Lesson
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">
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
                      <Button onClick={addNote} className="bg-blue-600 hover:bg-blue-700">
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
                              {selectedLesson?.title} {note.videoTime && `• ${note.videoTime}`}
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
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Course resources will be available here.</p>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="discussion">
                <ChatComponent 
                  courseId={courseId!} 
                  lessonId={selectedLesson?._id}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
