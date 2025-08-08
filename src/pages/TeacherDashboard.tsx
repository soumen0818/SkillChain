import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Edit,
  Eye,
  BarChart3,
  Award,
  MessageSquare,
  Calendar,
  Settings,
  Upload,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { icon: BookOpen, label: 'Active Courses', value: '8', color: 'text-blue-600' },
    { icon: Users, label: 'Total Students', value: '324', color: 'text-green-600' },
    { icon: DollarSign, label: 'Earnings (ETH)', value: '12.4', color: 'text-primary' },
    { icon: Award, label: 'Certificates Issued', value: '156', color: 'text-purple-600' }
  ];

  const courses = [
    {
      id: 1,
      title: 'Blockchain Fundamentals',
      students: 45,
      progress: 75,
      earnings: '2.3 ETH',
      status: 'active',
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1518896012122-3dcff33c6334?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Advanced Smart Contracts',
      students: 32,
      progress: 60,
      earnings: '1.8 ETH',
      status: 'active',
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'DeFi Protocol Development',
      students: 28,
      progress: 40,
      earnings: '1.2 ETH',
      status: 'draft',
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=200&fit=crop'
    }
  ];

  const recentActivity = [
    {
      type: 'certificate',
      message: 'Certificate issued to john.eth',
      course: 'Blockchain Fundamentals',
      time: '2h ago'
    },
    {
      type: 'enrollment',
      message: 'New student enrolled',
      course: 'Advanced Smart Contracts',
      time: '4h ago'
    },
    {
      type: 'review',
      message: 'New 5-star review received',
      course: 'DeFi Protocol Development',
      time: '1d ago'
    }
  ];

  const pendingActions = [
    {
      type: 'certificate',
      message: 'Certificate request from sarah.eth',
      course: 'Blockchain Fundamentals',
      action: 'Review & Issue'
    },
    {
      type: 'submission',
      message: '3 assignments awaiting review',
      course: 'Advanced Smart Contracts',
      action: 'Review'
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name}! 📚
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your courses and track your teaching impact
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-elevation animate-smooth">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="gradient-primary h-16 flex-col space-y-2">
                    <Plus className="w-5 h-5" />
                    <span>Create Course</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-2">
                    <Upload className="w-5 h-5" />
                    <span>Upload Content</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-2">
                    <Award className="w-5 h-5" />
                    <span>Issue Certificate</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>View Analytics</span>
                  </Button>
                </div>
              </Card>

              {/* Pending Actions */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6">Pending Actions</h3>
                <div className="space-y-4">
                  {pendingActions.map((action, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          {action.type === 'certificate' ? (
                            <Award className="w-5 h-5 text-primary" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{action.message}</p>
                          <p className="text-sm text-muted-foreground">{action.course}</p>
                        </div>
                      </div>
                      <Button size="sm" className="gradient-primary">
                        {action.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border-l-4 border-primary/20 bg-muted/30 rounded-r-lg">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      {activity.type === 'certificate' && <Award className="w-5 h-5 text-primary" />}
                      {activity.type === 'enrollment' && <Users className="w-5 h-5 text-green-600" />}
                      {activity.type === 'review' && <Star className="w-5 h-5 text-yellow-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-muted-foreground">{activity.course}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">My Courses</h3>
              <Button className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create New Course
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-elevation animate-smooth">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{course.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${
                        course.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{course.students} students</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Course Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{course.earnings}</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="gradient-primary">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Certificate Management</h3>
              <Button className="gradient-primary">
                <Award className="w-4 h-4 mr-2" />
                Issue Certificate
              </Button>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Certificate Templates */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">Certificate Templates</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">Blockchain Fundamentals</p>
                      <p className="text-sm text-muted-foreground">Basic completion certificate</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">Advanced Smart Contracts</p>
                      <p className="text-sm text-muted-foreground">Expert level certificate</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Recent Certificates */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">Recently Issued</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                    <Award className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">john.eth</p>
                      <p className="text-sm text-muted-foreground">Blockchain Fundamentals</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">NFT #001</p>
                      <p className="text-xs text-muted-foreground">2h ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                    <Award className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">sarah.eth</p>
                      <p className="text-sm text-muted-foreground">Advanced Smart Contracts</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">NFT #002</p>
                      <p className="text-xs text-muted-foreground">1d ago</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h3 className="text-2xl font-semibold">Teaching Analytics</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">324</p>
                <p className="text-sm text-muted-foreground">Total Enrollments</p>
              </Card>
              <Card className="p-6 text-center">
                <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Certificates Issued</p>
              </Card>
              <Card className="p-6 text-center">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </Card>
              <Card className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">12.4</p>
                <p className="text-sm text-muted-foreground">ETH Earned</p>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">Monthly Earnings</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>January 2024</span>
                    <span className="font-medium">3.2 ETH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>February 2024</span>
                    <span className="font-medium">4.1 ETH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>March 2024</span>
                    <span className="font-medium">5.1 ETH</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">Student Progress</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Course Completion Rate</span>
                      <span className="text-sm">78%</span>
                    </div>
                    <Progress value={78} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Student Satisfaction</span>
                      <span className="text-sm">92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Certificate Success Rate</span>
                      <span className="text-sm">85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}