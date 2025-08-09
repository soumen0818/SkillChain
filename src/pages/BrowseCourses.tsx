import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft,
  Search,
  Filter,
  Star,
  Users,
  Clock,
  BookOpen,
  Trophy,
  Coins,
  Heart,
  Share2,
  PlayCircle,
  CheckCircle,
  Calendar,
  TrendingUp,
  Award,
  Zap,
  Target,
  Globe,
  Code2,
  Database,
  Shield,
  Palette,
  BarChart3,
  Lightbulb,
  Layers,
  FileText,
  Video,
  Brain,
  PenTool,
  ChevronDown,
  ChevronUp,
  SortAsc,
  Grid3X3,
  List,
  Eye,
  Plus
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Course {
  id: number;
  title: string;
  instructor: string;
  description: string;
  price: number;
  originalPrice?: number;
  skillTokenPrice: number;
  duration: string;
  level: string;
  rating: number;
  reviewCount: number;
  studentsEnrolled: number;
  category: string;
  tags: string[];
  thumbnail: string;
  lastUpdated: string;
  language: string;
  features: string[];
  curriculum: {
    modules: number;
    lessons: number;
    quizzes: number;
    projects: number;
  };
  instructor_info: {
    name: string;
    title: string;
    rating: number;
    courses: number;
    students: number;
    avatar: string;
  };
  isNew?: boolean;
  isBestseller?: boolean;
  isDiscounted?: boolean;
  certificateIncluded: boolean;
}

