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
  ExternalLink,
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
  Trash2,
  Edit3
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import '../styles/course-study-animations.css';

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
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [lessonProgress, setLessonProgress] = useState<{ [key: string]: number }>({});
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isSavingProgress, setIsSavingProgress] = useState(false);

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

        // Calculate real progress based on completed lessons
        if (user && courseId) {
          const savedCompletions = localStorage.getItem(`course_completions_${courseId}_${user._id}`);
          const completedLessonIds = savedCompletions ? JSON.parse(savedCompletions) : [];
          setCompletedLessons(new Set(completedLessonIds));

          const totalLessons = courseData.syllabus?.reduce((total, module) => total + module.lessons.length, 0) || 0;
          const realProgress = totalLessons > 0 ? (completedLessonIds.length / totalLessons) * 100 : 0;
          setProgress(realProgress);
        }

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

  // Get all lessons in order
  const getAllLessons = () => {
    if (!course?.syllabus) return [];
    const allLessons: { lesson: Lesson; module: Module; moduleIndex: number; lessonIndex: number }[] = [];

    course.syllabus.forEach((module, moduleIndex) => {
      module.lessons.forEach((lesson, lessonIndex) => {
        allLessons.push({ lesson, module, moduleIndex, lessonIndex });
      });
    });

    return allLessons;
  };

  // Get current lesson index
  const getCurrentLessonIndex = () => {
    if (!selectedLesson) return -1;
    const allLessons = getAllLessons();
    return allLessons.findIndex(item =>
      item.lesson._id === selectedLesson._id ||
      (item.lesson.title === selectedLesson.title && item.module.title === selectedModule?.title)
    );
  };

  // Navigate to previous lesson
  const goToPreviousLesson = () => {
    const allLessons = getAllLessons();
    const currentIndex = getCurrentLessonIndex();

    if (currentIndex > 0) {
      const previousItem = allLessons[currentIndex - 1];
      setSelectedLesson(previousItem.lesson);
      setSelectedModule(previousItem.module);
      setCurrentTime(0);
      setIsPlaying(false);

      toast({
        title: "Previous Lesson",
        description: `Now viewing: ${previousItem.lesson.title}`,
      });
    } else {
      toast({
        title: "Already at first lesson",
        description: "This is the first lesson in the course.",
        variant: "destructive"
      });
    }
  };

  // Navigate to next lesson
  const goToNextLesson = () => {
    const allLessons = getAllLessons();
    const currentIndex = getCurrentLessonIndex();

    if (currentIndex < allLessons.length - 1) {
      const nextItem = allLessons[currentIndex + 1];
      setSelectedLesson(nextItem.lesson);
      setSelectedModule(nextItem.module);
      setCurrentTime(0);
      setIsPlaying(false);

      toast({
        title: "Next Lesson",
        description: `Now viewing: ${nextItem.lesson.title}`,
      });
    } else {
      toast({
        title: "Course completed!",
        description: "You've reached the end of this course. Congratulations!",
      });
    }
  };

  // Save lesson progress
  const saveProgress = async () => {
    if (!selectedLesson || !user) return;

    setIsSavingProgress(true);

    try {
      const progressData = {
        courseId,
        lessonId: selectedLesson._id,
        progress: Math.floor(progress),
        currentTime: selectedLesson.type === 'video' ? currentTime : 0,
        lastAccessed: new Date().toISOString()
      };

      // Save to localStorage for now (can be extended to backend)
      const existingProgress = localStorage.getItem(`course_progress_${courseId}_${user._id}`);
      const progressMap = existingProgress ? JSON.parse(existingProgress) : {};
      progressMap[selectedLesson._id || selectedLesson.title] = progressData;
      localStorage.setItem(`course_progress_${courseId}_${user._id}`, JSON.stringify(progressMap));

      setLessonProgress(prev => ({
        ...prev,
        [selectedLesson._id || selectedLesson.title]: Math.floor(progress)
      }));

      toast({
        title: "Progress Saved!",
        description: `Your progress (${Math.floor(progress)}%) has been saved successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSavingProgress(false);
    }
  };

  // Mark lesson as complete
  const markAsComplete = async () => {
    if (!selectedLesson || !user) return;

    setIsMarkingComplete(true);

    try {
      const lessonKey = selectedLesson._id || selectedLesson.title;

      // Save completion to localStorage (can be extended to backend)
      const existingCompletions = localStorage.getItem(`course_completions_${courseId}_${user._id}`);
      const completions = existingCompletions ? JSON.parse(existingCompletions) : [];

      if (!completions.includes(lessonKey)) {
        completions.push(lessonKey);
        localStorage.setItem(`course_completions_${courseId}_${user._id}`, JSON.stringify(completions));

        setCompletedLessons(prev => new Set([...prev, lessonKey]));

        // Recalculate progress based on real completions
        if (course) {
          const totalLessons = course.syllabus?.reduce((total, module) => total + module.lessons.length, 0) || 0;
          const newProgress = totalLessons > 0 ? (completions.length / totalLessons) * 100 : 0;
          setProgress(newProgress);

          // Show celebration animation
          setShowCompletionAnimation(true);
          setTimeout(() => setShowCompletionAnimation(false), 3000);

          toast({
            title: "🎉 Lesson Completed!",
            description: `Great job! You've completed "${selectedLesson.title}". Progress: ${Math.round(newProgress)}%`,
          });
        }
      } else {
        toast({
          title: "Already completed",
          description: "This lesson is already marked as complete.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsMarkingComplete(false);
    }
  };

  // Load saved progress and completions on component mount
  useEffect(() => {
    if (user && courseId) {
      // Load completed lessons
      const savedCompletions = localStorage.getItem(`course_completions_${courseId}_${user._id}`);
      if (savedCompletions) {
        setCompletedLessons(new Set(JSON.parse(savedCompletions)));
      }

      // Load lesson progress
      const savedProgress = localStorage.getItem(`course_progress_${courseId}_${user._id}`);
      if (savedProgress) {
        const progressMap = JSON.parse(savedProgress);
        const progressObj: { [key: string]: number } = {};
        Object.keys(progressMap).forEach(key => {
          progressObj[key] = progressMap[key].progress || 0;
        });
        setLessonProgress(progressObj);
      }
    }
  }, [user, courseId]);

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

  // Render lesson content properly (handle URLs)
  const renderLessonContent = (content: string) => {
    if (!content) return null;

    // Check if content is a URL (video or document)
    const isUrl = content.includes('http') || content.includes('cloudinary.com');

    if (isUrl) {
      // If it's a video URL
      if (content.includes('.mp4') || content.includes('video') || content.includes('youtube') || content.includes('vimeo')) {
        return renderVideoPlayer(content);
      }

      // If it's a document URL
      if (content.includes('.pdf') || content.includes('document') || content.includes('docs')) {
        return (
          <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 rounded-2xl border-2 border-green-200 shadow-xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-green-700 mb-4">📄 Document Available</h3>
              <p className="text-green-600 mb-6">Click the button below to open the document:</p>

              <Button
                onClick={() => window.open(content, '_blank')}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 text-lg font-semibold shadow-lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Open Document
              </Button>
            </div>
            <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              📄 Document
            </div>
          </div>
        );
      }

      // For other URLs, show as a link
      return (
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-200 shadow-xl">
          <div className="text-center">
            <Globe className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-blue-700 mb-4">🔗 External Resource</h3>
            <Button
              onClick={() => window.open(content, '_blank')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 text-lg font-semibold shadow-lg"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Open Resource
            </Button>
          </div>
        </div>
      );
    }

    // Regular text content
    return (
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-200 shadow-xl">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl flex items-center justify-center mr-4">
            <Book className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              📚 Lesson Content
            </h3>
            <p className="text-blue-600 text-sm">Study material and key concepts</p>
          </div>
        </div>
        <div className="prose max-w-none">
          <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-lg">
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Process video URL for different sources
  const processVideoUrl = (url: string) => {
    if (!url) return null;

    console.log('Processing video URL:', url);

    // Handle Cloudinary URLs - ensure they're in the correct format
    if (url.includes('cloudinary.com')) {
      // If it's already a proper Cloudinary video URL, return as is
      if (url.includes('/video/upload/')) {
        return url;
      }
      // If it's a Cloudinary URL but not properly formatted, try to fix it
      return url;
    }
    // Handle YouTube URLs
    else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be')
        ? url.split('/').pop()?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    // Handle Vimeo URLs
    else if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }

    return url;
  };

  // Render actual video player
  const renderVideoPlayer = (videoUrl: string) => {
    const processedUrl = processVideoUrl(videoUrl);

    console.log('Rendering video player for:', processedUrl);

    if (!processedUrl) {
      return (
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl aspect-video flex items-center justify-center border-2 border-gray-700">
          <div className="text-center text-white">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <p className="text-lg font-medium">Video not available</p>
            <p className="text-sm text-gray-400 mt-2">Please check the video URL</p>
          </div>
        </div>
      );
    }

    // Handle embedded videos (YouTube, Vimeo)
    if (processedUrl.includes('youtube.com') || processedUrl.includes('vimeo.com')) {
      return (
        <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-2xl aspect-video overflow-hidden border-2 border-blue-400 shadow-2xl">
          <iframe
            src={processedUrl}
            className="w-full h-full rounded-2xl"
            allowFullScreen
            title="Lesson Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
          <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            🎥 Video Lesson
          </div>
        </div>
      );
    }

    // Handle direct video files (Cloudinary, MP4, etc.)
    return (
      <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-2xl aspect-video overflow-hidden border-2 border-blue-400 shadow-2xl">
        <video
          ref={(video) => {
            if (video) {
              video.addEventListener('loadedmetadata', () => {
                console.log('Video loaded successfully:', processedUrl);
              });
              video.addEventListener('error', (e) => {
                console.error('Video loading error:', e);
              });
            }
          }}
          controls
          className="w-full h-full rounded-2xl object-cover"
          onPlay={() => {
            setIsPlaying(true);
            console.log('Video playing');
          }}
          onPause={() => {
            setIsPlaying(false);
            console.log('Video paused');
          }}
          onLoadStart={() => console.log('Video loading started')}
          onCanPlay={() => console.log('Video can play')}
        >
          <source src={processedUrl} type="video/mp4" />
          <source src={processedUrl} type="video/webm" />
          <source src={processedUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>

        {/* Custom overlay with video info */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm bg-opacity-90">
          <div className="flex items-center space-x-2">
            <Video className="w-4 h-4" />
            <span>🎥 HD Video</span>
            {isPlaying && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
          </div>
        </div>

        {/* Video duration badge */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
          {selectedLesson?.duration || 'Video'}
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
          {/* Enhanced Course Content Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 bg-gradient-to-br from-white via-blue-50 to-purple-50 border-2 border-blue-200 shadow-2xl">
              <div className="mb-6">
                <h3 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  📚 Course Content
                </h3>
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <Book className="w-4 h-4" />
                  <span>{course.syllabus?.length || 0} modules</span>
                  <span>•</span>
                  <span>{course.syllabus?.reduce((total, module) => total + module.lessons.length, 0) || 0} lessons</span>
                </div>
              </div>

              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {course.syllabus?.map((module, moduleIndex) => (
                    <div key={module._id || moduleIndex} className="space-y-3">
                      <Button
                        variant="ghost"
                        className={`w-full justify-between p-4 h-auto rounded-xl border-2 transition-all duration-300 ${expandedModules.includes(module._id || moduleIndex.toString())
                          ? 'bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 border-blue-300 shadow-lg'
                          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                          }`}
                        onClick={() => toggleModule(module._id || moduleIndex.toString())}
                      >
                        <div className="text-left flex-1">
                          <div className="font-semibold text-gray-800 mb-1 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                              {moduleIndex + 1}
                            </div>
                            {module.title}
                          </div>
                          <div className="text-xs text-gray-600 ml-11">
                            📖 {module.lessons.length} lessons • {module.description}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                            Module {moduleIndex + 1}
                          </Badge>
                          {expandedModules.includes(module._id || moduleIndex.toString()) ? (
                            <ChevronDown className="w-5 h-5 text-blue-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </Button>

                      {expandedModules.includes(module._id || moduleIndex.toString()) && (
                        <div className="ml-4 space-y-2 pl-4 border-l-2 border-blue-200">
                          {module.lessons.map((lesson, lessonIndex) => {
                            const LessonIcon = getLessonIcon(lesson.type);
                            const isSelected = selectedLesson?._id === lesson._id ||
                              (selectedLesson?.title === lesson.title && selectedModule?.title === module.title);
                            const lessonKey = lesson._id || lesson.title;
                            const isCompleted = completedLessons.has(lessonKey);
                            const progressValue = lessonProgress[lessonKey] || 0;

                            return (
                              <Button
                                key={lesson._id || lessonIndex}
                                variant={isSelected ? "default" : "ghost"}
                                className={`
                                  w-full justify-start p-4 h-auto rounded-xl transition-all duration-300 relative
                                  ${isSelected
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl border-2 border-blue-400'
                                    : 'bg-white border border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 hover:shadow-md'
                                  }
                                  ${isCompleted ? 'lesson-completed' : ''}
                                `}
                                onClick={() => selectLesson(lesson, module)}
                              >
                                <div className="flex items-center space-x-4 w-full">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center relative ${isSelected
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600'
                                    }`}>
                                    <LessonIcon className="w-5 h-5" />
                                    {isCompleted && (
                                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-3 h-3 text-white" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-left flex-1">
                                    <div className={`font-medium text-sm flex items-center space-x-2 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                                      <span>{lesson.title}</span>
                                      {isCompleted && (
                                        <Trophy className="w-4 h-4 text-yellow-400 animate-pulse" />
                                      )}
                                    </div>
                                    <div className={`text-xs mt-1 flex items-center space-x-3 ${isSelected ? 'text-blue-100' : 'text-gray-500'
                                      }`}>
                                      <span className="flex items-center">
                                        {lesson.type === 'video' ? '🎥' : lesson.type === 'document' ? '📄' : lesson.type === 'quiz' ? '🧠' : '📝'}
                                        {lesson.type}
                                      </span>
                                      {lesson.duration && (
                                        <>
                                          <span>•</span>
                                          <span className="flex items-center">
                                            <Timer className="w-3 h-3 mr-1" />
                                            {lesson.duration}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {isCompleted && (
                                      <div className="text-green-500">
                                        <CheckCircle className="w-5 h-5 animate-pulse" />
                                      </div>
                                    )}
                                    {isSelected && (
                                      <div className="text-white">
                                        <PlayCircle className="w-5 h-5" />
                                      </div>
                                    )}
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
                  <Card className="p-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-2 border-blue-200 shadow-2xl">
                    {/* Enhanced Lesson Header */}
                    <div className="mb-8 pb-6 border-b-2 border-blue-100">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                            {selectedLesson.title}
                          </h2>
                          <div className="flex items-center space-x-4">
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1">
                              {selectedLesson.type.toUpperCase()}
                            </Badge>
                            {selectedLesson.duration && (
                              <Badge variant="outline" className="border-blue-300 text-blue-600 bg-blue-50 px-3 py-1">
                                ⏱️ {selectedLesson.duration}
                              </Badge>
                            )}
                            <Badge variant="outline" className="border-purple-300 text-purple-600 bg-purple-50 px-3 py-1">
                              📚 {selectedModule?.title}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{Math.floor(progress)}%</div>
                          <div className="text-sm text-gray-600">Progress</div>
                        </div>
                      </div>
                      {selectedLesson.description && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
                          <p className="text-gray-700 leading-relaxed">📖 {selectedLesson.description}</p>
                        </div>
                      )}
                    </div>

                    {/* Video Content */}
                    {selectedLesson.type === 'video' && (selectedLesson.videoUrl || selectedLesson.content) && (
                      <div className="mb-8">
                        {renderVideoPlayer(selectedLesson.videoUrl || selectedLesson.content)}
                      </div>
                    )}

                    {/* Document Content */}
                    {selectedLesson.type === 'document' && (selectedLesson.documentUrl || selectedLesson.content) && (
                      <div className="mb-8">
                        <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 rounded-2xl border-2 border-green-200 shadow-xl">
                          <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                              <FileText className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-green-700 mb-4">📄 Document Available</h3>
                            <p className="text-green-600 mb-6">Click the button below to open the document in a new tab:</p>

                            <div className="flex justify-center space-x-4">
                              <Button
                                onClick={() => {
                                  const documentUrl = selectedLesson.documentUrl || selectedLesson.content;
                                  if (documentUrl) {
                                    window.open(documentUrl, '_blank');
                                  }
                                }}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 text-lg font-semibold shadow-lg"
                              >
                                <ExternalLink className="w-5 h-5 mr-2" />
                                Open Document
                              </Button>
                              <Button
                                onClick={() => {
                                  const documentUrl = selectedLesson.documentUrl || selectedLesson.content;
                                  if (documentUrl) {
                                    navigator.clipboard.writeText(documentUrl);
                                  }
                                }}
                                variant="outline"
                                className="border-green-400 text-green-600 hover:bg-green-50 px-6 py-3 text-lg font-medium"
                              >
                                Copy Link
                              </Button>
                            </div>
                          </div>

                          {/* Document info badge */}
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                            📄 Document
                          </div>

                          {/* Duration badge if available */}
                          {selectedLesson?.duration && (
                            <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                              {selectedLesson.duration}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Enhanced Quiz Section */}
                    {selectedLesson.type === 'quiz' && (
                      <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 p-8 rounded-2xl mb-8 border-2 border-yellow-300 shadow-xl">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Brain className="w-10 h-10" />
                          </div>
                          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 mb-4">
                            🧠 Knowledge Check
                          </h3>
                          <p className="text-gray-700 mb-8 max-w-md mx-auto leading-relaxed">
                            Test your understanding of the concepts covered in this lesson. Challenge yourself and reinforce your learning!
                          </p>
                          <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 text-lg font-semibold shadow-lg">
                            <Zap className="w-5 h-5 mr-2" />
                            Start Quiz
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Assignment Section */}
                    {selectedLesson.type === 'assignment' && (
                      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 rounded-2xl mb-8 border-2 border-green-300 shadow-xl">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <PenTool className="w-10 h-10" />
                          </div>
                          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4">
                            📝 Practical Assignment
                          </h3>
                          <p className="text-gray-700 mb-8 max-w-md mx-auto leading-relaxed">
                            Complete this hands-on assignment to apply what you've learned. Build your skills through practical experience!
                          </p>
                          <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 text-lg font-semibold shadow-lg">
                            <Target className="w-5 h-5 mr-2" />
                            View Assignment
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Lesson Completion Section */}
                    <div className="mt-8 mb-8">
                      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6 rounded-2xl border-2 border-green-200 shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl flex items-center justify-center">
                              {selectedLesson && completedLessons.has(selectedLesson._id || selectedLesson.title) ? (
                                <CheckCircle className="w-6 h-6" />
                              ) : (
                                <Target className="w-6 h-6" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-green-700">
                                {selectedLesson && completedLessons.has(selectedLesson._id || selectedLesson.title)
                                  ? '✅ Lesson Completed!'
                                  : '🎯 Ready to Complete?'
                                }
                              </h3>
                              <p className="text-green-600 text-sm">
                                {selectedLesson && completedLessons.has(selectedLesson._id || selectedLesson.title)
                                  ? 'Great job! You\'ve mastered this lesson.'
                                  : 'Mark this lesson as complete when you\'re done studying.'
                                }
                              </p>
                            </div>
                          </div>
                          <div>
                            {selectedLesson && !completedLessons.has(selectedLesson._id || selectedLesson.title) ? (
                              <Button
                                onClick={markAsComplete}
                                disabled={isMarkingComplete}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 font-semibold shadow-lg"
                              >
                                {isMarkingComplete ? (
                                  <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Completing...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Mark Complete
                                  </>
                                )}
                              </Button>
                            ) : (
                              <div className="flex items-center space-x-2 text-green-600 font-semibold">
                                <Trophy className="w-5 h-5" />
                                <span>Completed!</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Navigation with Animations */}
                    <div className="mt-8 pt-6 border-t-2 border-blue-100">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            onClick={goToPreviousLesson}
                            disabled={getCurrentLessonIndex() === 0}
                            className={`
                              nav-button prev-btn border-slate-300 text-white hover:bg-slate-50 px-6 py-3 font-semibold
                              ${getCurrentLessonIndex() === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                              transition-all duration-300 transform
                            `}
                          >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Previous Lesson
                          </Button>

                          <Button
                            onClick={goToNextLesson}
                            disabled={getCurrentLessonIndex() === getAllLessons().length - 1}
                            className={`
                              nav-button next-btn text-white px-6 py-3 font-semibold shadow-lg
                              ${getCurrentLessonIndex() === getAllLessons().length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                              transition-all duration-300 transform
                            `}
                          >
                            Next Lesson
                            <ChevronRight className="w-5 h-5 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Completion Celebration Animation */}
                    {showCompletionAnimation && (
                      <div className="celebration-overlay">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="text-center">
                            <div className="celebration-emoji wiggle" style={{ left: '20%', top: '20%' }}>🎉</div>
                            <div className="celebration-emoji bounce-celebration" style={{ left: '80%', top: '30%' }}>⭐</div>
                            <div className="celebration-emoji wiggle" style={{ left: '10%', top: '60%' }}>🏆</div>
                            <div className="celebration-emoji bounce-celebration" style={{ left: '90%', top: '70%' }}>✨</div>
                            <div className="celebration-emoji wiggle" style={{ left: '50%', top: '10%' }}>🎊</div>

                            <div className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-green-200 slide-in-up">
                              <div className="text-6xl mb-4 bounce-celebration">🎉</div>
                              <h3 className="text-2xl font-bold text-green-600 mb-2">Lesson Completed!</h3>
                              <p className="text-gray-600">Amazing work! You're making great progress.</p>
                            </div>
                          </div>
                        </div>

                        {/* Confetti */}
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className={`confetti-piece confetti-${['red', 'blue', 'green', 'yellow', 'purple', 'pink'][i % 6]}`}
                            style={{
                              left: `${Math.random() * 100}%`,
                              animationDelay: `${Math.random() * 2}s`,
                            }}
                          />
                        ))}

                        {/* Sparkles */}
                        {[...Array(15)].map((_, i) => (
                          <div
                            key={i}
                            className="sparkle-effect"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              animationDelay: `${Math.random() * 1.5}s`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </Card>
                ) : (
                  <Card className="p-16 text-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 border-2 border-blue-200 shadow-xl">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                      <Book className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                      🎯 Ready to Start Learning?
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                      Choose a lesson from the course content to begin your learning journey. Each lesson is designed to build your skills step by step.
                    </p>
                    <div className="flex items-center justify-center space-x-6 text-sm text-blue-600">
                      <div className="flex items-center space-x-2">
                        <Video className="w-5 h-5" />
                        <span>Video Lessons</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>Study Materials</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Brain className="w-5 h-5" />
                        <span>Interactive Quizzes</span>
                      </div>
                    </div>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="notes">
                <Card className="p-8 bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 border-2 border-yellow-200 shadow-2xl">
                  <div className="mb-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl flex items-center justify-center mr-4">
                        <PenTool className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
                          📝 My Learning Notes
                        </h3>
                        <p className="text-yellow-600 text-sm">Capture important insights and key takeaways</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border-2 border-yellow-200">
                      <div className="flex space-x-4">
                        <Textarea
                          placeholder="💭 Add your notes, insights, or questions here..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="flex-1 min-h-[120px] border-yellow-300 focus:border-yellow-500 bg-white shadow-sm"
                        />
                        <Button
                          onClick={addNote}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 shadow-lg self-end"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Save Note
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {notes.length === 0 ? (
                      <div className="text-center py-12 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
                        <MessageSquare className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
                        <h4 className="text-xl font-semibold text-yellow-700 mb-2">No Notes Yet</h4>
                        <p className="text-yellow-600 max-w-md mx-auto">
                          Start taking notes to remember important concepts and insights from your lessons!
                        </p>
                      </div>
                    ) : (
                      notes.map((note) => (
                        <div key={note.id} className="bg-white p-6 border-2 border-yellow-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg flex items-center justify-center">
                                <MessageSquare className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="font-medium text-yellow-700">
                                  📚 {selectedLesson?.title}
                                  {note.videoTime && (
                                    <span className="text-orange-600 ml-2">🎥 {note.videoTime}</span>
                                  )}
                                </span>
                                <div className="text-xs text-yellow-500 mt-1">{note.timestamp}</div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-gray-800 leading-relaxed bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                            {note.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="resources">
                <Card className="p-8 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 border-2 border-green-200 shadow-2xl">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl flex items-center justify-center mr-4">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                        📚 Course Resources
                      </h3>
                      <p className="text-green-600 text-sm">Additional materials and downloadable content</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Sample resource cards */}
                    <div className="bg-white p-6 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">📄 Course Slides</h4>
                      <p className="text-gray-600 text-sm mb-4">Presentation slides for all lessons</p>
                      <Button variant="outline" size="sm" className="w-full border-blue-300 text-blue-600 hover:bg-blue-50">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center mb-4">
                        <Code2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">💻 Code Examples</h4>
                      <p className="text-gray-600 text-sm mb-4">Sample code and project files</p>
                      <Button variant="outline" size="sm" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50">
                        <Download className="w-4 h-4 mr-2" />
                        Download ZIP
                      </Button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl flex items-center justify-center mb-4">
                        <Globe className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">🔗 External Links</h4>
                      <p className="text-gray-600 text-sm mb-4">Useful references and documentation</p>
                      <Button variant="outline" size="sm" className="w-full border-green-300 text-green-600 hover:bg-green-50">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Links
                      </Button>
                    </div>
                  </div>

                  <div className="text-center py-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                    <FileText className="w-16 h-16 mx-auto mb-6 text-green-400" />
                    <h4 className="text-xl font-semibold text-green-700 mb-2">More Resources Coming Soon!</h4>
                    <p className="text-green-600 max-w-md mx-auto">
                      Additional course materials and resources will be available here as they are added by your instructor.
                    </p>
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
