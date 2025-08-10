import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { courseAPI } from '@/lib/api';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  DollarSign,
  Award,
  Star,
  Clock,
  Eye,
  PlayCircle,
  Calendar,
  Target,
  Coins,
  Globe,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  CheckCircle,
  AlertCircle,
  Download,
  Filter,
  Search,
  RefreshCw,
  Zap,
  Trophy,
  Crown,
  Gem,
  Loader2
} from 'lucide-react';

interface AnalyticsData {
  totalCourses: number;
  activeCourses: number;
  draftCourses: number;
  totalStudents: number;
  totalEarnings: number;
  totalCertificates: number;
  averageRating: number;
  totalReviews: number;
  monthlyData: MonthlyData[];
  coursePerformance: CoursePerformance[];
  studentEngagement: StudentEngagement;
  revenueBreakdown: RevenueBreakdown;
  studentDetails: CourseStudentDetails[];
}

interface MonthlyData {
  month: string;
  earnings: number;
  students: number;
  certificates: number;
  courses: number;
}

interface CoursePerformance {
  id: string;
  title: string;
  thumbnail: string;
  status: string;
  students: number;
  completion: number;
  rating: number;
  earnings: number;
  certificates: number;
  enrollmentTrend: string;
  lastActivity: string;
  category: string;
}

interface CourseStudentDetails {
  courseId: string;
  courseTitle: string;
  students: StudentDetails[];
}

interface StudentDetails {
  id: string;
  username: string;
  email: string;
  enrolledAt: string;
  progress: number;
  lastActivity: string;
  certificateEarned: boolean;
}

interface StudentEngagement {
  totalWatchTime: string;
  averageSessionTime: string;
  completionRate: number;
  dropoffPoints: string[];
  peakHours: string[];
  deviceBreakdown: { desktop: number; mobile: number; tablet: number };
}

interface RevenueBreakdown {
  courseRevenue: number;
  platformFees: number;
  skillTokenRewards: number;
  projectedAnnual: number;
}

