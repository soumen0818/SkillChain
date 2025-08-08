import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SEO from '@/components/SEO';
import { BookOpen, Clock, Star, Users, Award } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  rating: number;
  students: number;
  category: 'blockchain' | 'smart-contracts' | 'defi' | 'nft' | 'dao';
  thumbnail: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

const allCourses: Course[] = [
  { id: 1, title: 'Blockchain Fundamentals', instructor: 'Dr. Sarah Johnson', duration: '8 weeks', rating: 4.8, students: 1200, category: 'blockchain', level: 'Beginner', thumbnail: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&auto=format&fit=crop&q=60' },
  { id: 2, title: 'Smart Contracts with Solidity', instructor: 'Mark Thompson', duration: '10 weeks', rating: 4.9, students: 950, category: 'smart-contracts', level: 'Intermediate', thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&auto=format&fit=crop&q=60' },
  { id: 3, title: 'DeFi Protocols and Yield Farming', instructor: 'Priya Patel', duration: '6 weeks', rating: 4.7, students: 800, category: 'defi', level: 'Advanced', thumbnail: 'https://images.unsplash.com/photo-1616077168079-7e09a6772e65?w=800&auto=format&fit=crop&q=60' },
  { id: 4, title: 'Create and Mint NFT Collections', instructor: 'Lisa Chen', duration: '5 weeks', rating: 4.6, students: 1020, category: 'nft', level: 'Beginner', thumbnail: 'https://images.unsplash.com/photo-1620207418302-439b387441b0?w=800&auto=format&fit=crop&q=60' },
  { id: 5, title: 'DAO Governance Design', instructor: 'Ethan Brown', duration: '7 weeks', rating: 4.8, students: 640, category: 'dao', level: 'Intermediate', thumbnail: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=800&auto=format&fit=crop&q=60' },
  { id: 6, title: 'Web3 DApps with React & Ethers', instructor: 'Maria Garcia', duration: '9 weeks', rating: 4.7, students: 1100, category: 'smart-contracts', level: 'Intermediate', thumbnail: 'https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&auto=format&fit=crop&q=60' },
];

export default function Courses() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'popular' | 'rating' | 'newest'>('popular');

  const filtered = useMemo(() => {
    let data = allCourses.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));
    if (sort === 'rating') data = [...data].sort((a,b) => b.rating - a.rating);
    if (sort === 'popular') data = [...data].sort((a,b) => b.students - a.students);
    return data;
  }, [query, sort]);

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'blockchain', label: 'Blockchain' },
    { key: 'smart-contracts', label: 'Smart Contracts' },
    { key: 'defi', label: 'DeFi' },
    { key: 'nft', label: 'NFTs' },
    { key: 'dao', label: 'DAO' },
  ] as const;

  const renderCards = (items: Course[]) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((course, idx) => (
        <Card key={course.id} className="overflow-hidden hover:shadow-elevation animate-scale-in" style={{ animationDelay: `${idx * 40}ms` }}>
          <img src={course.thumbnail} alt={`${course.title} course banner`} loading="lazy" className="w-full h-44 object-cover" />
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{course.level}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-primary mr-1" /> {course.rating}
              </div>
            </div>
            <h3 className="font-semibold text-lg">{course.title}</h3>
            <p className="text-sm text-muted-foreground">By {course.instructor}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" /> {course.duration}</span>
              <span className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4" /> {course.students.toLocaleString()}</span>
            </div>
            <Button className="w-full gradient-primary">Enroll & Earn SkillTokens</Button>
          </div>
        </Card>
      ))}
    </div>
  );

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
                <p className="text-3xl font-bold">100K+</p>
                <p className="text-sm text-muted-foreground">Free Courses</p>
              </div>
              <div>
                <p className="text-3xl font-bold">1,000+</p>
                <p className="text-sm text-muted-foreground">Expert Mentors</p>
              </div>
              <div>
                <p className="text-3xl font-bold">1M+</p>
                <p className="text-sm text-muted-foreground">Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mt-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex-1 max-w-xl">
              <Input placeholder="Search courses (e.g., Smart Contracts)" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <Select value={sort} onValueChange={(v: any) => setSort(v)}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Sort by" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="flex flex-wrap gap-2">
              {categories.map(c => (
                <TabsTrigger key={c.key} value={c.key}>{c.label}</TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">{renderCards(filtered)}</TabsContent>
            <TabsContent value="blockchain">{renderCards(filtered.filter(c => c.category === 'blockchain'))}</TabsContent>
            <TabsContent value="smart-contracts">{renderCards(filtered.filter(c => c.category === 'smart-contracts'))}</TabsContent>
            <TabsContent value="defi">{renderCards(filtered.filter(c => c.category === 'defi'))}</TabsContent>
            <TabsContent value="nft">{renderCards(filtered.filter(c => c.category === 'nft'))}</TabsContent>
            <TabsContent value="dao">{renderCards(filtered.filter(c => c.category === 'dao'))}</TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
