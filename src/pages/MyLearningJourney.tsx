import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { courseAPI } from '@/lib/api';
import {
  ArrowLeft,
  BookOpen,
  PlayCircle,
  Clock,
  Star,
  Award,
  Users,
  Calendar,
  CheckCircle,
  PauseCircle,
  BarChart3,
  Search,
  Target,
  Coins,
  Trophy,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Headphones
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Course {
  _id: string;
  title: string;
  teacher: {
    username: string;
  };
  progress: number;
  duration: string;
  category: string;
  level: string;
  rating: number;
  students: any[];
  nextLesson: string;
  completedLessons: number;
  totalLessons: number;
  timeSpent: string;
  estimatedTimeLeft: string;
  updatedAt: string;
  status: 'active' | 'completed' | 'paused';
  skillTokensEarned: number;
  skillTokenReward: string;
  thumbnail: string;
  createdAt: string;
  certificateEligible: boolean;
}

export default function MyLearningJourney() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('progress');
  const [filterBy, setFilterBy] = useState('all');
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const courses = await courseAPI.getEnrolledCourses();

        // Simulate progress and other student-specific data for now
        const coursesWithProgress = courses.map((course: any) => ({
          ...course,
          progress: Math.floor(Math.random() * 100),
          status: course.progress === 100 ? 'completed' : ['active', 'paused'][Math.floor(Math.random() * 2)],
          timeSpent: `${(Math.random() * 20).toFixed(1)} hours`,
          estimatedTimeLeft: `${(Math.random() * 10).toFixed(1)} hours`,
          completedLessons: Math.floor(Math.random() * course.totalLessons),
          nextLesson: 'Next up: Introduction',
          skillTokensEarned: Math.floor(Math.random() * parseInt(course.skillTokenReward || '0')),
        }));

        setEnrolledCourses(coursesWithProgress);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch enrolled courses.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const getFilteredCourses = () => {
    let filtered = enrolledCourses;

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(course => course.status === activeTab);
    }

    // Filter by category
    if (filterBy !== 'all') {
      filtered = filtered.filter(course => course.category.toLowerCase() === filterBy);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.teacher && course.teacher.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return b.progress - a.progress;
        case 'recent':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      case 'paused':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'active':
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'paused':
        return PauseCircle;
      case 'active':
      default:
        return PlayCircle;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'text-green-600 bg-green-50';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-50';
      case 'advanced':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const totalStats = {
    totalCourses: enrolledCourses.length,
    activeCourses: enrolledCourses.filter(c => c.status === 'active').length,
    completedCourses: enrolledCourses.filter(c => c.status === 'completed').length,
    totalProgress: enrolledCourses.length > 0 ? Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length) : 0,
    totalSkillTokens: enrolledCourses.reduce((sum, course) => sum + course.skillTokensEarned, 0),
    totalTimeSpent: enrolledCourses.reduce((sum, course) => sum + parseFloat(course.timeSpent), 0).toFixed(1),
    certificatesEligible: enrolledCourses.filter(c => c.certificateEligible).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BookOpen className="w-12 h-12 mx-auto text-blue-500 animate-bounce" />
          <p className="text-lg font-semibold mt-4">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <p className="text-lg font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">My Learning Journey</h1>
                <p className="text-blue-100">
                  Track your progress across all enrolled courses
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-blue-900">{totalStats.totalCourses}</p>
                <p className="text-xs text-blue-600 mt-1">{totalStats.activeCourses} active</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 text-sm font-medium">Average Progress</p>
                <p className="text-3xl font-bold text-green-900">{totalStats.totalProgress}%</p>
                <p className="text-xs text-green-600 mt-1">{totalStats.completedCourses} completed</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 text-sm font-medium">SkillTokens Earned</p>
                <p className="text-3xl font-bold text-purple-900">{totalStats.totalSkillTokens}</p>
                <p className="text-xs text-purple-600 mt-1">From {totalStats.completedCourses} courses</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-700 text-sm font-medium">Learning Time</p>
                <p className="text-3xl font-bold text-yellow-900">{totalStats.totalTimeSpent}h</p>
                <p className="text-xs text-yellow-600 mt-1">{totalStats.certificatesEligible} certificates ready</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-8 shadow-lg border-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search courses, instructors, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-3">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {[...new Set(enrolledCourses.map(c => c.category))].map(category => (
                    <SelectItem key={category} value={category.toLowerCase()}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="progress">Progress</SelectItem>
                  <SelectItem value="recent">Recently Accessed</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Course Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Courses ({enrolledCourses.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({enrolledCourses.filter(c => c.status === 'active').length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({enrolledCourses.filter(c => c.status === 'completed').length})</TabsTrigger>
            <TabsTrigger value="paused">Paused ({enrolledCourses.filter(c => c.status === 'paused').length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            <div className="grid gap-6">
              {getFilteredCourses().map((course) => {
                const StatusIcon = getStatusIcon(course.status);

                return (
                  <Card key={course._id} className="p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start space-x-6">
                      <img
                        src={course.thumbnail || 'https://via.placeholder.com/300x200'}
                        alt={course.title}
                        className="w-32 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                            <div className="flex items-center space-x-4 mb-3">
                              <span className="text-muted-foreground">by {course.teacher?.username || 'Unknown Instructor'}</span>
                              <Badge className={getDifficultyColor(course.level)}>
                                {course.level}
                              </Badge>
                              <Badge className={`${getStatusColor(course.status)} text-white`}>
                                {course.status}
                              </Badge>
                              {course.certificateEligible && (
                                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                                  <Trophy className="w-3 h-3 mr-1" />
                                  Certificate Ready
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span>{course.rating}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{course.students.length} students</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{course.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Last accessed {new Date(course.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary mb-1">{course.progress}%</div>
                            <div className="text-sm text-muted-foreground">Complete</div>
                          </div>
                        </div>

                        {/* Progress Section */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Course Progress</span>
                              <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                            </div>
                            <Progress value={course.progress} className="h-3" />
                          </div>

                          <div className="grid md:grid-cols-4 gap-6 text-sm">
                            <div>
                              <div className="text-muted-foreground">Time Spent</div>
                              <div className="font-semibold">{course.timeSpent}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Time Left</div>
                              <div className="font-semibold">{course.estimatedTimeLeft}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">SkillTokens Earned</div>
                              <div className="font-semibold flex items-center">
                                <Coins className="w-4 h-4 text-yellow-500 mr-1" />
                                {course.skillTokensEarned}/{course.skillTokenReward}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Next Lesson</div>
                              <div className="font-semibold">{course.nextLesson}</div>
                            </div>
                          </div>

                          {/* Action Buttons - Download section removed */}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex space-x-3">
                              <Button
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                disabled={course.status === 'completed'}
                                onClick={() => course.status !== 'completed' && navigate(`/course-study/${course._id}`)}
                              >
                                <StatusIcon className="w-4 h-4 mr-2" />
                                {course.status === 'completed' ? 'Completed' :
                                  course.status === 'paused' ? 'Resume' : 'Continue'}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => navigate(`/course-progress/${course._id}`)}
                              >
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Progress
                              </Button>
                              {course.status === 'completed' && (
                                <Button
                                  variant="outline"
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                  onClick={() => navigate(`/get-certificate/${course._id}`)}
                                >
                                  <Award className="w-4 h-4 mr-2" />
                                  Generate Certificate
                                </Button>
                              )}
                              {course.certificateEligible && course.status !== 'completed' && (
                                <Button
                                  variant="outline"
                                  className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                                  onClick={() => navigate(`/get-certificate/${course._id}`)}
                                >
                                  <Award className="w-4 h-4 mr-2" />
                                  Get Certificate
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {getFilteredCourses().length === 0 && (
              <Card className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Courses Found</h3>
                <p className="text-muted-foreground mb-4">
                  No courses match your current filters.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterBy('all');
                    setActiveTab('all');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}