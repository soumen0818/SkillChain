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
  Play,
  Clock,
  Users,
  Star,
  Award,
  BookOpen,
  CheckCircle,
  Lock,
  Download,
  Globe,
  Shield,
  Target
} from 'lucide-react';

export default function CoursePreview() {
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
          description: "The course you're trying to preview doesn't exist.",
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
            <p className="text-muted-foreground">Loading course preview...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Preview Mode
            </Badge>
            <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
              {course.status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Course Preview</h1>
          <p className="text-muted-foreground">This is how your course appears to students</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <Card className="overflow-hidden">
              <img 
                src={course.thumbnail || "/placeholder.svg"} 
                alt={course.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                    <p className="text-muted-foreground mb-4">{course.description}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">4.8</span>
                        <span className="text-muted-foreground">(127 reviews)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">324 students</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{course.duration}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-4">{course.difficulty}</Badge>
                </div>
                
                <Button className="w-full gradient-primary" size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Start Learning
                </Button>
              </div>
            </Card>

            {/* What You'll Learn */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">What you'll learn</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {course.skills?.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Course Content */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Course Content</h3>
              <div className="mb-4 text-sm text-muted-foreground">
                {course.curriculum?.length || 0} sections • {course.curriculum?.reduce((total, section) => total + (section.lessons?.length || 0), 0) || 0} lectures • {course.duration} total length
              </div>
              <div className="space-y-3">
                {course.curriculum?.map((section, index) => (
                  <div key={index} className="border border-border rounded-lg">
                    <div className="p-4 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{section.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{section.lessons?.length || 0} lectures</span>
                          <span>•</span>
                          <span>45min</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                    </div>
                    <div className="p-4 space-y-2">
                      {section.lessons?.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-3">
                            <Play className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{lesson.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                            {lessonIndex === 0 ? (
                              <Badge variant="outline" className="text-xs">Preview</Badge>
                            ) : (
                              <Lock className="w-3 h-3 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Requirements */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {course.prerequisites.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2"></div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Card */}
            <Card className="p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary mb-2">${course.price}</div>
                <Button className="w-full gradient-primary mb-4" size="lg">
                  Enroll Now
                </Button>
                <p className="text-xs text-muted-foreground">30-day money-back guarantee</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">This course includes:</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{course.duration} on-demand video</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span>{course.curriculum?.length || 0} downloadable resources</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span>NFT Certificate of completion</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span>Access on mobile and desktop</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span>Blockchain verified certificate</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span>SkillToken rewards</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Instructor */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Instructor</h4>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h5 className="font-medium">John Smith</h5>
                  <p className="text-sm text-muted-foreground mb-2">Blockchain Developer & Educator</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>4.9 instructor rating</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>2,847 students</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Features */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Course Features</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Skill Level</span>
                  <Badge variant="outline">{course.difficulty}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Students</span>
                  <span className="text-sm font-medium">324</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Languages</span>
                  <span className="text-sm font-medium">English</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Category</span>
                  <span className="text-sm font-medium">{course.category}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
