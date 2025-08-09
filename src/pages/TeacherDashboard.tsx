import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import { useToast } from '@/hooks/use-toast';
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
  Star,
  Coins,
  Globe,
  MoreVertical,
  Play,
  Pause,
  Archive,
  Trash2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { getTeacherCourses, deleteCourse } = useCourses();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Get courses for the current teacher
  const courses = user?._id ? getTeacherCourses(user._id) : [];

  const handleDeleteCourse = (courseId, courseTitle) => {
    if (window.confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      deleteCourse(courseId);
      toast({
        title: "Course Deleted",
        description: `"${courseTitle}" has been permanently deleted.`,
      });
    }
  };

  const stats = [
    { icon: BookOpen, label: 'Active Courses', value: courses.filter(c => c.status === 'active').length.toString(), color: 'text-blue-600' },
    { icon: Users, label: 'Total Students', value: courses.reduce((sum, course) => sum + course.students, 0).toString(), color: 'text-green-600' },
    { icon: DollarSign, label: 'Earnings (ETH)', value: courses.reduce((sum, course) => sum + parseFloat(course.earnings.split(' ')[0]), 0).toFixed(1), color: 'text-primary' },
    { icon: Award, label: 'Certificates Issued', value: courses.reduce((sum, course) => sum + course.certificates, 0).toString(), color: 'text-purple-600' }
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
            Welcome back, {user?.username}! 📚
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your courses and track your teaching impact
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 hover:scale-105 transform transition-all duration-300 group border-0 bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors duration-300">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`} />
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
              <Card className="p-6 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transform transition-all duration-300 border-0 bg-gradient-to-br from-white to-primary/5">
                <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    className="gradient-primary h-16 flex-col space-y-2 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 hover:-translate-y-1 group"
                    onClick={() => navigate('/create-course')}
                  >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Create Course</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex-col space-y-2 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 hover:-translate-y-0.5 group"
                    onClick={() => navigate('/upload-content')}
                  >
                    <Upload className="w-5 h-5 group-hover:animate-bounce" />
                    <span>Upload Content</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex-col space-y-2 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 hover:-translate-y-0.5 group"
                    onClick={() => navigate('/issue-certificate')}
                  >
                    <Award className="w-5 h-5 group-hover:animate-pulse" />
                    <span>Issue Certificate</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex-col space-y-2 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 hover:-translate-y-0.5 group"
                    onClick={() => navigate('/teacher-analytics')}
                  >
                    <BarChart3 className="w-5 h-5 group-hover:animate-pulse" />
                    <span>View Analytics</span>
                  </Button>
                </div>
              </Card>

              {/* Pending Actions */}
              <Card className="p-6 hover:shadow-lg hover:shadow-secondary/10 hover:-translate-y-1 transform transition-all duration-300 border-0 bg-gradient-to-br from-white to-secondary/5">
                <h3 className="text-xl font-semibold mb-6">Pending Actions</h3>
                <div className="space-y-4">
                  {pendingActions.map((action, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md hover:shadow-primary/10 hover:scale-102 transform transition-all duration-300 group">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300">
                          {action.type === 'certificate' ? (
                            <Award className="w-5 h-5 text-primary group-hover:animate-pulse" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-primary group-hover:animate-pulse" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors duration-300">{action.message}</p>
                          <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">{action.course}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="gradient-primary hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 hover:-translate-y-0.5"
                      >
                        {action.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transform transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
              <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border-l-4 border-primary/20 bg-muted/30 rounded-r-lg hover:shadow-md hover:shadow-primary/10 hover:scale-102 hover:border-primary/40 transform transition-all duration-300 group">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300">
                      {activity.type === 'certificate' && <Award className="w-5 h-5 text-primary group-hover:animate-pulse" />}
                      {activity.type === 'enrollment' && <Users className="w-5 h-5 text-green-600 group-hover:animate-pulse" />}
                      {activity.type === 'review' && <Star className="w-5 h-5 text-yellow-600 group-hover:animate-pulse" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-primary transition-colors duration-300">{activity.message}</p>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">{activity.course}</p>
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold">My Courses</h3>
                <p className="text-muted-foreground">Manage and track your educational content</p>
              </div>
              <Button 
                className="gradient-primary hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 hover:-translate-y-1 group"
                onClick={() => navigate('/create-course')}
              >
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Create New Course
              </Button>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 hover:scale-105 transform transition-all duration-300 group border-0 bg-gradient-to-br from-blue-50 to-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                    <BookOpen className="w-5 h-5 text-blue-600 group-hover:animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Total Courses</p>
                    <p className="text-xl font-bold group-hover:text-blue-600 transition-colors duration-300">{courses.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-lg hover:shadow-green-500/20 hover:-translate-y-1 hover:scale-105 transform transition-all duration-300 group border-0 bg-gradient-to-br from-green-50 to-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
                    <Users className="w-5 h-5 text-green-600 group-hover:animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Total Students</p>
                    <p className="text-xl font-bold group-hover:text-green-600 transition-colors duration-300">{courses.reduce((sum, course) => sum + course.students, 0)}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 hover:scale-105 transform transition-all duration-300 group border-0 bg-gradient-to-br from-primary/5 to-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <DollarSign className="w-5 h-5 text-primary group-hover:animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Total Earnings</p>
                    <p className="text-xl font-bold group-hover:text-primary transition-colors duration-300">{courses.reduce((sum, course) => sum + parseFloat(course.earnings.split(' ')[0]), 0).toFixed(1)} ETH</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 hover:scale-105 transform transition-all duration-300 group border-0 bg-gradient-to-br from-purple-50 to-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 group-hover:scale-110 transition-all duration-300">
                    <Award className="w-5 h-5 text-purple-600 group-hover:animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Certificates</p>
                    <p className="text-xl font-bold group-hover:text-purple-600 transition-colors duration-300">{courses.reduce((sum, course) => sum + course.certificates, 0)}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Course Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 transform transition-all duration-300 group border-0 bg-gradient-to-br from-white to-gray-50">
                  <div className="relative overflow-hidden">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <Badge 
                        variant={course.status === 'active' ? 'default' : course.status === 'draft' ? 'secondary' : 'outline'}
                        className={`${
                          course.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 
                          course.status === 'draft' ? 'bg-yellow-500 hover:bg-yellow-600' : 
                          'bg-gray-500 hover:bg-gray-600'
                        } text-white capitalize group-hover:scale-110 transition-transform duration-300`}
                      >
                        {course.status}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90 hover:bg-white hover:scale-110 transform transition-all duration-300 group/btn">
                            <MoreVertical className="w-4 h-4 group-hover/btn:animate-pulse" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/course-management/${course.id}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Manage Course
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteCourse(course.id, course.title)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Course
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300">{course.title}</h4>
                        <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Updated {course.lastUpdated}</p>
                      </div>
                      
                      {/* Course Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:animate-pulse transition-all duration-300" />
                          <span className="group-hover:text-foreground transition-colors duration-300">{course.students} students</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-500 fill-current group-hover:animate-pulse" />
                          <span className="group-hover:text-foreground transition-colors duration-300">{course.rating} ({course.reviews})</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <BookOpen className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:animate-pulse transition-all duration-300" />
                          <span className="group-hover:text-foreground transition-colors duration-300">{course.modules} modules</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Award className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:animate-pulse transition-all duration-300" />
                          <span className="group-hover:text-foreground transition-colors duration-300">{course.certificates} certs</span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="group-hover:text-foreground transition-colors duration-300">Student Progress</span>
                          <span className="group-hover:text-primary transition-colors duration-300">{course.completion}% avg</span>
                        </div>
                        <Progress value={course.completion} className="h-2 group-hover:scale-105 transition-transform duration-300" />
                      </div>

                      {/* Earnings */}
                      <div className="flex items-center justify-between pt-2 border-t group-hover:border-primary/20 transition-colors duration-300">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-primary group-hover:animate-pulse" />
                            <span className="font-bold text-primary group-hover:text-primary/80 transition-colors duration-300">{course.earnings}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Coins className="w-4 h-4 text-yellow-500 group-hover:animate-pulse" />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">{course.skillTokens}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/course-preview/${course.id}`)}
                            title="Preview Course"
                            className="hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30 hover:scale-110 transform transition-all duration-300 group/btn"
                          >
                            <Eye className="w-4 h-4 group-hover/btn:animate-pulse" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/course-analytics/${course.id}`)}
                            title="View Analytics"
                            className="hover:bg-secondary hover:text-secondary-foreground hover:shadow-lg hover:shadow-secondary/30 hover:scale-110 transform transition-all duration-300 group/btn"
                          >
                            <BarChart3 className="w-4 h-4 group-hover/btn:animate-pulse" />
                          </Button>
                          <Button 
                            size="sm" 
                            className="gradient-primary hover:shadow-lg hover:shadow-primary/30 hover:scale-110 transform transition-all duration-300 group/btn"
                            onClick={() => navigate(`/course-settings/${course.id}`)}
                            title="Course Settings"
                          >
                            <Settings className="w-4 h-4 group-hover/btn:animate-spin" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Add New Course Card */}
              <Card 
                className="overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 hover:scale-105 transform transition-all duration-300 cursor-pointer group bg-gradient-to-br from-white to-primary/5"
                onClick={() => navigate('/create-course')}
              >
                <div className="h-full flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-125 transition-all duration-300">
                    <Plus className="w-8 h-8 text-primary group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-300">Create New Course</h4>
                  <p className="text-muted-foreground text-sm mb-4 group-hover:text-foreground transition-colors duration-300">
                    Start building your next blockchain course and mint NFT certificates
                  </p>
                  <Button className="gradient-primary hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 hover:-translate-y-0.5">
                    Get Started
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Certificate Management</h3>
              <Button 
                className="gradient-primary hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 hover:-translate-y-1 group"
                onClick={() => navigate('/issue-certificate')}
              >
                <Award className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                Issue Certificate
              </Button>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Certificate Templates */}
              <Card className="p-6 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transform transition-all duration-300 border-0 bg-gradient-to-br from-white to-primary/5">
                <h4 className="text-lg font-semibold mb-4">Certificate Templates</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md hover:shadow-primary/10 hover:scale-102 transform transition-all duration-300 group">
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors duration-300">Blockchain Fundamentals</p>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Basic completion certificate</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 group/btn"
                    >
                      <Edit className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                      Edit
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md hover:shadow-primary/10 hover:scale-102 transform transition-all duration-300 group">
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors duration-300">Advanced Smart Contracts</p>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Expert level certificate</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 group/btn"
                    >
                      <Edit className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Recent Certificates */}
              <Card className="p-6 hover:shadow-lg hover:shadow-secondary/10 hover:-translate-y-1 transform transition-all duration-300 border-0 bg-gradient-to-br from-white to-secondary/5">
                <h4 className="text-lg font-semibold mb-4">Recently Issued</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:shadow-md hover:shadow-primary/10 hover:scale-102 transform transition-all duration-300 group">
                    <Award className="w-8 h-8 text-primary group-hover:animate-pulse group-hover:rotate-12 transition-all duration-300" />
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-primary transition-colors duration-300">john.eth</p>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Blockchain Fundamentals</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors duration-300">NFT #001</p>
                      <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">2h ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:shadow-md hover:shadow-primary/10 hover:scale-102 transform transition-all duration-300 group">
                    <Award className="w-8 h-8 text-primary group-hover:animate-pulse group-hover:rotate-12 transition-all duration-300" />
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-primary transition-colors duration-300">sarah.eth</p>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Advanced Smart Contracts</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors duration-300">NFT #002</p>
                      <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">1d ago</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h3 className="text-2xl font-semibold">Teaching Analytics</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 text-center hover:shadow-lg hover:shadow-green-500/20 hover:-translate-y-1 hover:scale-105 transform transition-all duration-300 group border-0 bg-gradient-to-br from-green-50 to-white">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300" />
                <p className="text-2xl font-bold group-hover:text-green-600 transition-colors duration-300">324</p>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Total Enrollments</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 hover:scale-105 transform transition-all duration-300 group border-0 bg-gradient-to-br from-primary/5 to-white">
                <Award className="w-8 h-8 text-primary mx-auto mb-2 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300" />
                <p className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">156</p>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Certificates Issued</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-1 hover:scale-105 transform transition-all duration-300 group border-0 bg-gradient-to-br from-yellow-50 to-white">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300" />
                <p className="text-2xl font-bold group-hover:text-yellow-600 transition-colors duration-300">4.8</p>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Average Rating</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg hover:shadow-green-500/20 hover:-translate-y-1 hover:scale-105 transform transition-all duration-300 group border-0 bg-gradient-to-br from-green-50 to-white">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300" />
                <p className="text-2xl font-bold group-hover:text-green-600 transition-colors duration-300">12.4</p>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">ETH Earned</p>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-6 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transform transition-all duration-300 border-0 bg-gradient-to-br from-white to-primary/5">
                <h4 className="text-lg font-semibold mb-4">Monthly Earnings</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center hover:bg-primary/5 hover:scale-102 transform transition-all duration-300 p-2 rounded group">
                    <span className="group-hover:text-primary transition-colors duration-300">January 2024</span>
                    <span className="font-medium group-hover:text-primary transition-colors duration-300">3.2 ETH</span>
                  </div>
                  <div className="flex justify-between items-center hover:bg-primary/5 hover:scale-102 transform transition-all duration-300 p-2 rounded group">
                    <span className="group-hover:text-primary transition-colors duration-300">February 2024</span>
                    <span className="font-medium group-hover:text-primary transition-colors duration-300">4.1 ETH</span>
                  </div>
                  <div className="flex justify-between items-center hover:bg-primary/5 hover:scale-102 transform transition-all duration-300 p-2 rounded group">
                    <span className="group-hover:text-primary transition-colors duration-300">March 2024</span>
                    <span className="font-medium group-hover:text-primary transition-colors duration-300">5.1 ETH</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg hover:shadow-secondary/10 hover:-translate-y-1 transform transition-all duration-300 border-0 bg-gradient-to-br from-white to-secondary/5">
                <h4 className="text-lg font-semibold mb-4">Student Progress</h4>
                <div className="space-y-4">
                  <div className="space-y-2 hover:bg-secondary/5 p-3 rounded transition-all duration-300 group">
                    <div className="flex justify-between">
                      <span className="text-sm group-hover:text-foreground transition-colors duration-300">Course Completion Rate</span>
                      <span className="text-sm group-hover:text-primary transition-colors duration-300">78%</span>
                    </div>
                    <Progress value={78} className="group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="space-y-2 hover:bg-secondary/5 p-3 rounded transition-all duration-300 group">
                    <div className="flex justify-between">
                      <span className="text-sm group-hover:text-foreground transition-colors duration-300">Student Satisfaction</span>
                      <span className="text-sm group-hover:text-primary transition-colors duration-300">92%</span>
                    </div>
                    <Progress value={92} className="group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="space-y-2 hover:bg-secondary/5 p-3 rounded transition-all duration-300 group">
                    <div className="flex justify-between">
                      <span className="text-sm group-hover:text-foreground transition-colors duration-300">Certificate Success Rate</span>
                      <span className="text-sm group-hover:text-primary transition-colors duration-300">85%</span>
                    </div>
                    <Progress value={85} className="group-hover:scale-105 transition-transform duration-300" />
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