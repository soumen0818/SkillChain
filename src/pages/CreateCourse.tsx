import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  X,
  Plus,
  FileText,
  Video,
  Image,
  File,
  BookOpen,
  Award,
  Coins,
  Globe,
  Users,
  Clock,
  Star,
  ChevronLeft,
  Save,
  Eye,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import { uploadThumbnail, uploadLessonContent, validateFile, formatFileSize } from '@/lib/uploadUtils';

interface CourseData {
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  price: string;
  skillTokenReward: string;
  prerequisites: string[];
  learningOutcomes: string[];
  thumbnail: string | null; // Changed from File to string (URL)
  syllabus: Module[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  content: string | null; // Changed from File to string (URL)
  description: string;
}

export default function CreateCourse() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addCourse, refreshCourses } = useCourses();
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    description: '',
    category: '',
    level: '',
    duration: '',
    price: '',
    skillTokenReward: '',
    prerequisites: [],
    learningOutcomes: [],
    thumbnail: null,
    syllabus: []
  });

  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const categories = [
    'Blockchain Development',
    'Smart Contracts',
    'DeFi',
    'NFTs',
    'Web3 Development',
    'Cryptocurrency',
    'Ethereum',
    'Solidity',
    'React/Frontend',
    'Backend Development'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleInputChange = (field: keyof CourseData, value: any) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      handleInputChange('prerequisites', [...courseData.prerequisites, newPrerequisite.trim()]);
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (index: number) => {
    handleInputChange('prerequisites', courseData.prerequisites.filter((_, i) => i !== index));
  };

  const addLearningOutcome = () => {
    if (newOutcome.trim()) {
      handleInputChange('learningOutcomes', [...courseData.learningOutcomes, newOutcome.trim()]);
      setNewOutcome('');
    }
  };

  const removeLearningOutcome = (index: number) => {
    handleInputChange('learningOutcomes', courseData.learningOutcomes.filter((_, i) => i !== index));
  };

  const addModule = () => {
    const newModule: Module = {
      id: `module_${Date.now()}`,
      title: '',
      description: '',
      lessons: []
    };
    handleInputChange('syllabus', [...courseData.syllabus, newModule]);
  };

  const updateModule = (moduleId: string, field: keyof Module, value: any) => {
    const updatedSyllabus = courseData.syllabus.map(module =>
      module.id === moduleId ? { ...module, [field]: value } : module
    );
    handleInputChange('syllabus', updatedSyllabus);
  };

  const removeModule = (moduleId: string) => {
    handleInputChange('syllabus', courseData.syllabus.filter(module => module.id !== moduleId));
  };

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: `lesson_${Date.now()}`,
      title: '',
      type: 'video',
      content: null,
      description: ''
    };

    const updatedSyllabus = courseData.syllabus.map(module =>
      module.id === moduleId
        ? { ...module, lessons: [...module.lessons, newLesson] }
        : module
    );
    handleInputChange('syllabus', updatedSyllabus);
  };

  const updateLesson = (moduleId: string, lessonId: string, field: keyof Lesson, value: any) => {
    const updatedSyllabus = courseData.syllabus.map(module =>
      module.id === moduleId
        ? {
          ...module,
          lessons: module.lessons.map(lesson =>
            lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
          )
        }
        : module
    );
    handleInputChange('syllabus', updatedSyllabus);
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    const updatedSyllabus = courseData.syllabus.map(module =>
      module.id === moduleId
        ? { ...module, lessons: module.lessons.filter(lesson => lesson.id !== lessonId) }
        : module
    );
    handleInputChange('syllabus', updatedSyllabus);
  };

  const handleFileUpload = async (file: File, field: 'thumbnail' | 'content', moduleId?: string, lessonId?: string) => {
    try {
      // Validate file first
      const validation = validateFile(file, field === 'thumbnail' ? 'thumbnail' : 'content');
      if (!validation.valid) {
        toast({
          title: "File Validation Error",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }

      // Show upload progress
      toast({
        title: "Uploading...",
        description: `Uploading ${file.name} (${formatFileSize(file.size)})`,
      });

      if (field === 'thumbnail') {
        // Upload thumbnail to Cloudinary
        const uploadResult = await uploadThumbnail(file);
        handleInputChange('thumbnail', uploadResult.url);

        toast({
          title: "Upload Successful",
          description: "Thumbnail uploaded successfully!",
        });
      } else if (moduleId && lessonId) {
        // Upload lesson content to Cloudinary
        const uploadResult = await uploadLessonContent(file);
        updateLesson(moduleId, lessonId, 'content', uploadResult.url);

        toast({
          title: "Upload Successful",
          description: "Lesson content uploaded successfully!",
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(courseData.title && courseData.description && courseData.category && courseData.level);
      case 2:
        return !!(courseData.duration && courseData.price && courseData.skillTokenReward);
      case 3:
        return courseData.prerequisites.length > 0 && courseData.learningOutcomes.length > 0;
      case 4:
        return courseData.syllabus.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveDraft = async () => {
    if (!user?._id) {
      toast({
        title: "Authentication Error",
        description: "Please log in to save a course.",
        variant: "destructive"
      });
      return;
    }

    // Only save if we have at least a title
    if (!courseData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide at least a course title to save as draft.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create the course object as draft
      const draftCourse = {
        title: courseData.title,
        description: courseData.description || '',
        category: courseData.category || 'Other',
        level: courseData.level || 'Beginner',
        duration: courseData.duration || 'TBD',
        price: courseData.price || '0',
        skillTokenReward: courseData.skillTokenReward || '0',
        prerequisites: courseData.prerequisites,
        learningOutcomes: courseData.learningOutcomes,
        thumbnail: courseData.thumbnail || null,
        syllabus: courseData.syllabus.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson => ({
            ...lesson,
            content: lesson.content || ''
          }))
        })),
        status: 'draft'
      }; await addCourse(draftCourse);

      toast({
        title: "Draft Saved",
        description: "Your course has been saved as a draft and is now visible in your dashboard.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save draft. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePublish = async () => {
    if (validateStep(1) && validateStep(2) && validateStep(3) && validateStep(4)) {
      if (!user?._id) {
        toast({
          title: "Authentication Error",
          description: "Please log in to publish a course.",
          variant: "destructive"
        });
        return;
      }

      try {
        // Create the course object with proper structure for the backend
        const courseToPublish = {
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          level: courseData.level,
          duration: courseData.duration,
          price: courseData.price,
          skillTokenReward: courseData.skillTokenReward,
          prerequisites: courseData.prerequisites,
          learningOutcomes: courseData.learningOutcomes,
          thumbnail: courseData.thumbnail || null,
          syllabus: courseData.syllabus.map(module => ({
            ...module,
            lessons: module.lessons.map(lesson => ({
              ...lesson,
              content: lesson.content || ''
            }))
          })),
          status: 'active' // Set status to active when publishing
        }; const newCourseId = await addCourse(courseToPublish);
        console.log('Course created with ID:', newCourseId);

        // Refresh courses to ensure the new course is immediately available
        await refreshCourses();
        console.log('Courses refreshed after creation');

        toast({
          title: "Course Published!",
          description: "Your course has been successfully published and is now visible to students on the main courses page.",
        });

        // Navigate to courses page to show the new course
        navigate('/courses');
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to publish course. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please complete all required sections before publishing.",
        variant: "destructive"
      });
    }
  };

  const getStepProgress = () => (currentStep / 5) * 100;

  const getIconForLessonType = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'document': return FileText;
      case 'quiz': return BookOpen;
      case 'assignment': return File;
      default: return FileText;
    }
  };

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
          </div>
          <h1 className="text-3xl font-bold text-foreground">Create New Course</h1>
          <p className="text-muted-foreground mt-2">
            Create and publish blockchain-verified courses that issue NFT certificates
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Course Creation Progress</h3>
            <span className="text-sm text-muted-foreground">Step {currentStep} of 5</span>
          </div>
          <Progress value={getStepProgress()} className="mb-4" />
          <div className="flex justify-between text-sm">
            <span className={currentStep >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}>Basic Info</span>
            <span className={currentStep >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}>Pricing</span>
            <span className={currentStep >= 3 ? 'text-primary font-medium' : 'text-muted-foreground'}>Requirements</span>
            <span className={currentStep >= 4 ? 'text-primary font-medium' : 'text-muted-foreground'}>Curriculum</span>
            <span className={currentStep >= 5 ? 'text-primary font-medium' : 'text-muted-foreground'}>Review</span>
          </div>
        </Card>

        {/* Step Content */}
        <Card className="p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Basic Course Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={courseData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Advanced Blockchain Development"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={courseData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level *</Label>
                  <Select value={courseData.level} onValueChange={(value) => handleInputChange('level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Course Thumbnail</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'thumbnail')}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label htmlFor="thumbnail-upload" className="cursor-pointer">
                      {courseData.thumbnail ? (
                        <div className="text-center">
                          <img
                            src={courseData.thumbnail}
                            alt="Course thumbnail"
                            className="w-20 h-20 mx-auto mb-2 object-cover rounded border"
                          />
                          <p className="text-sm text-green-600">Thumbnail uploaded</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload thumbnail</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Course Description *</Label>
                <Textarea
                  id="description"
                  value={courseData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide a detailed description of what students will learn..."
                  rows={5}
                />
              </div>
            </div>
          )}

          {/* Step 2: Pricing & Rewards */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Pricing & Token Rewards</h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duration">Course Duration *</Label>
                  <Input
                    id="duration"
                    value={courseData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 8 weeks"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (ETH) *</Label>
                  <Input
                    id="price"
                    value={courseData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="e.g., 0.1"
                    type="number"
                    step="0.001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skillTokenReward">SkillToken Reward *</Label>
                  <Input
                    id="skillTokenReward"
                    value={courseData.skillTokenReward}
                    onChange={(e) => handleInputChange('skillTokenReward', e.target.value)}
                    placeholder="e.g., 100"
                    type="number"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <Card className="p-6 border-primary/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <Coins className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold">Token Economics</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Course Price:</span>
                      <span className="font-medium">{courseData.price || '0'} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SkillTokens Awarded:</span>
                      <span className="font-medium">{courseData.skillTokenReward || '0'} SKILL</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee (5%):</span>
                      <span className="font-medium">{(parseFloat(courseData.price || '0') * 0.05).toFixed(3)} ETH</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Your Earnings:</span>
                      <span className="font-medium text-primary">{(parseFloat(courseData.price || '0') * 0.95).toFixed(3)} ETH</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-green-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Award className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold">NFT Certificate</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      Upon completion, students will receive:
                    </p>
                    <ul className="space-y-1">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Unique NFT Certificate</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{courseData.skillTokenReward || '0'} SkillTokens</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Blockchain verification</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Tradeable in marketplace</span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Step 3: Prerequisites & Learning Outcomes */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Prerequisites & Learning Outcomes</h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Prerequisites */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Prerequisites</h3>
                  <div className="flex space-x-2">
                    <Input
                      value={newPrerequisite}
                      onChange={(e) => setNewPrerequisite(e.target.value)}
                      placeholder="Add a prerequisite..."
                      onKeyPress={(e) => e.key === 'Enter' && addPrerequisite()}
                    />
                    <Button onClick={addPrerequisite} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {courseData.prerequisites.map((prereq, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center justify-between p-2">
                        <span>{prereq}</span>
                        <button onClick={() => removePrerequisite(index)}>
                          <X className="w-4 h-4" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Learning Outcomes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Learning Outcomes</h3>
                  <div className="flex space-x-2">
                    <Input
                      value={newOutcome}
                      onChange={(e) => setNewOutcome(e.target.value)}
                      placeholder="Add a learning outcome..."
                      onKeyPress={(e) => e.key === 'Enter' && addLearningOutcome()}
                    />
                    <Button onClick={addLearningOutcome} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {courseData.learningOutcomes.map((outcome, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center justify-between p-2">
                        <span>{outcome}</span>
                        <button onClick={() => removeLearningOutcome(index)}>
                          <X className="w-4 h-4" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Curriculum Builder */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Build Your Curriculum</h2>
                <Button onClick={addModule} className="gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Module
                </Button>
              </div>

              <div className="space-y-6">
                {courseData.syllabus.map((module, moduleIndex) => (
                  <Card key={module.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Module {moduleIndex + 1}</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeModule(module.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <Label>Module Title</Label>
                        <Input
                          value={module.title}
                          onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                          placeholder="Enter module title..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Module Description</Label>
                        <Input
                          value={module.description}
                          onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                          placeholder="Brief description..."
                        />
                      </div>
                    </div>

                    {/* Lessons */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Lessons</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addLesson(module.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Lesson
                        </Button>
                      </div>

                      {module.lessons.map((lesson, lessonIndex) => {
                        const IconComponent = getIconForLessonType(lesson.type);
                        return (
                          <Card key={lesson.id} className="p-4 border-l-4 border-primary/20">
                            <div className="grid md:grid-cols-4 gap-4">
                              <div className="space-y-2">
                                <Label>Lesson Title</Label>
                                <Input
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                                  placeholder="Lesson title..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Type</Label>
                                <Select
                                  value={lesson.type}
                                  onValueChange={(value) => updateLesson(module.id, lesson.id, 'type', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="document">Document</SelectItem>
                                    <SelectItem value="quiz">Quiz</SelectItem>
                                    <SelectItem value="assignment">Assignment</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Content</Label>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="file"
                                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'content', module.id, lesson.id)}
                                    className="hidden"
                                    id={`lesson-${lesson.id}`}
                                  />
                                  <label htmlFor={`lesson-${lesson.id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full" asChild>
                                      <span>
                                        <IconComponent className="w-4 h-4 mr-2" />
                                        {lesson.content ? 'Content uploaded' : 'Upload'}
                                      </span>
                                    </Button>
                                  </label>
                                </div>
                              </div>
                              <div className="flex items-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeLesson(module.id, lesson.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Review & Publish */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Review & Publish</h2>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Course Overview */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Course Overview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Title:</span>
                        <span className="font-medium">{courseData.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium">{courseData.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Level:</span>
                        <span className="font-medium">{courseData.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{courseData.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium">{courseData.price} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SkillToken Reward:</span>
                        <span className="font-medium">{courseData.skillTokenReward} SKILL</span>
                      </div>
                    </div>
                  </Card>

                  {/* Curriculum Summary */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Curriculum Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Modules:</span>
                        <span className="font-medium">{courseData.syllabus.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Lessons:</span>
                        <span className="font-medium">
                          {courseData.syllabus.reduce((total, module) => total + module.lessons.length, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Prerequisites:</span>
                        <span className="font-medium">{courseData.prerequisites.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Learning Outcomes:</span>
                        <span className="font-medium">{courseData.learningOutcomes.length}</span>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  {/* Publishing Options */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Publishing Options</h3>
                    <div className="space-y-4">
                      <Button
                        onClick={handleSaveDraft}
                        variant="outline"
                        className="w-full"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save as Draft
                      </Button>
                      <Button
                        onClick={() => {/* Preview logic */ }}
                        variant="outline"
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Course
                      </Button>
                      <Button
                        onClick={handlePublish}
                        className="w-full gradient-primary"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Publish Course
                      </Button>
                    </div>
                  </Card>

                  {/* Blockchain Info */}
                  <Card className="p-6 border-primary/20">
                    <h3 className="text-lg font-semibold mb-4">Blockchain Features</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>NFT certificates will be minted</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>SkillTokens will be distributed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Course data stored on IPFS</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Smart contract deployment</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            <div className="space-x-4">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>

              {currentStep < 5 ? (
                <Button onClick={nextStep} className="gradient-primary">
                  Next
                </Button>
              ) : (
                <Button onClick={handlePublish} className="gradient-primary">
                  <Globe className="w-4 h-4 mr-2" />
                  Publish Course
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
