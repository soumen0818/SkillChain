import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCourses } from '@/contexts/CourseContext';
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
  Activity
} from 'lucide-react';

export default function CourseAnalytics() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { getCourseById } = useCourses();
  const [course, setCourse] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    if (courseId) {
      const courseData = getCourseById(courseId);
      setCourse(courseData);
    }
  }, [courseId, getCourseById]);

  if (!course) {
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

  // Mock analytics data - in real app, this would be fetched from API
  const analyticsData = {
    overview: {
      totalStudents: course.students || 0,
      completionRate: course.completion || 0,
      averageRating: course.rating || 0,
      totalEarnings: course.earnings || '0 ETH',
      certificatesIssued: course.certificates || 0,
      skillTokensDistributed: course.skillTokens || '0 SKILL'
    },
    trends: {
      enrollment: [
        { period: 'Week 1', students: 12, revenue: 1.2 },
        { period: 'Week 2', students: 18, revenue: 1.8 },
        { period: 'Week 3', students: 25, revenue: 2.5 },
        { period: 'Week 4', students: 45, revenue: 4.5 }
      ],
      completion: [
        { module: 'Module 1', completion: 95 },
        { module: 'Module 2', completion: 88 },
        { module: 'Module 3', completion: 82 },
        { module: 'Module 4', completion: 76 },
        { module: 'Module 5', completion: 70 }
      ]
    },
    students: [
      { name: 'john.eth', progress: 95, timeSpent: '24h', lastActive: '2h ago', rating: 5 },
      { name: 'sarah.eth', progress: 88, timeSpent: '22h', lastActive: '1d ago', rating: 5 },
      { name: 'mike.eth', progress: 76, timeSpent: '18h', lastActive: '3d ago', rating: 4 },
      { name: 'alice.eth', progress: 82, timeSpent: '20h', lastActive: '1d ago', rating: 5 },
      { name: 'bob.eth', progress: 92, timeSpent: '26h', lastActive: '5h ago', rating: 4 }
    ],
    feedback: [
      { student: 'john.eth', rating: 5, comment: 'Excellent course! Very detailed and practical.', date: '2 days ago' },
      { student: 'sarah.eth', rating: 5, comment: 'Great content and well-structured modules.', date: '1 week ago' },
      { student: 'mike.eth', rating: 4, comment: 'Good course, but could use more examples.', date: '2 weeks ago' }
    ]
  };

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
                <p className="text-xl font-bold">{analyticsData.overview.totalStudents}</p>
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
                <p className="text-xl font-bold">{analyticsData.overview.completionRate}%</p>
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
                <p className="text-xl font-bold">{analyticsData.overview.averageRating}/5</p>
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
                <p className="text-xl font-bold">{analyticsData.overview.totalEarnings}</p>
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
                <p className="text-xl font-bold">{analyticsData.overview.certificatesIssued}</p>
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
                <p className="text-xl font-bold">{analyticsData.overview.skillTokensDistributed}</p>
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
                  {analyticsData.trends.enrollment.map((data, index) => (
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
                  {analyticsData.trends.completion.map((data, index) => (
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
                {analyticsData.students.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">Last active: {student.lastActive}</p>
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
                    <span className="font-medium">{analyticsData.overview.totalEarnings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span className="font-medium">0.2 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Earnings</span>
                    <span className="font-medium text-primary">3.8 ETH</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Average per Student</span>
                    <span className="font-medium">0.1 ETH</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Student Feedback</h3>
              <div className="space-y-4">
                {analyticsData.feedback.map((feedback, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{feedback.student}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{feedback.date}</span>
                    </div>
                    <p className="text-muted-foreground">{feedback.comment}</p>
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
