import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
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
  Globe,
  Shield,
  Target,
  Calendar,
  BarChart3,
  Coins,
  ChevronDown,
  ChevronUp,
  Monitor,
  Smartphone,
  Infinity,
  Download
} from 'lucide-react';

export default function CoursePreview() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { getCourseById } = useCourses();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [course, setCourse] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (courseId) {
      const courseData = getCourseById(courseId);
      if (courseData) {
        setCourse(courseData);
        // Expand first section by default
        setExpandedSections({ 0: true });
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

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const calculateTotalDuration = () => {
    if (!course.curriculum) return '0 hours';
    let totalMinutes = 0;
    course.curriculum.forEach(section => {
      section.lessons?.forEach(lesson => {
        const duration = lesson.duration || '5 min';
        const minutes = parseInt(duration.split(' ')[0]) || 5;
        totalMinutes += minutes;
      });
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
  };

  const totalLessons = course?.curriculum?.reduce((total, section) => 
    total + (section.lessons?.length || 0), 0) || 0;

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-primary/10 via-purple-50 to-blue-50 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/teacher-dashboard')}
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Badge variant="outline" className="bg-blue-100/80 text-blue-700 border-blue-200 backdrop-blur-sm">
              Preview Mode
            </Badge>
            <Badge 
              variant={course.status === 'active' ? 'default' : 'secondary'}
              className={course.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              {course.status}
            </Badge>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Course Header Info */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Badge variant="outline" className="mb-3 bg-white/80 backdrop-blur-sm">
                  {course.category}
                </Badge>
                <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
                  {course.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold text-lg">4.8</span>
                  <span className="text-muted-foreground">(247 ratings)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">1,247 students enrolled</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="font-medium">{calculateTotalDuration()} total content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">{totalLessons} lessons</span>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.username?.charAt(0) || 'T'}
                </div>
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Created by</p>
                  <p className="font-semibold">{user?.username || 'Teacher'}</p>
                  <p className="text-sm text-muted-foreground">Blockchain Expert & Educator</p>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div className="lg:sticky lg:top-24">
              <Card className="p-6 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                    ${course.price}
                  </div>
                  <Badge variant="outline" className="mb-4">
                    {course.difficulty} Level
                  </Badge>
                </div>

                <Button 
                  className="w-full gradient-primary mb-4" 
                  size="lg"
                  onClick={() => toast({
                    title: "Preview Mode",
                    description: "This is a preview. Students would enroll here.",
                  })}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Enroll Now
                </Button>

                <p className="text-center text-sm text-muted-foreground mb-6">
                  30-day money-back guarantee
                </p>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h4 className="font-semibold mb-3">This course includes:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">{calculateTotalDuration()} on-demand video</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-green-600" />
                      <span className="text-sm">{course.curriculum?.length || 0} downloadable resources</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Monitor className="w-5 h-5 text-purple-600" />
                      <span className="text-sm">Access on desktop and mobile</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm">NFT Certificate of completion</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm">Blockchain verified credentials</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Coins className="w-5 h-5 text-orange-600" />
                      <span className="text-sm">Earn SkillTokens</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Infinity className="w-5 h-5 text-pink-600" />
                      <span className="text-sm">Full lifetime access</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <Card className="p-8 shadow-lg border-0 bg-white">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Target className="w-6 h-6 mr-3 text-primary" />
                What you'll learn
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {course.skills?.map((skill, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{skill}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Course Content */}
            <Card className="p-8 shadow-lg border-0 bg-white">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-primary" />
                Course Content
              </h2>
              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{course.curriculum?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Sections</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{totalLessons}</div>
                    <div className="text-sm text-muted-foreground">Lectures</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{calculateTotalDuration()}</div>
                    <div className="text-sm text-muted-foreground">Total length</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {course.curriculum?.map((section, index) => (
                  <div key={index} className="border border-border rounded-lg overflow-hidden">
                    <div 
                      className="p-4 bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => toggleSection(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {expandedSections[index] ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                          <h3 className="font-semibold text-lg">
                            Section {index + 1}: {section.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{section.lessons?.length || 0} lectures</span>
                          <span>•</span>
                          <span>
                            {section.lessons?.reduce((total, lesson) => {
                              const duration = lesson.duration || '5 min';
                              const minutes = parseInt(duration.split(' ')[0]) || 5;
                              return total + minutes;
                            }, 0) || 0} min
                          </span>
                        </div>
                      </div>
                      {section.description && (
                        <p className="text-sm text-muted-foreground mt-2 ml-8">
                          {section.description}
                        </p>
                      )}
                    </div>
                    
                    {expandedSections[index] && (
                      <div className="p-4 space-y-3 bg-white">
                        {section.lessons?.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="flex items-center justify-between py-3 border-b last:border-b-0">
                            <div className="flex items-center space-x-4">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                {lessonIndex === 0 ? (
                                  <Play className="w-4 h-4 text-primary" />
                                ) : (
                                  <Lock className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{lesson.title}</div>
                                {lesson.type && (
                                  <div className="text-sm text-muted-foreground capitalize">
                                    {lesson.type}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-muted-foreground">
                                {lesson.duration || '5 min'}
                              </span>
                              {lessonIndex === 0 && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                  Preview
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Requirements */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <Card className="p-8 shadow-lg border-0 bg-white">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3 text-primary" />
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {course.prerequisites.map((req, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Course Description */}
            <Card className="p-8 shadow-lg border-0 bg-white">
              <h2 className="text-2xl font-bold mb-6">Description</h2>
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {course.description}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This comprehensive course is designed to take you from beginner to advanced level in {course.category.toLowerCase()}. 
                  You'll learn through hands-on projects, real-world examples, and practical exercises that prepare you for industry challenges.
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Course Features */}
            <Card className="p-6 shadow-lg border-0 bg-white">
              <h3 className="text-lg font-semibold mb-4">Course Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Skill Level</span>
                  <Badge variant="outline">{course.difficulty}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{course.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{calculateTotalDuration()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Lectures</span>
                  <span className="font-medium">{totalLessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Language</span>
                  <span className="font-medium">English</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-bold text-primary">${course.price}</span>
                </div>
              </div>
            </Card>

            {/* Blockchain Features */}
            <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-purple-50 to-blue-50">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-primary" />
                Blockchain Features
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">NFT Certificate</span>
                  <Badge className="bg-green-100 text-green-700">Included</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SkillToken Rewards</span>
                  <Badge className="bg-blue-100 text-blue-700">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Marketplace Trading</span>
                  <Badge className="bg-purple-100 text-purple-700">Available</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Verification</span>
                  <Badge className="bg-indigo-100 text-indigo-700">Blockchain</Badge>
                </div>
              </div>
            </Card>

            {/* Related Courses */}
            <Card className="p-6 shadow-lg border-0 bg-white">
              <h3 className="text-lg font-semibold mb-4">Students also bought</h3>
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <img src="/placeholder.svg" alt="Related course" className="w-16 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Advanced Smart Contracts</h4>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span>4.9</span>
                    </div>
                    <p className="text-sm font-semibold text-primary">$149</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <img src="/placeholder.svg" alt="Related course" className="w-16 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">DeFi Development</h4>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span>4.7</span>
                    </div>
                    <p className="text-sm font-semibold text-primary">$199</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
