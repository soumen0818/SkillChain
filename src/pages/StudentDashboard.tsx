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
                    onClick={() => navigate('/my-learning-journey')}
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {!enrolledCourses || enrolledCourses.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No courses enrolled yet.</p>
                      <Button
                        className="gradient-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate('/browse-courses');
                        }}
                      >
                        Browse Courses
                      </Button>
                    </div>
                  ) : (
                    enrolledCourses.slice(0, 2).map((course) => (
                      <div key={course.id || course._id} className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 animate-smooth">
                        <div className="relative">
                          <img
                            src={course.thumbnail || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=200&fit=crop'}
                            alt={course.title || 'Course'}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="absolute -top-1 -right-1">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${course.category === 'blockchain' ? 'bg-blue-100 text-blue-800' :
                              course.category === 'web3' ? 'bg-green-100 text-green-800' :
                                course.category === 'nft' ? 'bg-purple-100 text-purple-800' :
                                  course.category === 'defi' ? 'bg-orange-100 text-orange-800' :
                                    course.category === 'trading' ? 'bg-red-100 text-red-800' :
                                      'bg-pink-100 text-pink-800'
                              }`}>
                              {course.category || 'General'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{course.title || 'Untitled Course'}</h4>
                          <p className="text-sm text-muted-foreground">{course.teacher?.username || 'Unknown Instructor'}</p>
                          <p className="text-xs text-muted-foreground mb-2">
                            {course.modules || 0} modules • {course.totalLessons || 0} lessons
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Progress value={course.completion || 0} className="flex-1" />
                            <span className="text-sm text-muted-foreground">{course.completion || 0}%</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {course.level || 'Beginner'}
                            </span>
                            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                              {course.skillTokenReward || 0} SKILL
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="gradient-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/course-study/${course.id || course._id}`);
                          }}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Continue
                        </Button>
                      </div>
                    ))
                  )}
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
              <h3 className="text-xl font-semibold mb-6">Learning Progress by Category</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      Blockchain Development
                    </span>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <Progress value={75} />
                  <p className="text-xs text-muted-foreground">Smart Contracts, DeFi, Consensus</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Web3 Development
                    </span>
                    <span className="text-sm text-muted-foreground">45%</span>
                  </div>
                  <Progress value={45} />
                  <p className="text-xs text-muted-foreground">React, Web3.js, DApp Frontend</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center">
                      <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                      NFT & Digital Art
                    </span>
                    <span className="text-sm text-muted-foreground">90%</span>
                  </div>
                  <Progress value={90} />
                  <p className="text-xs text-muted-foreground">Art Creation, Minting, Metadata</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center">
                      <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                      DeFi Protocols
                    </span>
                    <span className="text-sm text-muted-foreground">30%</span>
                  </div>
                  <Progress value={30} />
                  <p className="text-xs text-muted-foreground">Yield Farming, AMM, Liquidity</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      Trading & Analytics
                    </span>
                    <span className="text-sm text-muted-foreground">60%</span>
                  </div>
                  <Progress value={60} />
                  <p className="text-xs text-muted-foreground">Technical Analysis, Risk Management</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center">
                      <span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
                      Metaverse Development
                    </span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <Progress value={85} />
                  <p className="text-xs text-muted-foreground">3D Modeling, VR/AR, Virtual Worlds</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">My Courses</h3>
              <Button
                className="gradient-primary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate('/browse-courses');
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Browse Courses
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-3 text-center py-8">
                  <p className="text-muted-foreground">Loading your courses...</p>
                </div>
              ) : !enrolledCourses || enrolledCourses.length === 0 ? (
                <div className="col-span-3 text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
                  <Button
                    className="gradient-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate('/browse-courses');
                    }}
                  >
                    Browse Courses
                  </Button>
                </div>
              ) : (
                enrolledCourses.slice(0, 6).map((course) => (
                  <Card key={course.id || course._id} className="overflow-hidden hover:shadow-elevation animate-smooth">
                    <div className="relative">
                      <img
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=200&fit=crop'}
                        alt={course.title || 'Course'}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.category === 'blockchain' ? 'bg-blue-100 text-blue-800' :
                          course.category === 'web3' ? 'bg-green-100 text-green-800' :
                            course.category === 'nft' ? 'bg-purple-100 text-purple-800' :
                              course.category === 'defi' ? 'bg-orange-100 text-orange-800' :
                                course.category === 'trading' ? 'bg-red-100 text-red-800' :
                                  'bg-pink-100 text-pink-800'
                          }`}>
                          {(course.category || 'General').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-semibold text-lg mb-2">{course.title || 'Untitled Course'}</h4>
                      <p className="text-muted-foreground text-sm mb-3">{course.teacher?.username || 'Unknown Instructor'}</p>
                      <p className="text-xs text-muted-foreground mb-4">{course.level || 'Beginner'}</p>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{course.duration || 'TBD'}</span>
                          </div>
                          <span className="text-primary font-medium">{course.completion || 0}% complete</span>
                        </div>
                        <Progress value={course.completion || 0} />

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Modules:</p>
                          <p className="text-sm text-muted-foreground">{course.modules || 0} modules • {course.totalLessons || 0} lessons</p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Level:</p>
                          <p className="text-sm text-muted-foreground">{course.level || 'Beginner'}</p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Reward:</p>
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {course.skillTokenReward || 0} SKILL
                            </span>
                          </div>
                        </div>

                        <Button
                          className="w-full gradient-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/course-study/${course.id || course._id}`);
                          }}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Continue Learning
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
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
                        <span className={`text-xs px-2 py-1 rounded ${cert.category === 'blockchain' ? 'bg-blue-100 text-blue-800' :
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
                >
                  <Users className="w-4 h-4 mr-2" />
                  {showMyListings ? 'View All' : 'My Listings'}
                </Button>
                <Button className="gradient-primary" onClick={() => navigate('/list-certificate/new')}>
                  <Plus className="w-4 h-4 mr-2" />
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
                    <Button className="gradient-primary" onClick={() => navigate('/list-certificate/new')}>
                      <Plus className="w-4 h-4 mr-2" />
                      List Your First Certificate
                    </Button>
                  )}
                </div>
              ) : (
                displayedListings.map((item) => (
                  <Card key={item.id} className="p-6 hover:shadow-elevation animate-smooth relative group">
                    {/* Seller badge for owned listings */}
                    {item.seller === user?.username && (
                      <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Your Listing
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <Trophy className="w-12 h-12 text-primary" />
                      <div className="text-right">
                        <span className={`inline-block text-xs px-2 py-1 rounded mb-2 ${item.category === 'blockchain' ? 'bg-blue-100 text-blue-800' :
                          item.category === 'web3' ? 'bg-green-100 text-green-800' :
                            item.category === 'nft' ? 'bg-purple-100 text-purple-800' :
                              item.category === 'defi' ? 'bg-orange-100 text-orange-800' :
                                item.category === 'trading' ? 'bg-red-100 text-red-800' :
                                  'bg-pink-100 text-pink-800'
                          }`}>
                          {item.category}
                        </span>
                        <div>
                          <p className="text-lg font-bold text-foreground">
                            {item.price} {item.currency}
                          </p>
                          {item.alternativePrice && (
                            <p className="text-sm text-muted-foreground">
                              or {item.alternativePrice} {item.alternativeCurrency}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground mb-4">
                      <p>Seller: {item.seller}</p>
                      <p>Issuer: {item.issuer}</p>
                      <p>Grade: <span className="font-medium text-foreground">{item.grade}</span></p>
                      <div className="flex items-center justify-between">
                        <span>Rarity:</span>
                        <span className={`px-2 py-1 rounded text-xs ${item.rarity === 'Common' ? 'bg-gray-100 text-gray-800' :
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
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      )}

                      {item.seller !== user?.username ? (
                        <Button size="sm" className="flex-1 gradient-primary">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Buy Now
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="flex-1">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      )}
                    </div>

                    {/* Market stats */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {item.views} views
                        </span>
                        <span className="flex items-center">
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