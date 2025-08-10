import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Target,
  FileVideo,
  FileText,
  Download,
  ChevronRight,
  Loader2,
  Video,
  File
} from 'lucide-react';

export default function CourseManagement() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { getCourseById, loading } = useCourses();
  const { toast } = useToast();
  
  const [course, setCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);

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

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    setModuleDialogOpen(true);
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video':
        return FileVideo;
      case 'document':
        return FileText;
      default:
        return File;
    }
  };

  const getFileType = (url) => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop()?.toLowerCase();
    if (['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(extension)) return 'video';
    if (['pdf'].includes(extension)) return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'document';
    if (['ppt', 'pptx'].includes(extension)) return 'presentation';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
    return 'file';
  };

  if (loading || !course) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading course management...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate real course stats from the course data
  const courseStats = {
    totalStudents: course?.students || 0,
    completionRate: course?.completion || 0,
    avgRating: course?.rating || 0,
    totalRevenue: parseInt(course?.price || '0') * (course?.students || 0),
    thisWeekEnrollments: Math.floor(Math.random() * 20) + 5, // Mock data for demo
    totalModules: course?.syllabus?.length || 0,
    totalLessons: course?.syllabus?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0,
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Course Content
                </h2>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="text-sm">
                    {courseStats.totalModules} Modules
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {courseStats.totalLessons} Lessons
                  </Badge>
                </div>
              </div>

              {course.syllabus && course.syllabus.length > 0 ? (
                <div className="space-y-4">
                  {course.syllabus.map((module, index) => (
                    <div key={module._id || index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-indigo-600">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {module.lessons?.length || 0} lesson{(module.lessons?.length || 0) !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleModuleClick(module)}
                          className="flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                      
                      <div className="space-y-2">
                        {module.lessons?.slice(0, 3).map((lesson, lessonIndex) => {
                          const LessonIcon = getLessonIcon(lesson.type);
                          return (
                            <div key={lesson._id || lessonIndex} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer group">
                              <LessonIcon className="w-4 h-4 text-muted-foreground" />
                              <div className="flex-1">
                                <span className="text-sm font-medium">{lesson.title}</span>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {lesson.type}
                                  </Badge>
                                  {lesson.duration && (
                                    <span className="text-xs text-muted-foreground">
                                      {lesson.duration}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {/* Quick action buttons */}
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                                {lesson.type === 'video' && lesson.videoUrl && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Open video in a new window for quick preview
                                      const videoWindow = window.open('', '_blank', 'width=800,height=600');
                                      videoWindow.document.write(`
                                        <html>
                                          <head><title>${lesson.title}</title></head>
                                          <body style="margin:0; padding:20px; background:#000;">
                                            <video controls autoplay style="width:100%; height:auto;">
                                              <source src="${lesson.videoUrl}" type="video/mp4">
                                            </video>
                                          </body>
                                        </html>
                                      `);
                                    }}
                                    className="h-6 w-6 p-1"
                                  >
                                    <PlayCircle className="w-3 h-3" />
                                  </Button>
                                )}
                                {lesson.type === 'document' && lesson.documentUrl && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(lesson.documentUrl, '_blank');
                                    }}
                                    className="h-6 w-6 p-1"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {module.lessons?.length > 3 && (
                          <div className="text-center py-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleModuleClick(module)}
                              className="text-xs text-muted-foreground"
                            >
                              +{module.lessons.length - 3} more lessons - View all
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Added Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start building your course by adding modules and lessons.
                  </p>
                  <Button 
                    onClick={() => navigate('/upload-content')}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Add Course Content
                  </Button>
                </div>
              )}
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
                  onClick={() => navigate('/upload-content')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Add Course Content
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate(`/edit-course/${courseId}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Course Details
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
                  <p className="text-sm font-medium text-muted-foreground">Level</p>
                  <Badge variant="outline">{course.level}</Badge>
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
                  <p className="text-sm font-medium text-muted-foreground">Learning Outcomes</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {course.learningOutcomes?.slice(0, 3).map((outcome, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {outcome}
                      </Badge>
                    ))}
                    {course.learningOutcomes?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{course.learningOutcomes.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Teacher</p>
                  <p className="font-medium">{course.teacher?.username || 'Unknown'}</p>
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
                  <Badge variant="outline" className="text-blue-600">
                    {course.skillTokenReward} tokens
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Marketplace Trading</span>
                  <Badge variant="outline" className="text-purple-600">Available</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Course Status</span>
                  <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                    {course.status}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Blockchain Details
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Module Details Dialog */}
        <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] w-[95vw]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Module Details: {selectedModule?.title}</span>
              </DialogTitle>
            </DialogHeader>
            
            {selectedModule && (
              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-6">
                  {/* Module Overview */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">{selectedModule.title}</h3>
                    <p className="text-gray-700 mb-4">{selectedModule.description}</p>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{selectedModule.lessons?.length || 0} Lessons</span>
                      </Badge>
                      {selectedModule.duration && (
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{selectedModule.duration}</span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Lessons List */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                      <PlayCircle className="w-5 h-5 mr-2" />
                      Lessons in this Module
                    </h4>
                    
                    {selectedModule.lessons && selectedModule.lessons.length > 0 ? (
                      <div className="space-y-4">
                        {selectedModule.lessons.map((lesson, index) => {
                          const LessonIcon = getLessonIcon(lesson.type);
                          return (
                            <Card key={lesson._id || index} className="p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <LessonIcon className="w-5 h-5 text-indigo-600" />
                                  </div>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="text-lg font-medium text-gray-900">
                                      {index + 1}. {lesson.title}
                                    </h5>
                                    <div className="flex items-center space-x-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {lesson.type}
                                      </Badge>
                                      {lesson.duration && (
                                        <Badge variant="outline" className="text-xs">
                                          {lesson.duration}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>

                                  {/* Lesson Content Info */}
                                  <div className="space-y-3">
                                    {lesson.type === 'video' && lesson.videoUrl && (
                                      <div className="space-y-3">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                          <Video className="w-4 h-4" />
                                          <span>Video content available</span>
                                        </div>
                                        {/* Video Player */}
                                        <div className="bg-black rounded-lg overflow-hidden relative">
                                          <video
                                            className="w-full h-80 object-cover"
                                            controls
                                            preload="metadata"
                                            poster="/placeholder.svg"
                                            onLoadStart={() => {
                                              // You can add loading state here if needed
                                            }}
                                            onError={(e) => {
                                              console.error('Video failed to load:', e);
                                              toast({
                                                title: "Video Error",
                                                description: "Failed to load video content",
                                                variant: "destructive"
                                              });
                                            }}
                                          >
                                            <source src={lesson.videoUrl} type="video/mp4" />
                                            <source src={lesson.videoUrl} type="video/webm" />
                                            <source src={lesson.videoUrl} type="video/ogg" />
                                            Your browser does not support the video tag.
                                          </video>
                                          {/* Video overlay with lesson info */}
                                          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                            {lesson.title}
                                          </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => window.open(lesson.videoUrl, '_blank')}
                                          >
                                            <ExternalLink className="w-3 h-3 mr-1" />
                                            Open in New Tab
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => {
                                              navigator.clipboard.writeText(lesson.videoUrl);
                                              toast({
                                                title: "Link Copied",
                                                description: "Video URL copied to clipboard",
                                              });
                                            }}
                                          >
                                            Copy Link
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {lesson.type === 'document' && lesson.documentUrl && (
                                      <div className="space-y-3">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                          <FileText className="w-4 h-4" />
                                          <span>Document content available</span>
                                          <Badge variant="outline" className="text-xs">
                                            {getFileType(lesson.documentUrl)}
                                          </Badge>
                                        </div>
                                        {/* Document Viewer */}
                                        <div className="border rounded-lg overflow-hidden bg-gray-50">
                                          <div className="bg-gray-100 p-3 border-b flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                              <FileText className="w-4 h-4" />
                                              <span className="text-sm font-medium">Document Preview</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => window.open(lesson.documentUrl, '_blank')}
                                              >
                                                <ExternalLink className="w-3 h-3 mr-1" />
                                                Full Screen
                                              </Button>
                                              <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => {
                                                  const link = document.createElement('a');
                                                  link.href = lesson.documentUrl;
                                                  link.download = lesson.title || 'document';
                                                  link.click();
                                                }}
                                              >
                                                <Download className="w-3 h-3 mr-1" />
                                                Download
                                              </Button>
                                            </div>
                                          </div>
                                          {getFileType(lesson.documentUrl) === 'pdf' ? (
                                            <iframe
                                              src={lesson.documentUrl}
                                              className="w-full h-80"
                                              title={lesson.title}
                                              style={{ border: 'none' }}
                                            />
                                          ) : (
                                            <div className="w-full h-80 flex items-center justify-center bg-gray-100">
                                              <div className="text-center">
                                                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                                <p className="text-gray-600 mb-4">
                                                  Preview not available for this file type
                                                </p>
                                                <Button 
                                                  onClick={() => window.open(lesson.documentUrl, '_blank')}
                                                  className="bg-indigo-600 hover:bg-indigo-700"
                                                >
                                                  <Download className="w-4 h-4 mr-2" />
                                                  Download & View
                                                </Button>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Fallback for other content types */}
                                    {lesson.type === 'video' && !lesson.videoUrl && (
                                      <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                                        <Video className="w-4 h-4" />
                                        <span>Video content not yet uploaded</span>
                                      </div>
                                    )}

                                    {lesson.type === 'document' && !lesson.documentUrl && (
                                      <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                                        <FileText className="w-4 h-4" />
                                        <span>Document content not yet uploaded</span>
                                      </div>
                                    )}

                                    {lesson.content && (
                                      <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="text-sm text-gray-700">
                                          {lesson.content.length > 200 
                                            ? `${lesson.content.substring(0, 200)}...` 
                                            : lesson.content
                                          }
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <PlayCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>No lessons in this module yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
