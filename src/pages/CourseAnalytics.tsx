import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { courseAPI } from '@/lib/api';
import {
  ChevronLeft,
  TrendingUp,
  Users,
  DollarSign,
  Award,
  Star,
  Calendar,
  BarChart3,
  Download,
  Eye,
  Clock,
  Target,
  Activity,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function CourseAnalytics() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    const fetchCourseAnalytics = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching course analytics for courseId:', courseId);
        const data = await courseAPI.getCourseAnalytics(courseId);
        setAnalyticsData(data);
      } catch (err) {
        console.error('Error fetching course analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch course analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAnalytics();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Loading course analytics...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Course Analytics</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => navigate('/teacher-dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <Button onClick={() => navigate('/teacher-dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { course, overview, trends, students, feedback, performance } = analyticsData;

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/teacher-dashboard')}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
              {course.status}
            </Badge>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{course.title} - Analytics</h1>
              <p className="text-muted-foreground mt-2">Track your course performance and student engagement</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/course-management/${courseId}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Manage Course
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Students</p>
                <p className="text-xl font-bold">{overview.totalStudents}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="text-xl font-bold">{overview.completionRate}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-xl font-bold">{overview.averageRating}/5</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Earnings</p>
                <p className="text-xl font-bold">{overview.totalEarnings}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Certificates</p>
                <p className="text-xl font-bold">{overview.certificatesIssued}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tokens</p>
                <p className="text-xl font-bold">{overview.skillTokensDistributed}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Analytics */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Enrollment Trend */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Enrollment Trend
                </h3>
                <div className="space-y-4">
                  {trends.enrollment.map((data, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{data.period}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">{data.students} students</span>
                        <span className="text-sm text-primary font-medium">{data.revenue} ETH</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Module Completion */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Module Completion Rates
                </h3>
                <div className="space-y-4">
                  {trends.completion.map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">{data.module}</span>
                        <span className="text-sm font-medium">{data.completion}%</span>
                      </div>
                      <Progress value={data.completion} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Certificate issued to john.eth</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">New student enrolled: carol.eth</p>
                    <p className="text-sm text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">New 5-star review from sarah.eth</p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Student Performance</h3>
              <div className="space-y-4">
                {students.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">Last active: {student.lastActive}</p>
                        {student.certificateEarned && (
                          <Badge variant="outline" className="mt-1">
                            <Award className="w-3 h-3 mr-1" />
                            Certificate Earned
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={student.progress} className="w-20" />
                          <span className="text-sm font-medium">{student.progress}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Time Spent</p>
                        <p className="text-sm font-medium">{student.timeSpent}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span className="text-sm font-medium">{student.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Course Metrics</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Overall Completion Rate</span>
                      <span className="text-sm font-medium">{analyticsData.overview.completionRate}%</span>
                    </div>
                    <Progress value={analyticsData.overview.completionRate} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Student Satisfaction</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Certificate Success Rate</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Revenue Analysis</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Revenue</span>
                    <span className="font-medium">{overview.totalEarnings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee (5%)</span>
                    <span className="font-medium">{(parseFloat(overview.totalEarnings.split(' ')[0]) * 0.05).toFixed(2)} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Earnings</span>
                    <span className="font-medium text-primary">{(parseFloat(overview.totalEarnings.split(' ')[0]) * 0.95).toFixed(2)} ETH</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Average per Student</span>
                    <span className="font-medium">{overview.totalStudents > 0 ? (parseFloat(overview.totalEarnings.split(' ')[0]) / overview.totalStudents).toFixed(2) : '0'} ETH</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Student Feedback</h3>
              <div className="space-y-4">
                {feedback.map((feedbackItem, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{feedbackItem.student}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < feedbackItem.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{feedbackItem.date}</span>
                    </div>
                    <p className="text-muted-foreground">{feedbackItem.comment}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Performance Metrics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Engagement Rate</span>
                    <span className="font-medium">{performance.engagementRate}%</span>
                  </div>
                  <Progress value={performance.engagementRate} className="mb-4" />

                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Average Session Time</span>
                    <span className="font-medium">{performance.averageSessionTime}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Drop-off Rate</span>
                    <span className="font-medium">{performance.dropoffRate}%</span>
                  </div>
                  <Progress value={performance.dropoffRate} className="mb-4" />

                  <div>
                    <p className="text-sm font-medium mb-2">Peak Study Hours</p>
                    {performance.peakStudyHours.map((hour, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-1">
                        {hour}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
