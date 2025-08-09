import { useMemo, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SEO from '@/components/SEO';
import { useCourses } from '@/contexts/CourseContext';
import { BookOpen, Clock, Star, Users, Award, Loader2 } from 'lucide-react';

export default function Courses() {
    const { courses, loading, error, refreshCourses, enrollInCourse } = useCourses();
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<'popular' | 'rating' | 'newest'>('popular');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        // Refresh courses when component mounts
        refreshCourses();
    }, []);

    const filtered = useMemo(() => {
        let data = courses.filter(c =>
            c.status === 'active' && // Only show active courses
            c.title.toLowerCase().includes(query.toLowerCase()) &&
            (selectedCategory === 'all' || c.category.toLowerCase().includes(selectedCategory.toLowerCase()))
        );

        if (sort === 'rating') data = [...data].sort((a, b) => b.rating - a.rating);
        if (sort === 'popular') data = [...data].sort((a, b) => b.students - a.students);
        if (sort === 'newest') data = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return data;
    }, [courses, query, sort, selectedCategory]);

    const categories = [
        { key: 'all', label: 'All' },
        { key: 'blockchain', label: 'Blockchain' },
        { key: 'smart', label: 'Smart Contracts' },
        { key: 'defi', label: 'DeFi' },
        { key: 'nft', label: 'NFTs' },
        { key: 'dao', label: 'DAO' },
        { key: 'web3', label: 'Web3' },
    ] as const;

    const handleEnroll = async (courseId: string) => {
        try {
            await enrollInCourse(courseId);
        } catch (err) {
            console.error('Enrollment failed:', err);
        }
    };

    const renderCards = (items: any[]) => (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((course, idx) => (
                <Card key={course.id || course._id} className="overflow-hidden hover:shadow-elevation animate-scale-in" style={{ animationDelay: `${idx * 40}ms` }}>
                    <img
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=200&fit=crop'}
                        alt={`${course.title} course banner`}
                        loading="lazy"
                        className="w-full h-44 object-cover"
                    />
                    <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between">
                            <Badge variant="secondary">{course.level}</Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Star className="w-4 h-4 text-primary mr-1" /> {course.rating || 0}
                            </div>
                        </div>
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">
                            By {course.teacher?.username || 'SkillChain Instructor'}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4" /> {course.duration}
                            </span>
                            <span className="flex items-center gap-2 text-muted-foreground">
                                <Users className="w-4 h-4" /> {course.students}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{course.price} ETH</span>
                            <span className="text-green-600 font-medium">+{course.skillTokenReward} SKILL</span>
                        </div>
                        <Button
                            className="w-full gradient-primary"
                            onClick={() => handleEnroll(course.id || course._id)}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <>Enroll & Earn SkillTokens</>
                            )}
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
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
            <SEO
                title="SkillChain Courses | Learn Web3 & Blockchain"
                description="Explore blockchain, DeFi, NFTs, smart contracts, and DAO governance courses. Earn NFT certificates and SkillTokens as you learn."
            />
            <header className="px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4 animate-fade-in-up">
                        <h1 className="text-4xl font-bold">Learn Web3. Earn Credentials.</h1>
                        <p className="text-muted-foreground">Complete courses to mint NFT certificates and earn SkillTokens you can trade or stake for governance.</p>
                        <div className="flex gap-3">
                            <Badge className="gradient-primary text-white"><Award className="w-4 h-4 mr-1" /> NFT Certificates</Badge>
                            <Badge variant="outline">Learn-to-Earn</Badge>
                        </div>
                    </div>
                    <div className="rounded-2xl p-6 gradient-secondary shadow-elevation animate-scale-in">
                        <div className="grid sm:grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-3xl font-bold">{courses.length}</p>
                                <p className="text-sm text-muted-foreground">Active Courses</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{courses.reduce((sum, course) => sum + course.students, 0)}</p>
                                <p className="text-sm text-muted-foreground">Students</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{courses.reduce((sum, course) => sum + course.certificates, 0)}</p>
                                <p className="text-sm text-muted-foreground">Certificates</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
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

                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    <Input
                        placeholder="Search courses..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1"
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full lg:w-48">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat.key} value={cat.key}>{cat.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={sort} onValueChange={(value: any) => setSort(value)}>
                        <SelectTrigger className="w-full lg:w-48">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="popular">Most Popular</SelectItem>
                            <SelectItem value="rating">Highest Rated</SelectItem>
                            <SelectItem value="newest">Newest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-6 mb-8">
                        {categories.map(cat => (
                            <TabsTrigger
                                key={cat.key}
                                value={cat.key}
                                onClick={() => setSelectedCategory(cat.key)}
                            >
                                {cat.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {categories.map(cat => (
                        <TabsContent key={cat.key} value={cat.key}>
                            {filtered.length > 0 ? (
                                renderCards(filtered)
                            ) : (
                                <div className="text-center py-12">
                                    <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                                    <p className="text-muted-foreground">
                                        {query ? 'Try adjusting your search terms' : 'No courses available in this category yet'}
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </main>
        </div>
    );
}
