import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useCourses } from '@/contexts/CourseContext';
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
  Plus,
  Eye,
  Settings,
  Share2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { listings, getActiveListing } = useMarketplace();
  const { enrolledCourses, refreshEnrolledCourses, loading } = useCourses();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showMyListings, setShowMyListings] = useState(false);

  // Load enrolled courses when component mounts
  useEffect(() => {
    if (user) {
      refreshEnrolledCourses().catch(error => {
        console.error('Error loading enrolled courses:', error);
      });
    }
  }, [user, refreshEnrolledCourses]);

  const stats = [
    { icon: BookOpen, label: 'Courses Enrolled', value: (enrolledCourses?.length || 0).toString(), color: 'text-blue-600' },
    { icon: Trophy, label: 'Certificates Earned', value: '3', color: 'text-green-600' },
    { icon: Coins, label: 'SkillTokens', value: '3,750', color: 'text-primary' },
    { icon: TrendingUp, label: 'Learning Streak', value: '18 days', color: 'text-purple-600' }
  ];

  const certificates = [
    {
      id: 1,
      title: 'NFT Art Creation Mastery',
      date: '2024-01-15',
      tokenId: '#NFT-001',
      value: '0.12 ETH',
      category: 'nft'
    },
    {
      id: 2,
      title: 'Blockchain Fundamentals',
      date: '2024-02-20',
      tokenId: '#NFT-002',
      value: '0.08 ETH',
      category: 'blockchain'
    },
    {
      id: 3,
      title: 'Metaverse Development',
      date: '2024-03-10',
      tokenId: '#NFT-003',
      value: '0.18 ETH',
      category: 'metaverse'
    }
  ];

  // Filter active marketplace listings
  const activeMarketplaceListings = listings.filter(listing => listing.status === 'active');
  const myListings = listings.filter(listing =>
    listing.seller === user?.username && listing.status === 'active'
  );
  const displayedListings = showMyListings ? myListings : activeMarketplaceListings;

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Continue your learning journey and earn more SkillTokens
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 transform transition-all duration-300 cursor-pointer group border-0 bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm group-hover:text-primary/80 transition-colors duration-300">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{stat.value}</p>
                </div>
                <div className="transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <stat.icon className={`w-8 h-8 ${stat.color} group-hover:drop-shadow-lg`} />
                </div>
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
              <Card className="p-6 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transform transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/30">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Continue Learning</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/my-learning-journey')}
                    className="hover:bg-blue-100 hover:text-blue-700 hover:scale-105 transition-all duration-300 hover:shadow-md"
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {courses.slice(0, 2).map((course) => (
                    <div key={course.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 animate-smooth">
                      <div className="relative">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="absolute -top-1 -right-1">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            course.category === 'blockchain' ? 'bg-blue-100 text-blue-800' :
                            course.category === 'web3' ? 'bg-green-100 text-green-800' :
                            course.category === 'nft' ? 'bg-purple-100 text-purple-800' :
                            course.category === 'defi' ? 'bg-orange-100 text-orange-800' :
                            course.category === 'trading' ? 'bg-red-100 text-red-800' :
                            'bg-pink-100 text-pink-800'
                          }`}>
                            {course.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">{course.instructor}</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          Module {Math.ceil((course.progress / 100) * course.totalModules)}/{course.totalModules} • {course.currentModule}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Progress value={course.progress} className="flex-1" />
                          <span className="text-sm text-muted-foreground">{course.progress}%</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {course.topics.slice(0, 2).map((topic, index) => (
                            <span key={index} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {topic}
                            </span>
                          ))}
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
              <Card className="p-6 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-1 transform transition-all duration-300 border-0 bg-gradient-to-br from-white to-green-50/30">
                <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 hover:bg-green-50 hover:shadow-md hover:-translate-y-0.5 p-3 rounded-lg transform transition-all duration-300 cursor-pointer group">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
                      <Trophy className="w-5 h-5 text-green-600 group-hover:animate-bounce" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-green-700 transition-colors duration-300">Certificate Earned</p>
                      <p className="text-sm text-muted-foreground">NFT Art Creation - Advanced Level</p>
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-green-600 transition-colors duration-300">2h ago</span>
                  </div>
                  <div className="flex items-center space-x-4 hover:bg-blue-50 hover:shadow-md hover:-translate-y-0.5 p-3 rounded-lg transform transition-all duration-300 cursor-pointer group">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300">
                      <Coins className="w-5 h-5 text-primary group-hover:animate-spin" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-primary transition-colors duration-300">SkillTokens Earned</p>
                      <p className="text-sm text-muted-foreground">+250 ST for completing module</p>
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors duration-300">1d ago</span>
                  </div>
                  <div className="flex items-center space-x-4 hover:bg-blue-50 hover:shadow-md hover:-translate-y-0.5 p-3 rounded-lg transform transition-all duration-300 cursor-pointer group">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                      <BookOpen className="w-5 h-5 text-blue-600 group-hover:animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-blue-700 transition-colors duration-300">New Course Enrolled</p>
                      <p className="text-sm text-muted-foreground">Advanced Smart Contract Security</p>
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-blue-600 transition-colors duration-300">3d ago</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Skill Progress Chart */}
            <Card className="p-6 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 transform transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50/30">
              <h3 className="text-xl font-semibold mb-6">Learning Progress by Category</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2 group hover:bg-blue-50 hover:shadow-lg hover:-translate-y-1 p-4 rounded-lg transform transition-all duration-300 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-2 group-hover:scale-125 transition-transform duration-300"></span>
                      Blockchain Development
                    </span>
                    <span className="text-sm text-muted-foreground group-hover:text-blue-600 transition-colors duration-300">75%</span>
                  </div>
                  <Progress value={75} className="group-hover:scale-105 transition-transform duration-300" />
                  <p className="text-xs text-muted-foreground group-hover:text-blue-600 transition-colors duration-300">Smart Contracts, DeFi, Consensus</p>
                </div>
                <div className="space-y-2 group hover:bg-green-50 hover:shadow-lg hover:-translate-y-1 p-4 rounded-lg transform transition-all duration-300 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2 group-hover:scale-125 transition-transform duration-300"></span>
                      Web3 Development
                    </span>
                    <span className="text-sm text-muted-foreground group-hover:text-green-600 transition-colors duration-300">45%</span>
                  </div>
                  <Progress value={45} className="group-hover:scale-105 transition-transform duration-300" />
                  <p className="text-xs text-muted-foreground group-hover:text-green-600 transition-colors duration-300">React, Web3.js, DApp Frontend</p>
                </div>
                <div className="space-y-2 group hover:bg-purple-50 hover:shadow-lg hover:-translate-y-1 p-4 rounded-lg transform transition-all duration-300 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center">
                      <span className="w-3 h-3 bg-purple-500 rounded-full mr-2 group-hover:scale-125 transition-transform duration-300"></span>
                      NFT & Digital Art
                    </span>
                    <span className="text-sm text-muted-foreground group-hover:text-purple-600 transition-colors duration-300">90%</span>
                  </div>
                  <Progress value={90} className="group-hover:scale-105 transition-transform duration-300" />
                  <p className="text-xs text-muted-foreground group-hover:text-purple-600 transition-colors duration-300">Art Creation, Minting, Metadata</p>
                </div>
                <div className="space-y-2 group hover:bg-orange-50 hover:shadow-lg hover:-translate-y-1 p-4 rounded-lg transform transition-all duration-300 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center">
                      <span className="w-3 h-3 bg-orange-500 rounded-full mr-2 group-hover:scale-125 transition-transform duration-300"></span>
                      DeFi Protocols
                    </span>
                    <span className="text-sm text-muted-foreground group-hover:text-orange-600 transition-colors duration-300">30%</span>
                  </div>
                  <Progress value={30} className="group-hover:scale-105 transition-transform duration-300" />
                  <p className="text-xs text-muted-foreground group-hover:text-orange-600 transition-colors duration-300">Yield Farming, AMM, Liquidity</p>
                </div>
                <div className="space-y-2 group hover:bg-red-50 hover:shadow-lg hover:-translate-y-1 p-4 rounded-lg transform transition-all duration-300 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2 group-hover:scale-125 transition-transform duration-300"></span>
                      Trading & Analytics
                    </span>
                    <span className="text-sm text-muted-foreground group-hover:text-red-600 transition-colors duration-300">60%</span>
                  </div>
                  <Progress value={60} className="group-hover:scale-105 transition-transform duration-300" />
                  <p className="text-xs text-muted-foreground group-hover:text-red-600 transition-colors duration-300">Technical Analysis, Risk Management</p>
                </div>
                <div className="space-y-2 group hover:bg-pink-50 hover:shadow-lg hover:-translate-y-1 p-4 rounded-lg transform transition-all duration-300 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center">
                      <span className="w-3 h-3 bg-pink-500 rounded-full mr-2 group-hover:scale-125 transition-transform duration-300"></span>
                      Metaverse Development
                    </span>
                    <span className="text-sm text-muted-foreground group-hover:text-pink-600 transition-colors duration-300">85%</span>
                  </div>
                  <Progress value={85} className="group-hover:scale-105 transition-transform duration-300" />
                  <p className="text-xs text-muted-foreground group-hover:text-pink-600 transition-colors duration-300">3D Modeling, VR/AR, Virtual Worlds</p>
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
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Browse Courses
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-elevation animate-smooth">
                  <div className="relative">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.category === 'blockchain' ? 'bg-blue-100 text-blue-800' :
                        course.category === 'web3' ? 'bg-green-100 text-green-800' :
                        course.category === 'nft' ? 'bg-purple-100 text-purple-800' :
                        course.category === 'defi' ? 'bg-orange-100 text-orange-800' :
                        course.category === 'trading' ? 'bg-red-100 text-red-800' :
                        'bg-pink-100 text-pink-800'
                      }`}>
                        {course.category.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-semibold text-lg mb-2">{course.title}</h4>
                    <p className="text-muted-foreground text-sm mb-3">{course.instructor}</p>
                    <p className="text-xs text-muted-foreground mb-4">{course.skillLevel}</p>
                    
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
                        <p className="text-sm font-medium">Current Module:</p>
                        <p className="text-sm text-muted-foreground">{course.currentModule} ({course.progress > 0 ? Math.ceil((course.progress / 100) * course.totalModules) : 1}/{course.totalModules})</p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Next Lesson:</p>
                        <p className="text-sm text-muted-foreground">{course.nextLesson}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Key Topics:</p>
                        <div className="flex flex-wrap gap-1">
                          {course.topics.slice(0, 3).map((topic, index) => (
                            <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                              {topic}
                            </span>
                          ))}
                          {course.topics.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{course.topics.length - 3} more</span>
                          )}
                        </div>
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
              <Button 
                variant="outline"
                className="hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <Wallet className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                View in Wallet
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => {
                const isListed = getActiveListing(cert.id.toString());
                return (
                <Card key={cert.id} className="p-6 hover:shadow-elevation animate-smooth relative">
                  {isListed && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Listed for Sale
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <Award className="w-12 h-12 text-primary" />
                    <div className="flex flex-col items-end space-y-1">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">NFT</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        cert.category === 'blockchain' ? 'bg-blue-100 text-blue-800' :
                        cert.category === 'web3' ? 'bg-green-100 text-green-800' :
                        cert.category === 'nft' ? 'bg-purple-100 text-purple-800' :
                        cert.category === 'defi' ? 'bg-orange-100 text-orange-800' :
                        cert.category === 'trading' ? 'bg-red-100 text-red-800' :
                        'bg-pink-100 text-pink-800'
                      }`}>
                        {cert.category}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{cert.title}</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Token ID: {cert.tokenId}</p>
                    <p>Earned: {new Date(cert.date).toLocaleDateString()}</p>
                    <p className="font-medium text-foreground">Market Value: {cert.value}</p>
                    {isListed && (
                      <p className="font-medium text-green-600">
                        Listed for: {isListed.price} {isListed.currency}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate(`/verify-certificate/${cert.id}`)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify
                    </Button>
                    <Button 
                      size="sm" 
                      className={`flex-1 ${isListed ? 'bg-gray-400 cursor-not-allowed' : 'gradient-primary'}`}
                      onClick={() => !isListed && navigate(`/list-certificate/${cert.id}`)}
                      disabled={!!isListed}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {isListed ? 'Listed' : 'List for Sale'}
                    </Button>
                  </div>
                </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold">
                  {showMyListings ? 'My Listings' : 'Certificate Marketplace'}
                </h3>
                <p className="text-muted-foreground">
                  {showMyListings
                    ? `You have ${myListings.length} active listing${myListings.length !== 1 ? 's' : ''}`
                    : `${displayedListings.length} certificates available for purchase`
                  }
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={showMyListings ? "default" : "outline"}
                  onClick={() => setShowMyListings(!showMyListings)}
                  className="hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <Users className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  {showMyListings ? 'View All' : 'My Listings'}
                </Button>
                <Button 
                  className="gradient-primary hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 hover:-translate-y-1"
                  onClick={() => navigate('/list-certificate/new')}
                >
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  List Certificate
                </Button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedListings.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h4 className="text-lg font-semibold mb-2">
                    {showMyListings ? 'No Active Listings' : 'No Certificates Available'}
                  </h4>
                  <p className="text-muted-foreground mb-6">
                    {showMyListings
                      ? 'You haven\'t listed any certificates yet. Start by listing your first certificate!'
                      : 'Be the first to list a certificate in the marketplace.'
                    }
                  </p>
                  {showMyListings && (
                    <Button 
                      className="gradient-primary hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 hover:-translate-y-0.5"
                      onClick={() => navigate('/list-certificate/new')}
                    >
                      <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                      List Your First Certificate
                    </Button>
                  )}
                </div>
              ) : (
                displayedListings.map((item) => (
                  <Card key={item.id} className="p-6 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 transform transition-all duration-300 group relative border-0 bg-gradient-to-br from-white to-gray-50">
                    {/* Seller badge for owned listings */}
                    {item.seller === user?.username && (
                      <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center group-hover:scale-110 transition-transform duration-300">
                        <Star className="w-3 h-3 mr-1 group-hover:animate-pulse" />
                        Your Listing
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <Trophy className="w-12 h-12 text-primary group-hover:text-primary/80 group-hover:rotate-12 transition-all duration-300" />
                      <div className="text-right">
                        <span className={`inline-block text-xs px-2 py-1 rounded mb-2 ${
                          item.category === 'blockchain' ? 'bg-blue-100 text-blue-800' :
                          item.category === 'web3' ? 'bg-green-100 text-green-800' :
                          item.category === 'nft' ? 'bg-purple-100 text-purple-800' :
                          item.category === 'defi' ? 'bg-orange-100 text-orange-800' :
                          item.category === 'trading' ? 'bg-red-100 text-red-800' :
                          'bg-pink-100 text-pink-800'
                        }`}>
                          {item.category}
                        </span>
                        <div>
                          <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                            {item.price} {item.currency}
                          </p>
                          {item.alternativePrice && (
                            <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                              or {item.alternativePrice} {item.alternativeCurrency}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground mb-4">
                      <p>Seller: <span className="group-hover:text-foreground transition-colors duration-300">{item.seller}</span></p>
                      <p>Issuer: <span className="group-hover:text-foreground transition-colors duration-300">{item.issuer}</span></p>
                      <p>Grade: <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">{item.grade}</span></p>
                      <div className="flex items-center justify-between">
                        <span>Rarity:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.rarity === 'Common' ? 'bg-gray-100 text-gray-800' :
                          item.rarity === 'Rare' ? 'bg-blue-100 text-blue-800' :
                          item.rarity === 'Epic' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.rarity}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {item.seller === user?.username ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 group/btn"
                        >
                          <Settings className="w-4 h-4 mr-2 group-hover/btn:animate-spin" />
                          Manage
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 group/btn"
                          onClick={() => navigate(`/certificate-details/${item.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                          View Details
                        </Button>
                      )}

                      {item.seller !== user?.username ? (
                        <Button 
                          size="sm" 
                          className="flex-1 gradient-primary hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 group/btn"
                          onClick={() => navigate('/wallet', { 
                            state: { 
                              purchaseData: {
                                certificateId: item.id,
                                title: item.title,
                                price: item.price,
                                currency: item.currency,
                                seller: item.seller
                              }
                            }
                          })}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                          Buy Now
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 hover:bg-secondary hover:text-secondary-foreground hover:shadow-lg hover:shadow-secondary/30 hover:scale-105 transform transition-all duration-300 group/btn"
                        >
                          <Share2 className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                          Share
                        </Button>
                      )}
                    </div>

                    {/* Market stats */}
                    <div className="mt-4 pt-4 border-t border-gray-100 group-hover:border-primary/20 transition-colors duration-300">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="flex items-center group-hover:text-foreground transition-colors duration-300">
                          <Eye className="w-3 h-3 mr-1 group-hover:animate-pulse" />
                          {item.views} views
                        </span>
                        <span className="flex items-center group-hover:text-foreground transition-colors duration-300">
                          <Clock className="w-3 h-3 mr-1" />
                          {Math.floor((Date.now() - new Date(item.listingDate).getTime()) / (1000 * 60 * 60 * 24))}d ago
                        </span>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}