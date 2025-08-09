import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import ThreeScene from '@/components/ThreeScene';
import SEO from '@/components/SEO';
import {
  Shield,
  Coins,
  Users,
  TrendingUp,
  Award,
  Wallet,
  Vote,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Star,
  User,
  BarChart3,
  Zap,
  Globe,
  Lock,
  Check,
  Sparkles
} from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: <Shield className="w-12 h-12 text-primary" />,
      title: "Blockchain Certificates",
      description: "Earn tamper-proof NFT certificates that verify your skills on the blockchain. Your credentials are yours forever."
    },
    {
      icon: <Coins className="w-12 h-12 text-primary" />,
      title: "Earn SkillTokens",
      description: "Get rewarded with SkillTokens for completing courses. Trade them in our marketplace or use them for governance."
    },
    {
      icon: <Vote className="w-12 h-12 text-primary" />,
      title: "DAO Governance",
      description: "Vote on platform decisions, approve new courses, and shape the future of decentralized education."
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-primary" />,
      title: "NFT Marketplace",
      description: "Trade your certificates and SkillTokens in our built-in marketplace. Turn your education into value."
    },
    {
      icon: <Lock className="w-12 h-12 text-primary" />,
      title: "Fraud-Proof",
      description: "Immutable blockchain records ensure your credentials can never be faked or altered."
    },
    {
      icon: <Globe className="w-12 h-12 text-primary" />,
      title: "Global Recognition",
      description: "Your blockchain credentials are recognized worldwide, opening doors to international opportunities."
    }
  ];

  const stats = [
    { number: "100K+", label: "Free Courses" },
    { number: "1,000+", label: "Experienced and expert mentor" },
    { number: "1M+", label: "Students rate and review" }
  ];

  const mentors = [
    { name: "Ashton Agar", rating: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ashton" },
    { name: "Roe Tyler", rating: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=roe" },
    { name: "Jacob William", rating: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jacob" }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SEO title="SkillChain | Decentralized Learn & Earn Platform" description="Earn blockchain-verified NFT certificates, SkillTokens, and vote via DAO. Trade credentials in the marketplace." />
      {/* Three.js Background */}
      <ThreeScene />
      {/* Hero Section */
      }
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                <div className="relative">
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                    The Future of{' '}
                    <span className="gradient-text bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                      Decentralized
                    </span>{' '}
                    Education
                  </h1>
                  <div className="absolute -top-4 -right-4 animate-float">
                    <Zap className="w-8 h-8 text-primary opacity-60" />
                  </div>
                </div>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  Earn blockchain-verified NFT certificates, trade SkillTokens, and participate in
                  DAO governance. Transform your education into valuable digital assets.
                </p>
              </div>

              <div className="flex justify-center sm:justify-start">
                <Button className="gradient-primary px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" asChild>
                  <Link to="/signup">Start Learning</Link>
                </Button>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-8">
                <div className="group flex items-center gap-3 bg-background/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border border-border/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 hover:border-primary/30">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <Award className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">10K+</div>
                    <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">NFT Certificates Issued</div>
                  </div>
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10"></div>
                </div>

                <div className="group flex items-center gap-3 bg-background/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border border-border/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-accent/5 hover:to-primary/5 hover:border-accent/30" style={{ animationDelay: '0.1s' }}>
                  <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <Wallet className="w-5 h-5 text-accent group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground group-hover:text-accent transition-colors duration-300">5M+</div>
                    <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">SkillTokens Earned</div>
                  </div>
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10"></div>
                </div>

                <div className="group flex items-center gap-3 bg-background/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border border-border/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5 hover:border-blue-500/30" style={{ animationDelay: '0.2s' }}>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <Users className="w-5 h-5 text-blue-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground group-hover:text-blue-500 transition-colors duration-300">50K+</div>
                    <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Active Learners</div>
                  </div>
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10"></div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative animate-scale-in">
              <div className="relative group">
                <img 
                  src="/herosection.png" 
                  alt="SkillChain Decentralized Education Platform" 
                  className="w-full h-auto max-w-2xl mx-auto rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl"
                  loading="eager"
                />
                {/* Animated border glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
                
                {/* Floating animation elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-float opacity-60"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent/20 rounded-full animate-float opacity-60" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 border-y border-border/30 bg-gradient-to-br from-purple-50/50 via-background to-indigo-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-sm uppercase tracking-wider text-primary font-semibold mb-2">Powered by Industry Leaders</div>
            <h3 className="text-xl font-bold text-foreground">Trusted by learners and teams from</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Ethereum", color: "from-blue-500 to-purple-600", bgColor: "bg-blue-50", hoverColor: "hover:shadow-blue-200" },
              { name: "Polygon", color: "from-purple-500 to-indigo-600", bgColor: "bg-purple-50", hoverColor: "hover:shadow-purple-200" },
              { name: "Arbitrum", color: "from-indigo-500 to-blue-600", bgColor: "bg-indigo-50", hoverColor: "hover:shadow-indigo-200" },
              { name: "Optimism", color: "from-red-500 to-pink-600", bgColor: "bg-red-50", hoverColor: "hover:shadow-red-200" },
              { name: "IPFS", color: "from-teal-500 to-cyan-600", bgColor: "bg-teal-50", hoverColor: "hover:shadow-teal-200" },
              { name: "Thirdweb", color: "from-orange-500 to-yellow-600", bgColor: "bg-orange-50", hoverColor: "hover:shadow-orange-200" }
            ].map((brand, index) => (
              <div 
                key={brand.name} 
                className={`group relative h-16 rounded-xl ${brand.bgColor} border border-border/50 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${brand.hoverColor} hover:shadow-lg animate-scale-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient overlay that appears on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
                
                {/* Brand name */}
                <span className={`relative z-10 text-sm font-semibold bg-gradient-to-br ${brand.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                  {brand.name}
                </span>
                
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl"></div>
                
                {/* Animated border glow */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300 -z-10`}></div>
              </div>
            ))}
          </div>
          
          {/* Additional trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
              <Shield className="w-4 h-4 text-primary" />
              <span>Blockchain Secured</span>
            </div>
            <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
              <Globe className="w-4 h-4 text-primary" />
              <span>Globally Recognized</span>
            </div>
            <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Industry Standard</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="group text-center space-y-4 animate-scale-in cursor-pointer transition-all duration-300 hover:scale-105" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-border/50 group-hover:shadow-2xl group-hover:shadow-primary/20 group-hover:border-primary/30 transition-all duration-300">
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
                  
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 group-hover:bg-primary/30 transition-all duration-300">
                      <CheckCircle className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{stat.number}</h3>
                  </div>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 font-medium">{stat.label}</p>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why Choose SkillChain?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the future of education with blockchain-verified credentials,
              earning opportunities, and community governance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group p-8 text-center space-y-6 border-border hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 animate-scale-in bg-background/80 backdrop-blur-sm cursor-pointer relative overflow-hidden hover:border-primary/30" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">{feature.description}</p>
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Border glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="py-16 bg-muted/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-3xl md:text-4xl font-bold">How SkillChain Works</h2>
            <p className="text-muted-foreground">From course creation to DAO votes, here’s the flow.</p>
          </div>
          <div className="relative grid md:grid-cols-2 gap-8">
            {[
              { title: 'Teacher Onboards Course', desc: 'Educators submit course details. Off-chain data stored securely.', icon: <BookOpen className="w-6 h-6" /> },
              { title: 'Student Completes Work', desc: 'Progress tracked off-chain. Request credential when done.', icon: <User className="w-6 h-6" /> },
              { title: 'Mint NFT Credential', desc: 'Thirdweb mints a unique NFT, metadata on IPFS.', icon: <Shield className="w-6 h-6" /> },
              { title: 'Issue SkillTokens', desc: 'Fungible tokens rewarded to the learner’s wallet.', icon: <Coins className="w-6 h-6" /> },
              { title: 'Marketplace Trading', desc: 'List and trade NFTs or tokens with a small platform fee.', icon: <TrendingUp className="w-6 h-6" /> },
              { title: 'DAO Voting', desc: 'Token holders vote on fees and new courses.', icon: <Vote className="w-6 h-6" /> },
            ].map((step, i) => (
              <Card key={i} className="group relative p-6 bg-background/80 backdrop-blur-sm border-border animate-scale-in cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 overflow-hidden">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full gradient-secondary flex items-center justify-center text-foreground group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg transition-all duration-300">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-primary font-semibold group-hover:text-accent transition-colors duration-300">STEP {i + 1}</span>
                        <Sparkles className="w-4 h-4 text-primary group-hover:text-accent group-hover:scale-110 transition-all duration-300" />
                      </div>
                      <h3 className="text-lg font-semibold mt-1 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 group-hover:text-foreground transition-colors duration-300">{step.desc}</p>
                    </div>
                  </div>
                </div>
                
                {/* Border glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10"></div>
                
                {i < 5 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 translate-y-[-50%] w-8 h-0.5 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0" />
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className="py-16 bg-muted/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="text-sm text-primary font-semibold">1K+ Qualified Mentor</div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Get Trained by the world's best Teachers
                </h2>
                <p className="text-muted-foreground">
                  Learn from industry experts and experienced educators who will guide you
                  through your learning journey while earning blockchain rewards.
                </p>
              </div>

              <div className="space-y-4">
                {mentors.map((mentor, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={mentor.avatar}
                      alt={`${mentor.name} avatar`}
                      loading="lazy"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{mentor.name}</div>
                      <div className="flex items-center space-x-1">
                        {[...Array(mentor.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="gradient-primary">
                Learn More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="group bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 relative overflow-hidden">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
                
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold mb-4 group-hover:text-primary transition-colors duration-300">Analytics your daily, weekly and monthly activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between group-hover:scale-105 transition-transform duration-300">
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">Get updates</span>
                      <CheckCircle className="w-5 h-5 text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <div className="flex items-center justify-between group-hover:scale-105 transition-transform duration-300">
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">Track activity</span>
                      <CheckCircle className="w-5 h-5 text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-primary/10 rounded-lg group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium group-hover:text-primary transition-colors duration-300">Course Statistics</span>
                      <BarChart3 className="w-5 h-5 text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <div className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">5.5</div>
                    <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Hours spent this week</div>
                  </div>
                </div>
                
                {/* Border glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden gradient-primary text-white p-12 text-center space-y-8 shadow-2xl">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-20"></div>
            <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full animate-float"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Ready to Shape the Future of Education?
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                Join the revolution! Earn blockchain certificates, trade SkillTokens, and be part of the world's first decentralized education platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" asChild>
                  <Link to="/signup">Start Your Journey</Link>
                </Button>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105" asChild>
                  <Link to="/about">Explore Demo</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Quick answers about credentials, tokens, and wallets.</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>Do I need a crypto wallet to get started?</AccordionTrigger>
              <AccordionContent>
                You can browse and learn without one, but to mint NFTs or receive SkillTokens you’ll connect a wallet.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Are my certificates really on the blockchain?</AccordionTrigger>
              <AccordionContent>
                Yes. Your badge is minted as an NFT with metadata on IPFS—tamper‑proof and verifiable.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How do governance votes work?</AccordionTrigger>
              <AccordionContent>
                Token holders can create proposals and vote. Voting weight is based on SkillToken holdings at snapshot.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}