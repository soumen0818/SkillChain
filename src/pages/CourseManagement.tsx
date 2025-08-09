import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCourses } from '@/contexts/CourseContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronLeft,
  Edit,
  BarChart3,
  Settings,
  Users,
  PlayCircle,
  BookOpen,
  Calendar,
  DollarSign,
  Star,
  MessageSquare,
  Award,
  ExternalLink,
  Eye,
  Clock,
  Target
} from 'lucide-react';

export default function CourseManagement() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { getCourseById } = useCourses();
  const { toast } = useToast();
  
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (courseId) {
      const courseData = getCourseById(courseId);
      if (courseData) {
        setCourse(courseData);
      } else {
        toast({
          title: "Course Not Found",
          description: "The course you're trying to manage doesn't exist.",
          variant: "destructive"
        });
        navigate('/teacher-dashboard');
      }
    }
  }, [courseId, getCourseById, navigate, toast]);

  if (!course) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading course management...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const courseStats = {
    totalStudents: 127,
    completionRate: 78,
    avgRating: 4.6,
    totalRevenue: 12750,
    thisWeekEnrollments: 23,
    recentActivity: [
      { type: 'enrollment', count: 5, time: '2 hours ago' },
      { type: 'completion', count: 3, time: '4 hours ago' },
      { type: 'review', count: 2, time: '1 day ago' }
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
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
              <p className="text-muted-foreground mt-2">{course.description}</p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{courseStats.avgRating}</span>
                  <span className="text-sm text-muted-foreground">({courseStats.totalStudents} students)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Created {new Date(course.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => navigate(`/course-preview/${courseId}`)}
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={() => navigate(`/edit-course/${courseId}`)}
                variant="outline"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Course
              </Button>
              <Button 
                onClick={() => navigate(`/course-analytics/${courseId}`)}
                variant="outline"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button 
                onClick={() => navigate(`/course-settings/${courseId}`)}
                variant="outline"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courseStats.totalStudents}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-xs text-green-600">+{courseStats.thisWeekEnrollments} this week</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courseStats.completionRate}%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <Progress value={courseStats.completionRate} className="mt-2 h-2" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courseStats.avgRating}</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-3 h-3 ${
                        star <= Math.floor(courseStats.avgRating) 
                          ? 'text-yellow-500 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${courseStats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xs text-green-600">+12% from last month</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Content Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Course Content
              </h2>
              <div className="space-y-4">
                {course.curriculum?.map((section, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{section.title}</h3>
                      <Badge variant="outline">{section.lessons?.length || 0} lessons</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{section.description}</p>
                    <div className="space-y-2">
                      {section.lessons?.slice(0, 3).map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="flex items-center space-x-2 text-sm">
                          <PlayCircle className="w-4 h-4 text-muted-foreground" />
                          <span>{lesson.title}</span>
                          <span className="text-muted-foreground">({lesson.duration})</span>
                        </div>
                      ))}
                      {section.lessons?.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{section.lessons.length - 3} more lessons
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Recent Student Activity
              </h2>
              <div className="space-y-4">
                {courseStats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'enrollment' ? 'bg-blue-100' :
                        activity.type === 'completion' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        {activity.type === 'enrollment' && <Users className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'completion' && <Award className="w-4 h-4 text-green-600" />}
                        {activity.type === 'review' && <Star className="w-4 h-4 text-yellow-600" />}
                      </div>
                      <div>
                        <p className="font-medium">
                          {activity.count} new {activity.type}{activity.count > 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate(`/edit-course/${courseId}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Course Content
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate(`/course-analytics/${courseId}`)}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/student-management')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Students
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate(`/course-settings/${courseId}`)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Course Settings
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Course Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p className="font-medium">{course.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
                  <Badge variant="outline">{course.difficulty}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price</p>
                  <p className="font-medium text-green-600">${course.price}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prerequisites</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {course.prerequisites?.map((prereq, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {prereq}
                      </Badge>
                    )) || <p className="text-sm text-muted-foreground">None</p>}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Skills You'll Learn</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {course.skills?.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {course.skills?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{course.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Blockchain Integration</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">NFT Certificates</span>
                  <Badge variant="outline" className="text-green-600">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SkillToken Rewards</span>
                  <Badge variant="outline" className="text-blue-600">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Marketplace Trading</span>
                  <Badge variant="outline" className="text-purple-600">Available</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Blockchain Details
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