export default function BrowseCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  // Mock courses data - in real app, this would come from your backend
  const allCourses: Course[] = [
    {
      id: 101,
      title: 'Complete Blockchain Development Bootcamp',
      instructor: 'Dr. Sarah Johnson',
      description: 'Master blockchain technology from basics to advanced concepts. Build real-world DApps and smart contracts.',
      price: 199,
      originalPrice: 299,
      skillTokenPrice: 800,
      duration: '12 weeks',
      level: 'Beginner',
      rating: 4.8,
      reviewCount: 2847,
      studentsEnrolled: 15420,
      category: 'Blockchain',
      tags: ['Solidity', 'Ethereum', 'Smart Contracts', 'DApps'],
      thumbnail: 'https://images.unsplash.com/photo-1518896012122-3dcff33c6334?w=400&h=250&fit=crop',
      lastUpdated: '2024-11-15',
      language: 'English',
      features: ['Lifetime Access', 'Certificate', 'Mobile Support', '24/7 Support'],
      curriculum: { modules: 8, lessons: 64, quizzes: 16, projects: 6 },
      instructor_info: {
        name: 'Dr. Sarah Johnson',
        title: 'Blockchain Expert & Professor',
        rating: 4.9,
        courses: 12,
        students: 45000,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9f3c6c0?w=100&h=100&fit=crop&crop=face'
      },
      isNew: false,
      isBestseller: true,
      isDiscounted: true,
      certificateIncluded: true
    },
    {
      id: 102,
      title: 'Advanced Smart Contract Security',
      instructor: 'Alex Rodriguez',
      description: 'Learn to audit and secure smart contracts. Discover common vulnerabilities and best practices.',
      price: 149,
      skillTokenPrice: 600,
      duration: '8 weeks',
      level: 'Advanced',
      rating: 4.9,
      reviewCount: 1234,
      studentsEnrolled: 8760,
      category: 'Security',
      tags: ['Security', 'Auditing', 'Solidity', 'Testing'],
      thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop',
      lastUpdated: '2024-12-01',
      language: 'English',
      features: ['Expert Instruction', 'Real Projects', 'Community Access'],
      curriculum: { modules: 6, lessons: 48, quizzes: 12, projects: 4 },
      instructor_info: {
        name: 'Alex Rodriguez',
        title: 'Security Researcher',
        rating: 4.8,
        courses: 8,
        students: 23000,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      },
      isNew: true,
      certificateIncluded: true
    },
    {
      id: 103,
      title: 'DeFi Protocol Development',
      instructor: 'Maria Garcia',
      description: 'Build decentralized finance protocols from scratch. Learn about AMMs, lending protocols, and yield farming.',
      price: 179,
      skillTokenPrice: 720,
      duration: '10 weeks',
      level: 'Intermediate',
      rating: 4.7,
      reviewCount: 892,
      studentsEnrolled: 5420,
      category: 'DeFi',
      tags: ['DeFi', 'AMM', 'Lending', 'Yield Farming'],
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
      lastUpdated: '2024-10-20',
      language: 'English',
      features: ['Hands-on Projects', 'Code Reviews', 'Industry Insights'],
      curriculum: { modules: 7, lessons: 56, quizzes: 14, projects: 5 },
      instructor_info: {
        name: 'Maria Garcia',
        title: 'DeFi Architect',
        rating: 4.7,
        courses: 6,
        students: 18000,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      certificateIncluded: true
    },
    {
      id: 104,
      title: 'NFT Marketplace Development',
      instructor: 'David Kim',
      description: 'Create your own NFT marketplace using React and Solidity. Learn IPFS integration and OpenSea compatibility.',
      price: 129,
      originalPrice: 199,
      skillTokenPrice: 520,
      duration: '6 weeks',
      level: 'Intermediate',
      rating: 4.6,
      reviewCount: 567,
      studentsEnrolled: 3890,
      category: 'NFTs',
      tags: ['NFT', 'React', 'IPFS', 'Marketplace'],
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop',
      lastUpdated: '2024-11-30',
      language: 'English',
      features: ['Full Project', 'IPFS Integration', 'OpenSea Compatible'],
      curriculum: { modules: 5, lessons: 40, quizzes: 10, projects: 3 },
      instructor_info: {
        name: 'David Kim',
        title: 'Full-Stack Developer',
        rating: 4.6,
        courses: 10,
        students: 32000,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      },
      isDiscounted: true,
      certificateIncluded: true
    },
    {
      id: 105,
      title: 'Cryptocurrency Trading & Analysis',
      instructor: 'Emma Wilson',
      description: 'Master technical analysis and trading strategies for cryptocurrency markets. Risk management included.',
      price: 99,
      skillTokenPrice: 400,
      duration: '4 weeks',
      level: 'Beginner',
      rating: 4.5,
      reviewCount: 1456,
      studentsEnrolled: 12340,
      category: 'Trading',
      tags: ['Trading', 'Technical Analysis', 'Risk Management'],
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
      lastUpdated: '2024-12-05',
      language: 'English',
      features: ['Live Trading', 'Market Analysis', 'Risk Tools'],
      curriculum: { modules: 4, lessons: 32, quizzes: 8, projects: 2 },
      instructor_info: {
        name: 'Emma Wilson',
        title: 'Trading Expert',
        rating: 4.5,
        courses: 5,
        students: 28000,
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face'
      },
      isBestseller: true,
      certificateIncluded: false
    },
    {
      id: 106,
      title: 'Web3 Frontend Development',
      instructor: 'Lisa Chen',
      description: 'Build modern Web3 applications using React, TypeScript, and Web3 libraries. Connect to metamask and more.',
      price: 159,
      skillTokenPrice: 640,
      duration: '8 weeks',
      level: 'Intermediate',
      rating: 4.8,
      reviewCount: 743,
      studentsEnrolled: 6780,
      category: 'Development',
      tags: ['React', 'Web3', 'TypeScript', 'MetaMask'],
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop',
      lastUpdated: '2024-11-10',
      language: 'English',
      features: ['Modern Stack', 'Best Practices', 'Portfolio Projects'],
      curriculum: { modules: 6, lessons: 48, quizzes: 12, projects: 4 },
      instructor_info: {
        name: 'Lisa Chen',
        title: 'Frontend Architect',
        rating: 4.8,
        courses: 7,
        students: 21000,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
      },
      isNew: true,
      certificateIncluded: true
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', count: allCourses.length },
    { value: 'blockchain', label: 'Blockchain', count: allCourses.filter(c => c.category === 'Blockchain').length },
    { value: 'defi', label: 'DeFi', count: allCourses.filter(c => c.category === 'DeFi').length },
    { value: 'nfts', label: 'NFTs', count: allCourses.filter(c => c.category === 'NFTs').length },
    { value: 'security', label: 'Security', count: allCourses.filter(c => c.category === 'Security').length },
    { value: 'development', label: 'Development', count: allCourses.filter(c => c.category === 'Development').length },
    { value: 'trading', label: 'Trading', count: allCourses.filter(c => c.category === 'Trading').length }
  ];

  const getFilteredCourses = () => {
    let filtered = allCourses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category.toLowerCase() === selectedCategory);
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level.toLowerCase() === selectedLevel);
    }

    // Price filter
    filtered = filtered.filter(course => course.price >= priceRange[0] && course.price <= priceRange[1]);

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.studentsEnrolled - a.studentsEnrolled;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const CourseCard = ({ course }: { course: Course }) => {
    const discountPercentage = course.originalPrice 
      ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
      : 0;

    return (
      <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${viewMode === 'list' ? 'flex' : ''}`}>
        <div className={`relative ${viewMode === 'list' ? 'w-80 flex-shrink-0' : ''}`}>
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className={`object-cover ${viewMode === 'list' ? 'h-full w-full' : 'w-full h-48'}`}
          />
          {course.isNew && (
            <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
              New
            </Badge>
          )}
          {course.isBestseller && (
            <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600">
              Bestseller
            </Badge>
          )}
          {course.isDiscounted && (
            <Badge className="absolute bottom-2 left-2 bg-red-500 hover:bg-red-600">
              -{discountPercentage}%
            </Badge>
          )}
          <div className="absolute top-2 right-2 flex space-x-1">
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 bg-black/20 hover:bg-black/40">
              <Heart className="w-4 h-4 text-white" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 bg-black/20 hover:bg-black/40">
              <Share2 className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
        
        <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <div className="flex items-start justify-between mb-3">
            <Badge variant="secondary" className="mb-2">
              {course.category}
            </Badge>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-current text-yellow-500" />
              <span className="text-sm font-medium">{course.rating}</span>
              <span className="text-sm text-muted-foreground">({course.reviewCount})</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{course.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{course.studentsEnrolled.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <Badge variant="outline">{course.level}</Badge>
          </div>

          <div className="flex items-center space-x-3 mb-4">
            <img 
              src={course.instructor_info.avatar} 
              alt={course.instructor}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="font-medium text-sm">{course.instructor}</div>
              <div className="text-xs text-muted-foreground">{course.instructor_info.title}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {course.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {course.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{course.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary">${course.price}</span>
                {course.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${course.originalPrice}
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                or {course.skillTokenPrice} SkillTokens
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Enroll
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const filteredCourses = getFilteredCourses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/student/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-3">Discover New Courses</h1>
                <p className="text-blue-100 text-lg">
                  Expand your blockchain knowledge with expert-led courses
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold mb-2">{allCourses.length}+</div>
                <div className="text-blue-100">Available Courses</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8 shadow-lg border-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search courses, instructors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="grid md:grid-cols-4 gap-6 pt-6 border-t">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Level</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <label className="text-sm font-medium mb-2 block">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={500}
                  step={10}
                  className="mt-4"
                />
              </div>
            </div>
          )}
        </Card>

        {/* Course Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {categories.slice(1).map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.value)}
              className="h-auto py-3 flex flex-col items-center space-y-2"
            >
              <div className="w-6 h-6">
                {category.value === 'blockchain' && <Database className="w-6 h-6" />}
                {category.value === 'defi' && <TrendingUp className="w-6 h-6" />}
                {category.value === 'nfts' && <Palette className="w-6 h-6" />}
                {category.value === 'security' && <Shield className="w-6 h-6" />}
                {category.value === 'development' && <Code2 className="w-6 h-6" />}
                {category.value === 'trading' && <BarChart3 className="w-6 h-6" />}
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{category.label}</div>
                <div className="text-xs text-muted-foreground">{category.count} courses</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">
              {selectedCategory === 'all' ? 'All Courses' : categories.find(c => c.value === selectedCategory)?.label}
            </h2>
            <p className="text-muted-foreground">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {/* Course Grid/List */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card className="p-12 text-center">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Courses Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLevel('all');
                setPriceRange([0, 500]);
              }}
              variant="outline"
            >
              Clear All Filters
            </Button>
          </Card>
        )}

        {/* Featured Instructors Section */}
        {selectedCategory === 'all' && (
          <Card className="p-8 mt-12 shadow-lg border-0">
            <h3 className="text-2xl font-semibold mb-6">Featured Instructors</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {allCourses.slice(0, 3).map((course) => (
                <div key={course.instructor} className="text-center">
                  <img 
                    src={course.instructor_info.avatar} 
                    alt={course.instructor}
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  <h4 className="font-semibold">{course.instructor_info.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{course.instructor_info.title}</p>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current text-yellow-500" />
                      <span>{course.instructor_info.rating}</span>
                    </div>
                    <div>{course.instructor_info.students.toLocaleString()} students</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
