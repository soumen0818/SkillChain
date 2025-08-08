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

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email to start earning..."
                    className="w-full px-6 py-4 rounded-xl border border-border bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-lg"
                  />
                </div>
                <Button className="gradient-primary px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" asChild>
                  <Link to="/signup">Start Learning</Link>
                </Button>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6 pt-8">
                <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">10K+ NFT Certificates Issued</span>
                </div>
                <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                  <Wallet className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">5M+ SkillTokens Earned</span>
                </div>
                <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">50K+ Active Learners</span>
                </div>
              </div>
            </div>

            {/* Right Content - Interactive Cards */}
            <div className="relative animate-scale-in space-y-6">
              {/* Floating NFT Certificate Card */}
              <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 shadow-xl backdrop-blur-sm animate-float">
                <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg p-3 shadow-lg">
                  <Shield className="w-6 h-6" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">NFT Certificate</h3>
                      <p className="text-sm text-muted-foreground">Blockchain Verified</p>
                    </div>
                  </div>

                  <div className="bg-background/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <span className="text-primary font-bold">95%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full w-[95%] animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SkillToken Wallet Card */}
              <div className="relative bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-6 shadow-xl backdrop-blur-sm" style={{ animationDelay: '0.2s' }}>
                <div className="absolute top-4 right-4 bg-gradient-to-r from-accent to-primary text-white rounded-lg p-3 shadow-lg animate-pulse">
                  <Coins className="w-6 h-6" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">SkillToken Wallet</h3>
                      <p className="text-sm text-muted-foreground">Earn & Trade</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-primary">1,247</div>
                      <div className="text-xs text-muted-foreground">Tokens Earned</div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-accent">$892</div>
                      <div className="text-xs text-muted-foreground">Market Value</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-10 border-y border-border/60 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-xs uppercase tracking-wider text-muted-foreground mb-6">Trusted by learners and teams from</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 opacity-80">
            {["Ethereum", "Polygon", "Arbitrum", "Optimism", "IPFS", "Thirdweb"].map((brand) => (
              <div key={brand} className="h-10 rounded-md bg-gradient-to-br from-background to-muted flex items-center justify-center text-muted-foreground text-sm">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">{stat.number}</h3>
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
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
              <Card key={index} className="group p-8 text-center space-y-6 border-border hover:shadow-elevation hover:shadow-primary/20 transition-all duration-300 hover:scale-105 animate-scale-in bg-background/80 backdrop-blur-sm" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
              <Card key={i} className="relative p-6 bg-background/80 backdrop-blur-sm border-border animate-scale-in">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full gradient-secondary flex items-center justify-center text-foreground">
                    {step.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-primary font-semibold">STEP {i + 1}</span>
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mt-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                  </div>
                </div>
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
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Analytics your daily, weekly and monthly activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Get updates</span>
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Track activity</span>
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Course Statistics</span>
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">5.5</div>
                  <div className="text-sm text-muted-foreground">Hours spent this week</div>
                </div>
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
                  <Link to="/login">Explore Demo</Link>
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