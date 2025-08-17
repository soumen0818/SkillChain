import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import { courseAPI } from '@/lib/api';
import {
  ArrowLeft,
  Trophy,
  Target,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  PlayCircle,
  BarChart3,
  TrendingUp,
  Award,
  Coins,
  Star,
  Users,
  Brain,
  Zap,
  Timer,
  Activity,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  LineChart,
  PieChart,
  Medal,
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Helper functions for progress calculation
const getCompletedLessons = (courseId: string, userId: string) => {
  const completionKey = `course_completions_${courseId}_${userId}`;
  return JSON.parse(localStorage.getItem(completionKey) || '[]');
};

const calculateWeeklyProgress = (completedLessons: string[], totalWeeks: number = 4) => {
  // Simplified weekly progress calculation
  const lessonsPerWeek = Math.ceil(completedLessons.length / totalWeeks);
  return Array.from({ length: totalWeeks }, (_, i) => ({
    week: `Week ${i + 1}`,
    hoursStudied: Math.round(Math.random() * 8 + 2),
    lessonsCompleted: Math.min(lessonsPerWeek, Math.max(0, completedLessons.length - (i * lessonsPerWeek))),
    quizzesCompleted: Math.round(Math.random() * 3 + 1),
    skillTokensEarned: Math.round(Math.random() * 50 + 20)
  }));
};

const generateAchievements = (completedLessons: number, overallProgress: number, completedModules: number) => {
  const achievements = [];

  if (completedLessons >= 1) {
    achievements.push({
      id: 1,
      title: 'First Steps',
      description: 'Completed your first lesson',
      icon: '🎯',
      earnedDate: new Date().toISOString().split('T')[0],
      type: 'milestone' as const
    });
  }

  if (overallProgress >= 25) {
    achievements.push({
      id: 2,
      title: 'Quarter Way There',
      description: 'Completed 25% of the course',
      icon: '📚',
      earnedDate: new Date().toISOString().split('T')[0],
      type: 'milestone' as const
    });
  }

  if (overallProgress >= 50) {
    achievements.push({
      id: 3,
      title: 'Halfway Champion',
      description: 'Completed 50% of the course',
      icon: '🏆',
      earnedDate: new Date().toISOString().split('T')[0],
      type: 'milestone' as const
    });
  }

  if (overallProgress >= 75) {
    achievements.push({
      id: 4,
      title: 'Almost There',
      description: 'Completed 75% of the course',
      icon: '🔥',
      earnedDate: new Date().toISOString().split('T')[0],
      type: 'milestone' as const
    });
  }

  if (completedModules >= 3) {
    achievements.push({
      id: 5,
      title: 'Module Master',
      description: 'Completed 3 modules',
      icon: '🎖️',
      earnedDate: new Date().toISOString().split('T')[0],
      type: 'milestone' as const
    });
  }

  return achievements;
};

interface CourseProgress {
  id: number;
  title: string;
  instructor: string;
  totalModules: number;
  completedModules: number;
  totalLessons: number;
  completedLessons: number;
  totalQuizzes: number;
  completedQuizzes: number;
  totalAssignments: number;
  completedAssignments: number;
  overallProgress: number;
  timeSpent: number; // in hours
  estimatedTimeLeft: number; // in hours
  skillTokensEarned: number;
  skillTokensPotential: number;
  averageQuizScore: number;
  streak: number;
  lastActivity: string;
  enrollmentDate: string;
  modules: ModuleProgress[];
  weeklyProgress: WeeklyProgress[];
  achievements: Achievement[];
}

interface ModuleProgress {
  id: number;
  title: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  timeSpent: number;
  isCompleted: boolean;
  completionDate?: string;
}

interface WeeklyProgress {
  week: string;
  hoursStudied: number;
  lessonsCompleted: number;
  quizzesCompleted: number;
  skillTokensEarned: number;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  type: 'milestone' | 'streak' | 'score' | 'time';
}

export default function CourseProgress() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getCourseById } = useCourses();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real course data and calculate progress
  useEffect(() => {
    const fetchCourseProgress = async () => {
      if (!courseId || !user) {
        setError('Course ID or user not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get course data from context or API
        let course = getCourseById(courseId);

        if (!course) {
          // If not in context, fetch from API
          course = await courseAPI.getById(courseId);
        }

        if (!course) {
          setError('Course not found');
          setLoading(false);
          return;
        }

        // Calculate progress based on real course data
        const syllabus = course.syllabus || course.curriculum || [];
        const totalModules = syllabus.length;
        let totalLessons = 0;
        let completedLessons = 0;
        let completedModules = 0;

        // Get completion data from localStorage (since we don't have a progress API yet)
        const completedLessonIds = getCompletedLessons(courseId, user._id);

        const modules: ModuleProgress[] = syllabus.map((module: any, index: number) => {
          const lessons = module.lessons || [];
          const moduleTotalLessons = lessons.length;
          const moduleCompletedLessons = lessons.filter((lesson: any) =>
            completedLessonIds.includes(lesson._id || lesson.title)
          ).length;

          totalLessons += moduleTotalLessons;
          completedLessons += moduleCompletedLessons;

          const moduleProgress = moduleTotalLessons > 0 ? Math.round((moduleCompletedLessons / moduleTotalLessons) * 100) : 0;
          const isCompleted = moduleProgress === 100;

          if (isCompleted) {
            completedModules++;
          }

          return {
            id: index + 1,
            title: module.title || `Module ${index + 1}`,
            progress: moduleProgress,
            lessonsCompleted: moduleCompletedLessons,
            totalLessons: moduleTotalLessons,
            timeSpent: Math.round(moduleCompletedLessons * 0.5 * 10) / 10, // Estimate: 30min per lesson
            isCompleted,
            completionDate: isCompleted ? new Date().toISOString().split('T')[0] : undefined
          };
        });

        const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        const estimatedTimeLeft = (totalLessons - completedLessons) * 0.5; // 30min per lesson
        const timeSpent = completedLessons * 0.5; // 30min per lesson

        // Create course progress object with real data
        const progressData: CourseProgress = {
          id: parseInt(courseId),
          title: course.title || 'Course Title',
          instructor: course.teacher?.username || 'Instructor',
          totalModules,
          completedModules,
          totalLessons,
          completedLessons,
          totalQuizzes: 0, // We don't have quiz data in current structure
          completedQuizzes: 0,
          totalAssignments: 0,
          completedAssignments: 0,
          overallProgress,
          timeSpent: Math.round(timeSpent * 10) / 10,
          estimatedTimeLeft: Math.round(estimatedTimeLeft * 10) / 10,
          skillTokensEarned: completedLessons * 10, // 10 tokens per lesson
          skillTokensPotential: totalLessons * 10,
          averageQuizScore: 0,
          streak: 0,
          lastActivity: 'Recent',
          enrollmentDate: new Date().toISOString().split('T')[0],
          modules,
          weeklyProgress: calculateWeeklyProgress(completedLessonIds),
          achievements: generateAchievements(completedLessons, overallProgress, completedModules)
        };

        setCourseProgress(progressData);
      } catch (err) {
        console.error('Error fetching course progress:', err);
        setError('Failed to load course progress');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseProgress();
  }, [courseId, user, getCourseById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Loading Course Progress</h3>
          <p className="text-gray-600">Please wait while we fetch your progress data...</p>
        </div>
      </div>
    );
  }

  if (error || !courseProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Error Loading Progress</h3>
          <p className="text-gray-600 mb-4">{error || 'Course progress could not be loaded.'}</p>
          <Button onClick={() => navigate('/my-learning-journey')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Journey
          </Button>
        </div>
      </div>
    );
  }

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getModuleIcon = (module: ModuleProgress) => {
    if (module.isCompleted) return CheckCircle;
    if (module.progress > 0) return PlayCircle;
    return BookOpen;
  };

  const getModuleColor = (module: ModuleProgress) => {
    if (module.isCompleted) return 'text-green-600';
    if (module.progress > 0) return 'text-blue-600';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 pt-20 pb-12">
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

          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl p-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-3">{courseProgress.title}</h1>
                <p className="text-blue-100 mb-4">Progress Tracking & Analytics</p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Instructor: {courseProgress.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Enrolled: {new Date(courseProgress.enrollmentDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4" />
                    <span>Last activity: {courseProgress.lastActivity}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold mb-2">{courseProgress.overallProgress}%</div>
                <div className="text-blue-100">Overall Progress</div>
                <div className="w-40 mt-3">
                  <Progress value={courseProgress.overallProgress} className="bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 text-sm font-medium">Lessons Completed</p>
                <p className="text-3xl font-bold text-green-900">{courseProgress.completedLessons}</p>
                <p className="text-xs text-green-600 mt-1">of {courseProgress.totalLessons} total</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-medium">Time Invested</p>
                <p className="text-3xl font-bold text-blue-900">{courseProgress.timeSpent}h</p>
                <p className="text-xs text-blue-600 mt-1">{courseProgress.estimatedTimeLeft}h remaining</p>
              </div>
              <Clock className="w-10 h-10 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-700 text-sm font-medium">Learning Streak</p>
                <p className="text-3xl font-bold text-yellow-900">{courseProgress.streak}</p>
                <p className="text-xs text-yellow-600 mt-1">days in a row</p>
              </div>
              <Flame className="w-10 h-10 text-yellow-600" />
            </div>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 text-sm font-medium">SkillTokens</p>
                <p className="text-3xl font-bold text-purple-900">{courseProgress.skillTokensEarned}</p>
                <p className="text-xs text-purple-600 mt-1">of {courseProgress.skillTokensPotential} possible</p>
              </div>
              <Coins className="w-10 h-10 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="modules">Module Progress</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Progress Summary */}
              <Card className="p-6 shadow-lg border-0">
                <h3 className="text-xl font-semibold mb-6">Progress Summary</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Overall Course Progress</span>
                      <span className="text-sm text-muted-foreground">{courseProgress.overallProgress}%</span>
                    </div>
                    <Progress value={courseProgress.overallProgress} className="h-3" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Modules Completed</span>
                      <span className="text-sm text-muted-foreground">{courseProgress.completedModules}/{courseProgress.totalModules}</span>
                    </div>
                    <Progress value={(courseProgress.completedModules / courseProgress.totalModules) * 100} className="h-3" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Quizzes Completed</span>
                      <span className="text-sm text-muted-foreground">{courseProgress.completedQuizzes}/{courseProgress.totalQuizzes}</span>
                    </div>
                    <Progress value={(courseProgress.completedQuizzes / courseProgress.totalQuizzes) * 100} className="h-3" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Assignments Completed</span>
                      <span className="text-sm text-muted-foreground">{courseProgress.completedAssignments}/{courseProgress.totalAssignments}</span>
                    </div>
                    <Progress value={(courseProgress.completedAssignments / courseProgress.totalAssignments) * 100} className="h-3" />
                  </div>
                </div>
              </Card>

              {/* Performance Metrics */}
              <Card className="p-6 shadow-lg border-0">
                <h3 className="text-xl font-semibold mb-6">Performance Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-900">{courseProgress.averageQuizScore}%</div>
                    <div className="text-sm text-blue-700">Avg Quiz Score</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-900">{Math.round((courseProgress.timeSpent / (courseProgress.timeSpent + courseProgress.estimatedTimeLeft)) * 100)}%</div>
                    <div className="text-sm text-green-700">Time Progress</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-900">{Math.round(courseProgress.timeSpent / courseProgress.completedLessons * 10) / 10}h</div>
                    <div className="text-sm text-purple-700">Avg per Lesson</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                    <Medal className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-900">{courseProgress.achievements.length}</div>
                    <div className="text-sm text-yellow-700">Achievements</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Weekly Progress Chart */}
            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-xl font-semibold mb-6">Weekly Learning Progress</h3>
              <div className="space-y-4">
                {courseProgress.weeklyProgress.map((week, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 text-sm font-medium">{week.week}</div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>{week.hoursStudied}h</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-green-600" />
                          <span>{week.lessonsCompleted} lessons</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4 text-purple-600" />
                          <span>{week.quizzesCompleted} quizzes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Coins className="w-4 h-4 text-yellow-600" />
                          <span>{week.skillTokensEarned} ST</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-32">
                      <Progress value={(week.hoursStudied / 10) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-xl font-semibold mb-6">Module-wise Progress</h3>
              <div className="space-y-4">
                {courseProgress.modules.map((module) => {
                  const ModuleIcon = getModuleIcon(module);
                  const isExpanded = expandedModules.includes(module.id);

                  return (
                    <div key={module.id} className="border border-border rounded-lg">
                      <div
                        className="p-4 cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleModule(module.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <ModuleIcon className={`w-6 h-6 ${getModuleColor(module)}`} />
                            <div>
                              <h4 className="font-semibold">{module.title}</h4>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>{module.lessonsCompleted}/{module.totalLessons} lessons</span>
                                <span>{module.timeSpent}h spent</span>
                                {module.isCompleted && module.completionDate && (
                                  <span>Completed {new Date(module.completionDate).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-lg font-bold">{module.progress}%</div>
                              <div className="w-24">
                                <Progress value={module.progress} className="h-2" />
                              </div>
                            </div>
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4">
                          <Separator className="mb-4" />
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center justify-between">
                              <span>Progress:</span>
                              <Badge variant={module.isCompleted ? "default" : "secondary"}>
                                {module.isCompleted ? "Completed" : "In Progress"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Time Spent:</span>
                              <span className="font-medium">{module.timeSpent} hours</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Lessons:</span>
                              <span className="font-medium">{module.lessonsCompleted}/{module.totalLessons}</span>
                            </div>
                          </div>
                          {!module.isCompleted && (
                            <Button
                              className="mt-4 w-full"
                              onClick={() => navigate(`/course-study/${courseProgress.id}`)}
                            >
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Continue Module
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-6 shadow-lg border-0">
                <h3 className="text-xl font-semibold mb-6">Learning Trends</h3>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <LineChart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h4 className="font-semibold mb-2">Study Pattern Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      You're most productive on weekdays, averaging 1.2 hours per session
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                    <PieChart className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h4 className="font-semibold mb-2">Time Distribution</h4>
                    <p className="text-sm text-muted-foreground">
                      70% videos, 20% reading, 10% quizzes
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-lg border-0">
                <h3 className="text-xl font-semibold mb-6">Performance Insights</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-green-900">Strong Progress</div>
                        <div className="text-sm text-green-700">You're 15% ahead of average learners</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Timer className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-900">Consistent Pace</div>
                        <div className="text-sm text-blue-700">Maintain your {courseProgress.streak}-day streak!</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-yellow-600" />
                      <div>
                        <div className="font-medium text-yellow-900">Goal Tracking</div>
                        <div className="text-sm text-yellow-700">On track to complete in 3.5 weeks</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-xl font-semibold mb-6">Your Achievements</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {courseProgress.achievements.map((achievement) => (
                  <div key={achievement.id} className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{achievement.title}</h4>
                        <p className="text-muted-foreground mb-3">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{achievement.type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(achievement.earnedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