export default function TeacherAnalytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching analytics data...');
        const data = await courseAPI.getTeacherAnalytics();
        console.log('Analytics data received:', data);
        setAnalyticsData(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        console.error('Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined
        });
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Loading analytics...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Analytics</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  const getGrowthIndicator = (value: string) => {
    const isPositive = value.startsWith('+');
    return isPositive ? (
      <div className="flex items-center text-green-600">
        <TrendingUp className="w-4 h-4 mr-1" />
        <span className="text-sm font-medium">{value}</span>
      </div>
    ) : (
      <div className="flex items-center text-red-600">
        <TrendingDown className="w-4 h-4 mr-1" />
        <span className="text-sm font-medium">{value}</span>
      </div>
    );
  };

  const getPerformanceColor = (value: number, type: 'rating' | 'completion' | 'growth') => {
    if (type === 'rating') {
      return value >= 4.5 ? 'text-green-600' : value >= 4.0 ? 'text-yellow-600' : 'text-red-600';
    }
    if (type === 'completion') {
      return value >= 80 ? 'text-green-600' : value >= 60 ? 'text-yellow-600' : 'text-red-600';
    }
    return 'text-blue-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-12">
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Teaching Analytics</h1>
                  <p className="text-blue-100">
                    Comprehensive insights into your course performance and student engagement
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-blue-900">{analyticsData.totalCourses}</p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">{analyticsData.activeCourses} active</span>
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-green-900">{analyticsData.totalStudents}</p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-blue-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-sm">Across all courses</span>
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 text-sm font-medium">Total Earnings</p>
                <p className="text-3xl font-bold text-purple-900">{analyticsData.totalEarnings.toFixed(1)} ETH</p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-green-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="text-sm">Revenue generated</span>
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-700 text-sm font-medium">Certificates Issued</p>
                <p className="text-3xl font-bold text-yellow-900">{analyticsData.totalCertificates}</p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-blue-600">
                    <Award className="w-4 h-4 mr-1" />
                    <span className="text-sm">Achievements earned</span>
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Analytics Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Course Performance</TabsTrigger>
            <TabsTrigger value="students">Student Analytics</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Performance Summary */}
              <Card className="p-6 shadow-lg border-0">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Performance Summary
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{analyticsData.averageRating.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">Average Rating</div>
                      <div className="flex items-center justify-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(analyticsData.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{analyticsData.activeCourses}</div>
                      <div className="text-sm text-muted-foreground">Active Courses</div>
                      <div className="text-xs text-green-600 mt-1">
                        {((analyticsData.activeCourses / analyticsData.totalCourses) * 100).toFixed(0)}% of total
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Course Completion Rate</span>
                      <span className="text-sm font-bold">{analyticsData.studentEngagement.completionRate}%</span>
                    </div>
                    <Progress value={analyticsData.studentEngagement.completionRate} className="h-3" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Course Utilization</span>
                      <span className="text-sm font-bold">{Math.round((analyticsData.activeCourses / analyticsData.totalCourses) * 100)}%</span>
                    </div>
                    <Progress value={(analyticsData.activeCourses / analyticsData.totalCourses) * 100} className="h-3" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Student Engagement</span>
                      <span className="text-sm font-bold">{analyticsData.totalStudents > 0 ? Math.round((analyticsData.totalCertificates / analyticsData.totalStudents) * 100) : 0}%</span>
                    </div>
                    <Progress value={analyticsData.totalStudents > 0 ? (analyticsData.totalCertificates / analyticsData.totalStudents) * 100 : 0} className="h-3" />
                  </div>
                </div>
              </Card>

              {/* Monthly Trends */}
              <Card className="p-6 shadow-lg border-0">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <LineChart className="w-5 h-5 mr-2 text-blue-600" />
                  Monthly Trends
                </h3>
                <div className="space-y-4">
                  {analyticsData.monthlyData.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{month.month} 2024</div>
                          <div className="text-sm text-muted-foreground">{month.students} students</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{month.earnings} ETH</div>
                        <div className="text-sm text-muted-foreground">{month.certificates} certificates</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 shadow-lg border-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Total Watch Time</h4>
                <p className="text-2xl font-bold text-blue-600">{analyticsData.studentEngagement.totalWatchTime}</p>
                <p className="text-sm text-muted-foreground">Across all courses</p>
              </Card>

              <Card className="p-6 shadow-lg border-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Completion Rate</h4>
                <p className="text-2xl font-bold text-green-600">{analyticsData.studentEngagement.completionRate}%</p>
                <p className="text-sm text-muted-foreground">Average across courses</p>
              </Card>

              <Card className="p-6 shadow-lg border-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">SkillTokens Earned</h4>
                <p className="text-2xl font-bold text-purple-600">{analyticsData.revenueBreakdown.skillTokenRewards.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total rewards</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Course Performance Analysis</h3>
              <div className="flex space-x-3">
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Metrics</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="completion">Completion Rate</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="earnings">Earnings</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {analyticsData.coursePerformance.map((course) => (
                <Card key={course.id} className="p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-6">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold mb-2">{course.title}</h4>
                          <div className="flex items-center space-x-4">
                            <Badge
                              variant={course.status === 'active' ? 'default' : 'secondary'}
                              className={course.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}
                            >
                              {course.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{course.category}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{course.earnings} ETH</div>
                          <div className="text-sm text-muted-foreground">Total earnings</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600">{course.students}</div>
                          <div className="text-sm text-muted-foreground">Students</div>
                          {getGrowthIndicator(course.enrollmentTrend)}
                        </div>
                        <div className="text-center">
                          <div className={`text-xl font-bold ${getPerformanceColor(course.completion, 'completion')}`}>
                            {course.completion}%
                          </div>
                          <div className="text-sm text-muted-foreground">Completion</div>
                          <Progress value={course.completion} className="h-2 mt-1" />
                        </div>
                        <div className="text-center">
                          <div className={`text-xl font-bold ${getPerformanceColor(course.rating, 'rating')}`}>
                            {course.rating}
                          </div>
                          <div className="text-sm text-muted-foreground">Rating</div>
                          <div className="flex items-center justify-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(course.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-purple-600">{course.certificates}</div>
                          <div className="text-sm text-muted-foreground">Certificates</div>
                          <div className="text-xs text-muted-foreground mt-1">Last: {course.lastActivity}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <h3 className="text-2xl font-semibold">Student Engagement Analytics</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 shadow-lg border-0">
                <h4 className="font-semibold mb-4 flex items-center">
                  <PlayCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Watch Time Analytics
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Watch Time</span>
                    <span className="font-medium">{analyticsData.studentEngagement.totalWatchTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Session</span>
                    <span className="font-medium">{analyticsData.studentEngagement.averageSessionTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">{analyticsData.studentEngagement.completionRate}%</span>
                  </div>
                  <Progress value={analyticsData.studentEngagement.completionRate} className="h-3" />
                </div>
              </Card>

              <Card className="p-6 shadow-lg border-0">
                <h4 className="font-semibold mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-green-600" />
                  Device Breakdown
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Desktop</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${analyticsData.studentEngagement.deviceBreakdown.desktop}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{analyticsData.studentEngagement.deviceBreakdown.desktop}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mobile</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${analyticsData.studentEngagement.deviceBreakdown.mobile}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{analyticsData.studentEngagement.deviceBreakdown.mobile}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tablet</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${analyticsData.studentEngagement.deviceBreakdown.tablet}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{analyticsData.studentEngagement.deviceBreakdown.tablet}%</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-lg border-0">
                <h4 className="font-semibold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-600" />
                  Peak Learning Hours
                </h4>
                <div className="space-y-3">
                  {analyticsData.studentEngagement.peakHours.map((hour, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">{hour}</span>
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-purple-600">High Activity</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Drop-off Analysis */}
            <Card className="p-6 shadow-lg border-0">
              <h4 className="font-semibold mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                Common Drop-off Points
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {analyticsData.studentEngagement.dropoffPoints.map((point, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-100">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-red-900">{point}</p>
                      <p className="text-sm text-red-600">Consider reviewing this section</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Student Details */}
            {analyticsData.studentDetails && analyticsData.studentDetails.length > 0 && (
              <Card className="p-6 shadow-lg border-0">
                <h4 className="font-semibold mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Student Enrollment Details
                </h4>
                <div className="space-y-6">
                  {analyticsData.studentDetails.map((courseDetails) => (
                    courseDetails.students && courseDetails.students.length > 0 && (
                      <div key={courseDetails.courseId} className="border-l-4 border-blue-500 pl-4">
                        <h5 className="font-medium text-lg mb-3">{courseDetails.courseTitle}</h5>
                        <div className="grid gap-3">
                          {courseDetails.students.slice(0, 5).map((student) => (
                            <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-semibold text-sm">
                                    {student.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium">{student.username}</p>
                                  <p className="text-sm text-muted-foreground">{student.email}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center space-x-2">
                                  <Progress value={student.progress || 0} className="w-16 h-2" />
                                  <span className="text-sm font-medium">{student.progress || 0}%</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Enrolled: {new Date(student.enrolledAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                          {courseDetails.students.length > 5 && (
                            <div className="text-center p-2">
                              <span className="text-sm text-muted-foreground">
                                and {courseDetails.students.length - 5} more students...
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <h3 className="text-2xl font-semibold">Revenue & Financial Insights</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm font-medium">Course Revenue</p>
                    <p className="text-2xl font-bold text-green-900">
                      {analyticsData.revenueBreakdown.courseRevenue.toFixed(1)} ETH
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </Card>

              <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-700 text-sm font-medium">Platform Fees</p>
                    <p className="text-2xl font-bold text-red-900">
                      {analyticsData.revenueBreakdown.platformFees.toFixed(1)} ETH
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-red-600" />
                </div>
              </Card>

              <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-yellow-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-700 text-sm font-medium">SkillToken Rewards</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {analyticsData.revenueBreakdown.skillTokenRewards}
                    </p>
                  </div>
                  <Coins className="w-8 h-8 text-yellow-600" />
                </div>
              </Card>

              <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-medium">Projected Annual</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {analyticsData.revenueBreakdown.projectedAnnual.toFixed(1)} ETH
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </Card>
            </div>

            {/* Revenue Breakdown Chart */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-6 shadow-lg border-0">
                <h4 className="font-semibold mb-6">Revenue by Course Category</h4>
                <div className="space-y-4">
                  {[
                    { category: 'Blockchain Fundamentals', revenue: 3.2, percentage: 35 },
                    { category: 'Smart Contracts', revenue: 2.8, percentage: 30 },
                    { category: 'DeFi Protocols', revenue: 1.9, percentage: 20 },
                    { category: 'NFT Development', revenue: 1.4, percentage: 15 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm font-bold">{item.revenue} ETH ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 shadow-lg border-0">
                <h4 className="font-semibold mb-6">Monthly Revenue Trend</h4>
                <div className="space-y-4">
                  {analyticsData.monthlyData.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold text-xs">{month.month}</span>
                        </div>
                        <span className="font-medium">{month.month} 2024</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{month.earnings} ETH</div>
                        <div className="text-xs text-muted-foreground">
                          {index > 0 && (
                            <span className={month.earnings > analyticsData.monthlyData[index - 1].earnings ? 'text-green-600' : 'text-red-600'}>
                              {month.earnings > analyticsData.monthlyData[index - 1].earnings ? '+' : ''}
                              {((month.earnings - analyticsData.monthlyData[index - 1].earnings) / analyticsData.monthlyData[index - 1].earnings * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
