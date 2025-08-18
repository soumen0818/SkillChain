import { useState, useEffect } from 'react';
import { useAuth, User as UserType } from '@/contexts/AuthContext';
import { walletService } from '@/lib/walletService';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import {
  User,
  Shield,
  Bell,
  Wallet,
  Settings as SettingsIcon,
  BookOpen,
  Presentation,
  Award,
  LayoutGrid,
  Coins,
  Globe,
  Save
} from 'lucide-react';

interface PreferenceState {
  // Shared
  username: string;
  email: string;
  bio: string;
  locale: string;
  darkMode: boolean;
  marketingEmails: boolean;
  progressEmails: boolean;
  certificateNotifications: boolean;
  marketplaceNotifications: boolean;
  // Student
  learningGoal?: string;
  preferredPace?: string;
  autoEnrollRecommendations?: boolean;
  showPublicAchievements?: boolean;
  // Teacher
  teachingTitle?: string;
  payoutWallet?: string;
  autoApproveEnrollments?: boolean;
  defaultCertificateTemplate?: string;
  revenueEmailDigest?: boolean;
  allowCourseForking?: boolean;
}

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const role = user?.role || 'student';

  const [prefs, setPrefs] = useState<PreferenceState>({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    locale: 'en',
    darkMode: false,
    marketingEmails: false,
    progressEmails: true,
    certificateNotifications: true,
    marketplaceNotifications: true,
    learningGoal: 'Become Web3 Specialist',
    preferredPace: 'standard',
    autoEnrollRecommendations: false,
    showPublicAchievements: true,
    teachingTitle: user?.teachingTitle || 'Senior Blockchain Instructor',
    payoutWallet: user?.walletAddress || '',
    autoApproveEnrollments: true,
    defaultCertificateTemplate: 'modern-gradient',
    revenueEmailDigest: true,
    allowCourseForking: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [currentWalletAddress, setCurrentWalletAddress] = useState<string>('');

  // Helper function to check if wallet is connected
  const isWalletConnected = () => {
    return currentWalletAddress && currentWalletAddress.trim() !== '';
  };

  const getWalletAddress = () => {
    return currentWalletAddress || 'No wallet connected';
  };

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('skillchain_user_preferences');
    if (savedPrefs && user) {
      try {
        const parsed = JSON.parse(savedPrefs);
        setPrefs(prev => ({
          ...prev,
          ...parsed,
          username: user.username || '',
          email: user.email || '',
          bio: user.bio || parsed.bio || '',
          teachingTitle: user.teachingTitle || parsed.teachingTitle || 'Senior Blockchain Instructor',
          payoutWallet: user.walletAddress || parsed.payoutWallet || '',
        }));
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    }

    // Get current MetaMask wallet address
    const getCurrentWallet = async () => {
      try {
        const address = await walletService.getCurrentWalletAddress();
        setCurrentWalletAddress(address || '');
      } catch (error) {
        console.error('Failed to get current wallet:', error);
      }
    };

    getCurrentWallet();
  }, [user]);

  const update = (k: keyof PreferenceState, v: any) => {
    setPrefs(p => {
      const newPrefs = { ...p, [k]: v };
      // Save non-sensitive preferences to localStorage
      const { username, email, ...prefsToSave } = newPrefs;
      localStorage.setItem('skillchain_user_preferences', JSON.stringify(prefsToSave));
      return newPrefs;
    });
  };

  const handleConnectWallet = async () => {
    try {
      const walletInfo = await walletService.connectWallet();
      update('payoutWallet', walletInfo.address);
      toast({
        title: "Wallet Connected Successfully",
        description: `Connected to ${walletInfo.address.slice(0, 6)}...${walletInfo.address.slice(-4)} with ${parseFloat(walletInfo.balance).toFixed(4)} ETH`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to Connect Wallet",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOpenWallet = async () => {
    try {
      await walletService.openWallet();
      toast({
        title: "Wallet Opened",
        description: "MetaMask wallet interface opened successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Open Wallet",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      // Clear wallet address from preferences and user profile
      update('payoutWallet', '');

      // Update user profile to remove wallet address
      const profileData: Partial<UserType> = {
        walletAddress: '',
      };

      await updateProfile(profileData);

      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been successfully disconnected from your account.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Disconnect Wallet",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleWalletClick = () => {
    if (prefs.payoutWallet || user?.walletAddress) {
      handleOpenWallet();
    } else {
      handleConnectWallet();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const profileData: Partial<UserType> = {
        username: prefs.username.trim(),
        bio: prefs.bio.trim(),
        walletAddress: prefs.payoutWallet.trim(),
      };

      if (role === 'teacher') {
        profileData.teachingTitle = prefs.teachingTitle?.trim();
      }

      // Validate required fields
      if (!profileData.username) {
        toast({
          title: 'Validation Error',
          description: 'Username is required.',
          variant: 'destructive'
        });
        setIsSaving(false);
        return;
      }

      const success = await updateProfile(profileData);
      if (success) {
        toast({
          title: 'Settings Saved Successfully',
          description: 'Your profile has been updated and changes are now visible across the application.'
        });
      } else {
        toast({
          title: 'Save Failed',
          description: 'Failed to update your settings. Please check your internet connection and try again.',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Save Failed',
        description: error.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const SectionHeader = ({ icon: Icon, title, desc }: { icon: any; title: string; desc?: string }) => (
    <div className="flex items-start mb-6">
      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center mr-4 shadow-sm">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {desc && <p className="text-sm text-muted-foreground mt-1 max-w-prose">{desc}</p>}
      </div>
    </div>
  );

  const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground/90">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );

  const ToggleRow = ({ label, value, onChange, hint }: { label: string; value: boolean; onChange: () => void; hint?: string }) => (
    <div className="flex items-start justify-between py-3">
      <div className="pr-4">
        <p className="text-sm font-medium text-foreground/90">{label}</p>
        {hint && <p className="text-xs text-muted-foreground mt-1 max-w-sm">{hint}</p>}
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );

  const StudentSettings = () => (
    <div className="space-y-10">
      <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
        <SectionHeader icon={User} title="Profile" desc="Update your public learning profile & preferences." />
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Username">
            <Input value={prefs.username} onChange={e => update('username', e.target.value)} placeholder="Username" />
          </Field>
          <Field label="Email">
            <Input value={prefs.email} disabled className="opacity-80" />
          </Field>
          <Field label="Learning Goal" hint="Your primary objective helps tailor recommendations.">
            <Input value={prefs.learningGoal} onChange={e => update('learningGoal', e.target.value)} />
          </Field>
          <Field label="Preferred Pace">
            <Select value={prefs.preferredPace} onValueChange={v => update('preferredPace', v)}>
              <SelectTrigger><SelectValue placeholder="Select pace" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="flexible">Flexible</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="intensive">Intensive</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Bio" hint="A short description shown on your public learner profile.">
              <Textarea rows={4} value={prefs.bio} onChange={e => update('bio', e.target.value)} />
            </Field>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
        <SectionHeader icon={Bell} title="Notifications" desc="Control how SkillChain keeps you updated." />
        <div className="divide-y divide-border/60">
          <ToggleRow label="Progress Emails" value={prefs.progressEmails!} onChange={() => update('progressEmails', !prefs.progressEmails)} hint="Weekly summary of your learning progress." />
          <ToggleRow label="Certificate Updates" value={prefs.certificateNotifications!} onChange={() => update('certificateNotifications', !prefs.certificateNotifications)} hint="Alerts when certificates are verified or ready." />
          <ToggleRow label="Marketplace Activity" value={prefs.marketplaceNotifications!} onChange={() => update('marketplaceNotifications', !prefs.marketplaceNotifications)} hint="When items you follow change price or sell." />
          <ToggleRow label="Marketing Emails" value={prefs.marketingEmails!} onChange={() => update('marketingEmails', !prefs.marketingEmails)} hint="Product updates & occasional promotions." />
        </div>
      </Card>

      <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
        <SectionHeader icon={Shield} title="Privacy & Display" desc="Control what others can see about your achievements." />
        <div className="divide-y divide-border/60">
          <ToggleRow label="Show Achievements Publicly" value={prefs.showPublicAchievements!} onChange={() => update('showPublicAchievements', !prefs.showPublicAchievements)} hint="Display earned certificates & milestones on your profile." />
          <ToggleRow label="Auto-Enroll Recommendations" value={prefs.autoEnrollRecommendations!} onChange={() => update('autoEnrollRecommendations', !prefs.autoEnrollRecommendations)} hint="Automatically enroll into curated micro-learning tracks." />
          <ToggleRow label="Enable Dark Mode" value={prefs.darkMode} onChange={() => update('darkMode', !prefs.darkMode)} />
        </div>
      </Card>
    </div>
  );

  const TeacherSettings = () => (
    <div className="space-y-10">
      <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
        <SectionHeader icon={Presentation} title="Instructor Profile" desc="Refine how learners see you across courses & certificates." />
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Display Name">
            <Input value={prefs.username} onChange={e => update('username', e.target.value)} />
          </Field>
          <Field label="Teaching Title" hint="Short professional headline.">
            <Input value={prefs.teachingTitle} onChange={e => update('teachingTitle', e.target.value)} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Bio" hint="Highlight expertise, focus areas & impact.">
              <Textarea rows={4} value={prefs.bio} onChange={e => update('bio', e.target.value)} />
            </Field>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
        <SectionHeader icon={Award} title="Certificates & Issuance" desc="Default behaviors for certificates you issue to learners." />
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Default Certificate Template">
            <Select value={prefs.defaultCertificateTemplate} onValueChange={v => update('defaultCertificateTemplate', v)}>
              <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="classic-light">Classic Light</SelectItem>
                <SelectItem value="modern-gradient">Modern Gradient</SelectItem>
                <SelectItem value="dark-pro">Dark Pro</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Auto-Approve Enrollments">
            <div className="flex items-center justify-between h-10 px-3 rounded-md border bg-background/30">
              <span className="text-sm text-muted-foreground">{prefs.autoApproveEnrollments ? 'Enabled' : 'Disabled'}</span>
              <Switch checked={prefs.autoApproveEnrollments} onCheckedChange={() => update('autoApproveEnrollments', !prefs.autoApproveEnrollments)} />
            </div>
          </Field>
        </div>
        <div className="mt-6 space-y-4 divide-y divide-border/60">
          <ToggleRow label="Allow Course Forking" value={prefs.allowCourseForking!} onChange={() => update('allowCourseForking', !prefs.allowCourseForking)} hint="Permit other verified instructors to propose derivative content." />
          <ToggleRow label="Enable Dark Mode" value={prefs.darkMode} onChange={() => update('darkMode', !prefs.darkMode)} />
        </div>
      </Card>

      <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
        <SectionHeader icon={Wallet} title="Monetization & Payouts" desc="Manage revenue channels & financial preferences." />
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Payout Wallet" hint="Updates will require re-verification.">
            <div className="flex gap-2">
              <Input
                value={prefs.payoutWallet}
                onChange={e => update('payoutWallet', e.target.value)}
                placeholder="0x..."
                className="flex-1"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleWalletClick}
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                >
                  <div className="flex items-center">
                    <Wallet className="h-4 w-4 mr-1" />
                    <span>{(prefs.payoutWallet || user?.walletAddress) ? 'Open' : 'Connect'}</span>
                  </div>
                </Button>
                {(prefs.payoutWallet || user?.walletAddress) && (
                  <Button
                    onClick={handleDisconnectWallet}
                    variant="destructive"
                    size="sm"
                    className="shrink-0"
                  >
                    Disconnect
                  </Button>
                )}
              </div>
            </div>
          </Field>
          <Field label="Revenue Email Digest" hint="Weekly performance summary.">
            <div className="flex items-center justify-between h-10 px-3 rounded-md border bg-background/30">
              <span className="text-sm text-muted-foreground">{prefs.revenueEmailDigest ? 'Enabled' : 'Disabled'}</span>
              <Switch checked={prefs.revenueEmailDigest} onCheckedChange={() => update('revenueEmailDigest', !prefs.revenueEmailDigest)} />
            </div>
          </Field>
        </div>
      </Card>

      <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
        <SectionHeader icon={Bell} title="Notifications" desc="Customize how we notify you about teaching activity & sales." />
        <div className="divide-y divide-border/60">
          <ToggleRow label="Marketplace Sales" value={prefs.marketplaceNotifications!} onChange={() => update('marketplaceNotifications', !prefs.marketplaceNotifications)} hint="Alerts when certificates you issued are listed or sold." />
          <ToggleRow label="Certificate Issuance Events" value={prefs.certificateNotifications!} onChange={() => update('certificateNotifications', !prefs.certificateNotifications)} />
          <ToggleRow label="Marketing Emails" value={prefs.marketingEmails!} onChange={() => update('marketingEmails', !prefs.marketingEmails)} />
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-background via-background to-muted/40 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Account Settings</h1>
            <p className="text-muted-foreground mt-2 max-w-prose">Tailor your SkillChain experience. These settings adapt to your role as a {role}.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Quick Save'}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gradient-primary gap-2"
            >
              <SettingsIcon className="w-4 h-4" />
              {isSaving ? 'Applying...' : 'Apply Changes'}
            </Button>
          </div>
        </div>

        <Card className="p-4 md:p-6 border-0 bg-white/60 backdrop-blur-md shadow-elevation">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="flex flex-wrap w-full justify-start gap-2 bg-muted/40 p-1 rounded-lg mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2"><User className="w-4 h-4" /> Profile</TabsTrigger>
              {role === 'student' && <TabsTrigger value="learning" className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Learning</TabsTrigger>}
              {role === 'teacher' && <TabsTrigger value="teaching" className="flex items-center gap-2"><Presentation className="w-4 h-4" /> Teaching</TabsTrigger>}
              <TabsTrigger value="notifications" className="flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2"><Shield className="w-4 h-4" /> Privacy</TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center gap-2"><Wallet className="w-4 h-4" /> Wallet</TabsTrigger>
              {role === 'teacher' && <TabsTrigger value="monetization" className="flex items-center gap-2"><Coins className="w-4 h-4" /> Monetization</TabsTrigger>}
            </TabsList>

            {/* Profile Tab (shared) */}
            <TabsContent value="profile" className="focus:outline-none space-y-10">
              {role === 'student' ? <StudentSettings /> : <TeacherSettings />}
            </TabsContent>

            {/* Learning (student specific refinements) */}
            {role === 'student' && (
              <TabsContent value="learning" className="space-y-10">
                <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
                  <SectionHeader icon={LayoutGrid} title="Personalization" desc="Adaptive recommendations to accelerate your goals." />
                  <div className="space-y-6">
                    <ToggleRow label="Adaptive Path Optimization" value={prefs.autoEnrollRecommendations!} onChange={() => update('autoEnrollRecommendations', !prefs.autoEnrollRecommendations)} hint="Automatically adjusts your weekly modules based on performance." />
                    <Separator />
                    <Field label="Learning Locale" hint="Used for localized course suggestions.">
                      <Select value={prefs.locale} onValueChange={v => update('locale', v)}>
                        <SelectTrigger><SelectValue placeholder="Locale" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </Card>
              </TabsContent>
            )}

            {/* Teaching (teacher specific advanced areas) */}
            {role === 'teacher' && (
              <TabsContent value="teaching" className="space-y-10">
                <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
                  <SectionHeader icon={Globe} title="Course Defaults" desc="Baseline settings applied to new courses you create." />
                  <div className="grid md:grid-cols-2 gap-6">
                    <Field label="Default Locale">
                      <Select value={prefs.locale} onValueChange={v => update('locale', v)}>
                        <SelectTrigger><SelectValue placeholder="Locale" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Payout Wallet">
                      <div className="flex gap-2">
                        <Input
                          value={prefs.payoutWallet}
                          onChange={e => update('payoutWallet', e.target.value)}
                          placeholder="0x..."
                          className="flex-1"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleWalletClick}
                            variant="outline"
                            size="sm"
                            className="shrink-0"
                          >
                            <div className="flex items-center">
                              <Wallet className="h-4 w-4 mr-1" />
                              <span>{(prefs.payoutWallet || user?.walletAddress) ? 'Open' : 'Connect'}</span>
                            </div>
                          </Button>
                          {(prefs.payoutWallet || user?.walletAddress) && (
                            <Button
                              onClick={handleDisconnectWallet}
                              variant="destructive"
                              size="sm"
                              className="shrink-0"
                            >
                              Disconnect
                            </Button>
                          )}
                        </div>
                      </div>
                    </Field>
                  </div>
                </Card>
              </TabsContent>
            )}

            {/* Notifications tab reuse subset (already inside profile variant) */}
            <TabsContent value="notifications" className="space-y-10">
              <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
                <SectionHeader icon={Bell} title="Notification Center" desc="Fine‑tune real‑time & email alerts." />
                <div className="divide-y divide-border/60">
                  <ToggleRow label="Certificate Events" value={prefs.certificateNotifications!} onChange={() => update('certificateNotifications', !prefs.certificateNotifications)} />
                  <ToggleRow label="Marketplace Activity" value={prefs.marketplaceNotifications!} onChange={() => update('marketplaceNotifications', !prefs.marketplaceNotifications)} />
                  <ToggleRow label="Progress Summaries" value={prefs.progressEmails!} onChange={() => update('progressEmails', !prefs.progressEmails)} />
                  <ToggleRow label="Promotional & Product" value={prefs.marketingEmails!} onChange={() => update('marketingEmails', !prefs.marketingEmails)} />
                </div>
              </Card>
            </TabsContent>

            {/* Privacy */}
            <TabsContent value="security" className="space-y-10">
              <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
                <SectionHeader icon={Shield} title="Privacy & Security" desc="Visibility & protective preferences." />
                <div className="divide-y divide-border/60">
                  {role === 'student' && (
                    <ToggleRow label="Show Public Achievements" value={prefs.showPublicAchievements!} onChange={() => update('showPublicAchievements', !prefs.showPublicAchievements)} />
                  )}
                  {role === 'teacher' && (
                    <ToggleRow label="Allow Course Forking" value={prefs.allowCourseForking!} onChange={() => update('allowCourseForking', !prefs.allowCourseForking)} />
                  )}
                  <ToggleRow label="Enable Dark Mode" value={prefs.darkMode} onChange={() => update('darkMode', !prefs.darkMode)} />
                </div>
              </Card>
            </TabsContent>

            {/* Wallet */}
            <TabsContent value="wallet" className="space-y-10">
              <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
                <SectionHeader icon={Wallet} title="Wallet & Identity" desc="Manage your linked blockchain wallet & usage preferences." />
                <div className="grid md:grid-cols-2 gap-6">
                  <Field label="Primary Wallet Address" hint="This shows your currently connected MetaMask wallet address.">
                    <div className="flex gap-2">
                      <Input
                        value={getWalletAddress()}
                        placeholder="No wallet connected"
                        readOnly
                        className="flex-1 font-mono text-sm bg-muted/50"
                      />
                      <Button
                        onClick={handleWalletClick}
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                      >
                        <div className="flex items-center">
                          <Wallet className="h-4 w-4 mr-1" />
                          <span>Open Wallet</span>
                          {isWalletConnected() && (
                            <div className="ml-2 h-2 w-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                      </Button>
                    </div>
                  </Field>
                  {isWalletConnected() && (
                    <div className="md:col-span-2">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">MetaMask Wallet Connected</span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          Your MetaMask wallet is connected. Click "Open Wallet" to access MetaMask interface.
                        </p>
                      </div>
                    </div>
                  )}
                  <Field label="Locale">
                    <Select value={prefs.locale} onValueChange={v => update('locale', v)}>
                      <SelectTrigger><SelectValue placeholder="Locale" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Identity Statement" hint="Displayed on certificate verification pages (teachers) or marketplace (students).">
                      <Textarea rows={3} value={prefs.bio} onChange={e => update('bio', e.target.value)} />
                    </Field>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Monetization (teacher only) */}
            {role === 'teacher' && (
              <TabsContent value="monetization" className="space-y-10">
                <Card className="p-6 border-0 bg-white/70 backdrop-blur-md shadow-elevation">
                  <SectionHeader icon={Coins} title="Monetization Preferences" desc="Optimize how you earn from content & credentials." />
                  <div className="divide-y divide-border/60">
                    <ToggleRow label="Weekly Revenue Email Digest" value={prefs.revenueEmailDigest!} onChange={() => update('revenueEmailDigest', !prefs.revenueEmailDigest)} />
                    <ToggleRow label="Allow Certificate Resale Royalties" value={prefs.marketplaceNotifications!} onChange={() => update('marketplaceNotifications', !prefs.marketplaceNotifications)} hint="Receive royalties when learners resell certificates you issued." />
                  </div>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
