import { useState, useEffect, useMemo } from 'react';
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
import { useCourses } from '@/contexts/CourseContext';
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
    Plus,
    Loader2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BrowseCourses() {
    const { user } = useAuth();
    const { courses, loading, error, refreshCourses, enrollInCourse } = useCourses();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 1]);
    const [sortBy, setSortBy] = useState('popular');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        refreshCourses();
    }, []);

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'blockchain', label: 'Blockchain Development' },
        { value: 'smart', label: 'Smart Contracts' },
        { value: 'defi', label: 'DeFi' },
        { value: 'nft', label: 'NFTs' },
        { value: 'dao', label: 'DAO' },
        { value: 'web3', label: 'Web3 Development' },
    ];

    const levels = [
        { value: 'all', label: 'All Levels' },
        { value: 'Beginner', label: 'Beginner' },
        { value: 'Intermediate', label: 'Intermediate' },
        { value: 'Advanced', label: 'Advanced' },
        { value: 'Expert', label: 'Expert' },
    ];

    const sortOptions = [
        { value: 'popular', label: 'Most Popular' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
        { value: 'newest', label: 'Newest First' },
    ];

    // Filter courses based on active status and search criteria
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' ||
                course.category.toLowerCase().includes(selectedCategory.toLowerCase());
            const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
            const priceInETH = parseFloat(course.price) || 0;
            const matchesPrice = priceInETH >= priceRange[0] && priceInETH <= priceRange[1];
            const isActive = course.status === 'active';

            return matchesSearch && matchesCategory && matchesLevel && matchesPrice && isActive;
        });
    }, [courses, searchTerm, selectedCategory, selectedLevel, priceRange]);

    // Sort courses
    const sortedCourses = useMemo(() => {
        return [...filteredCourses].sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'price_low':
                    return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
                case 'price_high':
                    return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'popular':
                default:
                    return b.students - a.students;
            }
        });
    }, [filteredCourses, sortBy]);

    const handleEnroll = async (courseId: string) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await enrollInCourse(courseId);
            // Show success message or redirect
        } catch (err) {
            console.error('Enrollment failed:', err);
        }
    };

    const renderCourseCard = (course: any) => (
        <Card key={course.id || course._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
                <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop'}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                    <Badge variant="secondary">{course.level}</Badge>
                </div>
                <div className="absolute top-2 right-2">
                    <Button variant="ghost" size="sm" className="text-white hover:text-red-500">
                        <Heart className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{course.category}</span>
                    <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{course.rating || 0}</span>
                        <span className="text-muted-foreground ml-1">({course.reviews || 0})</span>
                    </div>
                </div>

                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>

                <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="mr-4">{course.students} students</span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.duration}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">{course.price} ETH</span>
                        <Badge variant="outline" className="text-green-600">
                            +{course.skillTokenReward} SKILL
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        className="flex-1 gradient-primary"
                        onClick={() => handleEnroll(course.id || course._id)}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <>Enroll Now</>
                        )}
                    </Button>
                    <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );

    if (loading && courses.length === 0) {
        return (
            <div className="min-h-screen bg-background pt-20 pb-16 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p>Loading courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-3xl font-bold">Browse Courses</h1>
                        <p className="text-muted-foreground">
                            Discover {courses.length} courses to master Web3 and blockchain technology
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        >
                            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-1/4">
                        <Card className="p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Filters</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden"
                                >
                                    <Filter className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                                {/* Search */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Search</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                        <Input
                                            placeholder="Search courses..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Category</label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Level */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Level</label>
                                    <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {levels.map((level) => (
                                                <SelectItem key={level.value} value={level.value}>
                                                    {level.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Price Range (ETH): {priceRange[0]} - {priceRange[1]}
                                    </label>
                                    <Slider
                                        value={priceRange}
                                        onValueChange={setPriceRange}
                                        max={1}
                                        min={0}
                                        step={0.01}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Sort and Results */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-muted-foreground">
                                Showing {sortedCourses.length} of {courses.length} courses
                            </p>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-muted-foreground">Sort by:</span>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600">Error loading courses: {error}</p>
                                <Button
                                    variant="outline"
                                    onClick={refreshCourses}
                                    className="mt-2"
                                    disabled={loading}
                                >
                                    Retry
                                </Button>
                            </div>
                        )}

                        {/* Courses Grid */}
                        {sortedCourses.length > 0 ? (
                            <div className={viewMode === 'grid'
                                ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                                : "space-y-6"
                            }>
                                {sortedCourses.map(renderCourseCard)}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                                <p className="text-muted-foreground">
                                    Try adjusting your filters or search terms
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
