import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useCourses } from '@/contexts/CourseContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronLeft,
  Save,
  Settings,
  Shield,
  Globe,
  Users,
  Bell,
  Archive,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Lock,
  Unlock,
  Pause,
  Play
} from 'lucide-react';

export default function CourseSettings() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { getCourseById, updateCourse, deleteCourse } = useCourses();
  const { toast } = useToast();
  
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        navigate('/teacher/dashboard');
      }
    }
  }, [courseId, getCourseById, navigate, toast]);

  const handleSave = async () => {
    if (!course || !courseId) return;
    
    setIsLoading(true);
    try {
      updateCourse(courseId, course);
      toast({
        title: "Settings Updated",
        description: "Your course settings have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    setCourse(prev => ({ ...prev, status: newStatus }));
    toast({
      title: "Status Updated",
      description: `Course status changed to ${newStatus}.`,
    });
  };

  const handleDeleteCourse = () => {
    if (courseId) {
      deleteCourse(courseId);
      toast({
        title: "Course Deleted",
        description: "Your course has been permanently deleted.",
      });
      navigate('/teacher/dashboard');
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading course settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/teacher/dashboard')}
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
              <h1 className="text-3xl font-bold text-foreground">Course Settings</h1>
              <p className="text-muted-foreground mt-2">{course.title}</p>
            </div>
            <Button 
              onClick={handleSave}
              className="gradient-primary"
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Course Status */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Course Status
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  course.status === 'active' ? 'border-green-500 bg-green-50' : 'border-border hover:border-green-300'
                }`}
                onClick={() => handleStatusChange('active')}
              >
                <div className="flex items-center space-x-3">
                  <Play className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold">Active</h3>
                    <p className="text-sm text-muted-foreground">Course is live and accepting enrollments</p>
                  </div>
                </div>
              </div>

              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  course.status === 'paused' ? 'border-yellow-500 bg-yellow-50' : 'border-border hover:border-yellow-300'
                }`}
                onClick={() => handleStatusChange('paused')}
              >
                <div className="flex items-center space-x-3">
                  <Pause className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold">Paused</h3>
                    <p className="text-sm text-muted-foreground">Course is temporarily unavailable</p>
                  </div>
                </div>
              </div>

              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  course.status === 'draft' ? 'border-gray-500 bg-gray-50' : 'border-border hover:border-gray-300'
                }`}
                onClick={() => handleStatusChange('draft')}
              >
                <div className="flex items-center space-x-3">
                  <Lock className="w-6 h-6 text-gray-600" />
                  <div>
                    <h3 className="font-semibold">Draft</h3>
                    <p className="text-sm text-muted-foreground">Course is hidden from public</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Visibility Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Visibility & Access
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Public Listing</h3>
                  <p className="text-sm text-muted-foreground">Show course in public course listings</p>
                </div>
                <Switch defaultChecked={course.status === 'active'} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Search Engine Indexing</h3>
                  <p className="text-sm text-muted-foreground">Allow search engines to index this course</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Direct Link Access</h3>
                  <p className="text-sm text-muted-foreground">Allow access via direct course link</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          {/* Enrollment Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Enrollment Settings
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maxStudents">Maximum Students</Label>
                <Input
                  id="maxStudents"
                  type="number"
                  placeholder="Unlimited"
                  defaultValue="100"
                />
                <p className="text-xs text-muted-foreground">Leave empty for unlimited enrollments</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="enrollmentDeadline">Enrollment Deadline</Label>
                <Input
                  id="enrollmentDeadline"
                  type="date"
                />
                <p className="text-xs text-muted-foreground">Optional deadline for enrollments</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Automatic Approval</h3>
                  <p className="text-sm text-muted-foreground">Students are enrolled immediately upon payment</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Waitlist</h3>
                  <p className="text-sm text-muted-foreground">Enable waitlist when course is full</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">New Enrollments</h3>
                  <p className="text-sm text-muted-foreground">Get notified when students enroll</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Course Completions</h3>
                  <p className="text-sm text-muted-foreground">Get notified when students complete the course</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">New Reviews</h3>
                  <p className="text-sm text-muted-foreground">Get notified about new course reviews</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Weekly Reports</h3>
                  <p className="text-sm text-muted-foreground">Receive weekly analytics reports</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          {/* Blockchain Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Blockchain & NFT Settings
            </h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="certificateTemplate">Certificate Template</Label>
                  <Select defaultValue="default">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Template</SelectItem>
                      <SelectItem value="modern">Modern Template</SelectItem>
                      <SelectItem value="classic">Classic Template</SelectItem>
                      <SelectItem value="custom">Custom Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="royaltyFee">Royalty Fee (%)</Label>
                  <Input
                    id="royaltyFee"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    defaultValue="2.5"
                  />
                  <p className="text-xs text-muted-foreground">Fee for secondary NFT sales</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Automatic Certificate Minting</h3>
                  <p className="text-sm text-muted-foreground">Mint NFT certificates automatically upon completion</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">SkillToken Distribution</h3>
                  <p className="text-sm text-muted-foreground">Distribute SkillTokens to students automatically</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Marketplace Trading</h3>
                  <p className="text-sm text-muted-foreground">Allow certificates to be traded in marketplace</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-destructive">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-destructive">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Danger Zone
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                <div>
                  <h3 className="font-medium">Archive Course</h3>
                  <p className="text-sm text-muted-foreground">Hide course from all listings but keep data</p>
                </div>
                <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                <div>
                  <h3 className="font-medium">Delete Course</h3>
                  <p className="text-sm text-muted-foreground">Permanently delete this course and all its data</p>
                </div>
                <Button 
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-6 max-w-md mx-4">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Delete Course</h3>
                <p className="text-muted-foreground mb-6">
                  Are you sure you want to delete "{course.title}"? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteCourse}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
