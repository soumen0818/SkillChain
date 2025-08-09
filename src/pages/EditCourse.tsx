import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCourses } from '@/contexts/CourseContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronLeft,
  Save,
  Upload,
  Plus,
  X,
  Eye,
  FileText,
  Video,
  Image,
  Trash2,
  BookOpen
} from 'lucide-react';

export default function EditCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { getCourseById, updateCourse } = useCourses();
  const { toast } = useToast();
  
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

  useEffect(() => {
    if (courseId) {
      const courseData = getCourseById(courseId);
      if (courseData) {
        setCourse(courseData);
      } else {
        toast({
          title: "Course Not Found",
          description: "The course you're trying to edit doesn't exist.",
          variant: "destructive"
        });
        navigate('/teacher-dashboard');
      }
    }
  }, [courseId, getCourseById, navigate, toast]);

  const handleSave = async () => {
    if (!course || !courseId) return;
    
    setIsLoading(true);
    try {
      updateCourse(courseId, course);
      toast({
        title: "Course Updated",
        description: "Your course has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCourse(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addPrerequisite = (prereq) => {
    if (prereq.trim()) {
      setCourse(prev => ({
        ...prev,
        prerequisites: [...(prev.prerequisites || []), prereq.trim()]
      }));
    }
  };

  const removePrerequisite = (index) => {
    setCourse(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  const addLearningOutcome = (outcome) => {
    if (outcome.trim()) {
      setCourse(prev => ({
        ...prev,
        learningOutcomes: [...(prev.learningOutcomes || []), outcome.trim()]
      }));
    }
  };

  const removeLearningOutcome = (index) => {
    setCourse(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index)
    }));
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading course data...</p>
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
            <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
              {course.status}
            </Badge>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Edit Course</h1>
              <p className="text-muted-foreground mt-2">Update your course information and content</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
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
        </div>

        {/* Navigation */}
        <div className="flex space-x-1 mb-8 overflow-x-auto">
          {[
            { id: 'basic', label: 'Basic Info' },
            { id: 'pricing', label: 'Pricing' },
            { id: 'requirements', label: 'Requirements' },
            { id: 'content', label: 'Content' },
            { id: 'settings', label: 'Settings' }
          ].map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? 'default' : 'ghost'}
              onClick={() => setActiveSection(section.id)}
              className="whitespace-nowrap"
            >
              {section.label}
            </Button>
          ))}
        </div>

        {/* Content Sections */}
        <Card className="p-8">
          {/* Basic Information */}
          {activeSection === 'basic' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={course.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={course.category || ''} 
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Blockchain Development">Blockchain Development</SelectItem>
                      <SelectItem value="Smart Contracts">Smart Contracts</SelectItem>
                      <SelectItem value="DeFi">DeFi</SelectItem>
                      <SelectItem value="NFTs">NFTs</SelectItem>
                      <SelectItem value="Web3 Development">Web3 Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level</Label>
                  <Select 
                    value={course.level || ''} 
                    onValueChange={(value) => handleInputChange('level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={course.duration || ''}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 8 weeks"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={course.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Course Thumbnail</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  {course.thumbnail ? (
                    <div className="space-y-4">
                      <img 
                        src={course.thumbnail} 
                        alt="Course thumbnail" 
                        className="max-w-xs mx-auto rounded-lg"
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Change Thumbnail
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Thumbnail
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pricing */}
          {activeSection === 'pricing' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Pricing & Rewards</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (ETH)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.001"
                    value={course.price || ''}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skillTokenReward">SkillToken Reward</Label>
                  <Input
                    id="skillTokenReward"
                    type="number"
                    value={course.skillTokenReward || ''}
                    onChange={(e) => handleInputChange('skillTokenReward', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Platform Fee (5%)</Label>
                  <Input
                    value={`${(parseFloat(course.price || '0') * 0.05).toFixed(3)} ETH`}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>

              <Card className="p-6 border-primary/20">
                <h3 className="font-semibold mb-4">Pricing Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Course Price:</span>
                    <span className="font-medium">{course.price || '0'} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee (5%):</span>
                    <span className="font-medium">{(parseFloat(course.price || '0') * 0.05).toFixed(3)} ETH</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Your Earnings:</span>
                    <span className="font-medium text-primary">{(parseFloat(course.price || '0') * 0.95).toFixed(3)} ETH</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Requirements */}
          {activeSection === 'requirements' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Prerequisites & Learning Outcomes</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <PrerequisitesSection 
                  prerequisites={course.prerequisites || []}
                  onAdd={addPrerequisite}
                  onRemove={removePrerequisite}
                />
                <LearningOutcomesSection 
                  outcomes={course.learningOutcomes || []}
                  onAdd={addLearningOutcome}
                  onRemove={removeLearningOutcome}
                />
              </div>
            </div>
          )}

          {/* Content */}
          {activeSection === 'content' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Course Content</h2>
              
              <Card className="p-6 text-center">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Content Management</h3>
                <p className="text-muted-foreground mb-4">
                  Manage your course modules, lessons, and assignments
                </p>
                <div className="flex justify-center space-x-4">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Module
                  </Button>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Content
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Settings */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Course Settings</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Visibility Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Course Status</p>
                        <p className="text-sm text-muted-foreground">Control course availability</p>
                      </div>
                      <Select 
                        value={course.status || 'draft'} 
                        onValueChange={(value) => handleInputChange('status', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Course Statistics</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Total Students:</span>
                      <span className="font-medium">{course.students || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Certificates Issued:</span>
                      <span className="font-medium">{course.certificates || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Rating:</span>
                      <span className="font-medium">{course.rating || 0}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Earnings:</span>
                      <span className="font-medium">{course.earnings || '0 ETH'}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// Helper Components
function PrerequisitesSection({ prerequisites, onAdd, onRemove }) {
  const [newPrereq, setNewPrereq] = useState('');

  const handleAdd = () => {
    onAdd(newPrereq);
    setNewPrereq('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Prerequisites</h3>
      <div className="flex space-x-2">
        <Input
          value={newPrereq}
          onChange={(e) => setNewPrereq(e.target.value)}
          placeholder="Add a prerequisite..."
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button onClick={handleAdd} size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {prerequisites.map((prereq, index) => (
          <Badge key={index} variant="secondary" className="flex items-center justify-between p-2">
            <span>{prereq}</span>
            <button onClick={() => onRemove(index)}>
              <X className="w-4 h-4" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

function LearningOutcomesSection({ outcomes, onAdd, onRemove }) {
  const [newOutcome, setNewOutcome] = useState('');

  const handleAdd = () => {
    onAdd(newOutcome);
    setNewOutcome('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Learning Outcomes</h3>
      <div className="flex space-x-2">
        <Input
          value={newOutcome}
          onChange={(e) => setNewOutcome(e.target.value)}
          placeholder="Add a learning outcome..."
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button onClick={handleAdd} size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {outcomes.map((outcome, index) => (
          <Badge key={index} variant="secondary" className="flex items-center justify-between p-2">
            <span>{outcome}</span>
            <button onClick={() => onRemove(index)}>
              <X className="w-4 h-4" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
