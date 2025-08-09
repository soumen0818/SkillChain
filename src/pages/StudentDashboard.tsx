import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  Trophy, 
  Coins, 
  TrendingUp, 
  PlayCircle,
  Clock,
  Star,
  Award,
  Wallet,
  ShoppingCart,
  Users,
  BarChart3,
  Calendar,
  CheckCircle,
  Plus
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { icon: BookOpen, label: 'Courses Enrolled', value: '12', color: 'text-blue-600' },
    { icon: Trophy, label: 'Certificates Earned', value: '8', color: 'text-green-600' },
    { icon: Coins, label: 'SkillTokens', value: '2,450', color: 'text-primary' },
    { icon: TrendingUp, label: 'Learning Streak', value: '24 days', color: 'text-purple-600' }
  ];

  const courses = [
    {
      id: 1,
      title: 'Blockchain Fundamentals',
      instructor: 'Dr. Sarah Johnson',
      progress: 75,
      duration: '8 weeks',
      nextLesson: 'Smart Contracts Introduction',
      thumbnail: 'https://images.unsplash.com/photo-1518896012122-3dcff33c6334?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Web3 Development',
      instructor: 'Mark Thompson',
      progress: 45,
      duration: '12 weeks',
      nextLesson: 'Building DApps with React',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'NFT Art Creation',
      instructor: 'Lisa Chen',
      progress: 90,
      duration: '6 weeks',
      nextLesson: 'Final Project Review',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=200&fit=crop'
    }
  ];

  const certificates = [
    {
      id: 1,
      title: 'Introduction to Cryptocurrency',
      date: '2024-01-15',
      tokenId: '#NFT-001',
      value: '0.1 ETH'
    },
    {
      id: 2,
      title: 'DeFi Basics',
      date: '2024-02-20',
      tokenId: '#NFT-002',
      value: '0.15 ETH'
    }
  ];

  const marketplace = [
    {
      id: 1,
      title: 'Advanced Solidity Certificate',
      seller: 'john.eth',
      price: '0.2 ETH',
      skillTokens: '500 ST'
    },
    {
      id: 2,
      title: 'UI/UX Design Mastery',
      seller: 'designer.eth',
      price: '0.18 ETH',
      skillTokens: '400 ST'
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Continue your learning journey and earn more SkillTokens
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-elevation animate-smooth">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Continue Learning */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Continue Learning</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/my-courses')}
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {courses.slice(0, 2).map((course) => (
                    <div key={course.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 animate-smooth">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">{course.instructor}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Progress value={course.progress} className="flex-1" />
                          <span className="text-sm text-muted-foreground">{course.progress}%</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="gradient-primary"
                        onClick={() => navigate(`/course-study/${course.id}`)}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Continue
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Certificate Earned</p>
                      <p className="text-sm text-muted-foreground">NFT Art Creation - Advanced Level</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2h ago</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <Coins className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">SkillTokens Earned</p>
                      <p className="text-sm text-muted-foreground">+250 ST for completing module</p>
                    </div>
                    <span className="text-xs text-muted-foreground">1d ago</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">New Course Enrolled</p>
                      <p className="text-sm text-muted-foreground">Advanced Smart Contract Security</p>
                    </div>
                    <span className="text-xs text-muted-foreground">3d ago</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Skill Progress Chart */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Learning Progress</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Blockchain Development</span>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Smart Contracts</span>
                    <span className="text-sm text-muted-foreground">60%</span>
                  </div>
                  <Progress value={60} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">DeFi Protocols</span>
                    <span className="text-sm text-muted-foreground">40%</span>
                  </div>
                  <Progress value={40} />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">My Courses</h3>
              <Button 
                className="gradient-primary"
                onClick={() => navigate('/browse-courses')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Browse Courses
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-elevation animate-smooth">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h4 className="font-semibold text-lg mb-2">{course.title}</h4>
                    <p className="text-muted-foreground text-sm mb-4">{course.instructor}</p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{course.duration}</span>
                        </div>
                        <span className="text-primary font-medium">{course.progress}% complete</span>
                      </div>
                      <Progress value={course.progress} />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Next Lesson:</p>
                        <p className="text-sm text-muted-foreground">{course.nextLesson}</p>
                      </div>
                      <Button 
                        className="w-full gradient-primary"
                        onClick={() => navigate(`/course-study/${course.id}`)}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Continue Learning
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">My NFT Certificates</h3>
              <Button variant="outline">
                <Wallet className="w-4 h-4 mr-2" />
                View in Wallet
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <Card key={cert.id} className="p-6 hover:shadow-elevation animate-smooth">
                  <div className="flex items-start justify-between mb-4">
                    <Award className="w-12 h-12 text-primary" />
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">NFT</span>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{cert.title}</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Token ID: {cert.tokenId}</p>
                    <p>Earned: {new Date(cert.date).toLocaleDateString()}</p>
                    <p className="font-medium text-foreground">Market Value: {cert.value}</p>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify
                    </Button>
                    <Button size="sm" className="flex-1 gradient-primary">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      List for Sale
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Certificate Marketplace</h3>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  My Listings
                </Button>
                <Button className="gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  List Certificate
                </Button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplace.map((item) => (
                <Card key={item.id} className="p-6 hover:shadow-elevation animate-smooth">
                  <div className="flex items-start justify-between mb-4">
                    <Trophy className="w-12 h-12 text-primary" />
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{item.price}</p>
                      <p className="text-sm text-muted-foreground">or {item.skillTokens}</p>
                    </div>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                  <p className="text-muted-foreground text-sm mb-4">Seller: {item.seller}</p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Star className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1 gradient-primary">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}