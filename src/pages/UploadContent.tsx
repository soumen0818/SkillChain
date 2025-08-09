import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileVideo, 
  FileText, 
  File,
  Play,
  Clock,
  BookOpen,
  CheckCircle,
  X,
  Plus,
  ArrowLeft,
  Monitor,
  Smartphone,
  Download,
  Eye,
  Trash2
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  files: UploadedFile[];
  order: number;
}

export default function UploadContent() {
  const { user } = useAuth();
  const { getTeacherCourses, updateCourse, getCourseById } = useCourses();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [currentModule, setCurrentModule] = useState<Module>({
    id: '',
    title: '',
    description: '',
    duration: '',
    type: 'video',
    files: [],
    order: 1
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Get teacher's courses
  const courses = user?.id ? getTeacherCourses(user.id) : [];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        progress: 0,
        status: 'uploading'
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate file upload
      simulateUpload(newFile.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 20, 100);
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...file, progress: 100, status: 'completed', url: '/placeholder-video.mp4' };
          }
          return { ...file, progress: newProgress };
        }
        return file;
      }));
    }, 500);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('video/')) return <FileVideo className="w-5 h-5 text-blue-500" />;
    if (type.startsWith('image/')) return <File className="w-5 h-5 text-green-500" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const handleSaveModule = () => {
    if (!selectedCourse) {
      toast({
        title: "Error",
        description: "Please select a course first.",
        variant: "destructive"
      });
      return;
    }

    if (!currentModule.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a module title.",
        variant: "destructive"
      });
      return;
    }

    if (uploadedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one file.",
        variant: "destructive"
      });
      return;
    }

    const course = getCourseById(selectedCourse);
    if (!course) return;

    const newModule = {
      ...currentModule,
      id: Math.random().toString(36).substr(2, 9),
      files: uploadedFiles,
      order: (course.curriculum?.length || 0) + 1
    };

    const updatedCourse = {
      ...course,
      curriculum: [...(course.curriculum || []), newModule]
    };

    updateCourse(selectedCourse, updatedCourse);

    toast({
      title: "Module Added Successfully!",
      description: `"${currentModule.title}" has been added to ${course.title}.`,
    });

    // Reset form
    setCurrentModule({
      id: '',
      title: '',
      description: '',
      duration: '',
      type: 'video',
      files: [],
      order: 1
    });
    setUploadedFiles([]);
    setSelectedCourse('');
  };

  const selectedCourseData = selectedCourse ? getCourseById(selectedCourse) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/teacher-dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8">
            <h1 className="text-3xl font-bold mb-2">Upload Course Content</h1>
            <p className="text-indigo-100">
              Add new modules, videos, and resources to your courses
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Selection */}
            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
                Select Course
              </h3>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose a course to add content to" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      <div className="flex items-center space-x-3">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {course.curriculum?.length || 0} modules
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedCourseData && (
                <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={selectedCourseData.thumbnail} 
                      alt={selectedCourseData.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-indigo-900">{selectedCourseData.title}</h4>
                      <p className="text-sm text-indigo-600">
                        {selectedCourseData.curriculum?.length || 0} existing modules
                      </p>
                    </div>
                    <Badge className="bg-indigo-100 text-indigo-700">
                      {selectedCourseData.status}
                    </Badge>
                  </div>
                </div>
              )}
            </Card>

            {/* Module Details */}
            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-indigo-600" />
                Module Information
              </h3>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Module Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Introduction to Smart Contracts"
                      value={currentModule.title}
                      onChange={(e) => setCurrentModule(prev => ({ ...prev, title: e.target.value }))}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 45 minutes"
                      value={currentModule.duration}
                      onChange={(e) => setCurrentModule(prev => ({ ...prev, duration: e.target.value }))}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Module Type</Label>
                  <Select 
                    value={currentModule.type} 
                    onValueChange={(value: 'video' | 'document' | 'quiz' | 'assignment') => 
                      setCurrentModule(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">
                        <div className="flex items-center space-x-2">
                          <FileVideo className="w-4 h-4" />
                          <span>Video Lesson</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="document">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <span>Document/PDF</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="quiz">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Quiz/Assessment</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="assignment">
                        <div className="flex items-center space-x-2">
                          <File className="w-4 h-4" />
                          <span>Assignment</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students will learn in this module..."
                    value={currentModule.description}
                    onChange={(e) => setCurrentModule(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>
            </Card>

            {/* File Upload */}
            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-indigo-600" />
                Upload Files
              </h3>

              {/* Drag & Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="video/*,image/*,.pdf,.doc,.docx,.ppt,.pptx"
                />
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Drop files here or click to browse
                    </h4>
                    <p className="text-gray-500 mt-2">
                      Support for videos, documents, images and presentations
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Files
                  </Button>
                </div>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold text-gray-900">Uploaded Files</h4>
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                        {file.status === 'uploading' && (
                          <div className="mt-2">
                            <Progress value={file.progress} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">{Math.round(file.progress)}% uploaded</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {file.status === 'completed' && (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeFile(file.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upload Progress */}
            <Card className="p-6 shadow-lg border-0">
              <h4 className="font-semibold mb-4 flex items-center">
                <Monitor className="w-5 h-5 mr-2 text-indigo-600" />
                Upload Status
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Files uploaded</span>
                  <span className="font-medium">
                    {uploadedFiles.filter(f => f.status === 'completed').length} / {uploadedFiles.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Total size</span>
                  <span className="font-medium">
                    {formatFileSize(uploadedFiles.reduce((sum, file) => sum + file.size, 0))}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Module type</span>
                  <Badge variant="outline" className="capitalize">
                    {currentModule.type}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Course Info */}
            {selectedCourseData && (
              <Card className="p-6 shadow-lg border-0">
                <h4 className="font-semibold mb-4">Course Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Current modules</span>
                    <span className="font-medium">{selectedCourseData.curriculum?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Students enrolled</span>
                    <span className="font-medium">{selectedCourseData.students}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Course status</span>
                    <Badge 
                      variant={selectedCourseData.status === 'active' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {selectedCourseData.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold"
                onClick={handleSaveModule}
                disabled={!selectedCourse || !currentModule.title.trim() || uploadedFiles.length === 0}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Module to Course
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-12"
                onClick={() => {
                  setCurrentModule({
                    id: '',
                    title: '',
                    description: '',
                    duration: '',
                    type: 'video',
                    files: [],
                    order: 1
                  });
                  setUploadedFiles([]);
                }}
              >
                Clear Form
              </Button>
            </div>

            {/* Tips */}
            <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
              <h4 className="font-semibold mb-3 text-blue-900">💡 Upload Tips</h4>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Keep video files under 500MB for best performance</li>
                <li>• Use descriptive titles for better organization</li>
                <li>• Add duration estimates to help students plan</li>
                <li>• Upload in order for sequential learning</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
