import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { walletService } from '@/lib/walletService';
import { useToast } from '@/hooks/use-toast';
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  BookOpen,
  Trophy,
  Wallet
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentWalletAddress, setCurrentWalletAddress] = useState<string>('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const walletAddress = await walletService.getCurrentWalletAddress();
        setIsWalletConnected(!!walletAddress);
        setCurrentWalletAddress(walletAddress || '');
      } catch (error) {
        setIsWalletConnected(false);
        setCurrentWalletAddress('');
      }
    };

    checkWalletConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', checkWalletConnection);
      window.ethereum.on('disconnect', () => {
        setIsWalletConnected(false);
        setCurrentWalletAddress('');
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', checkWalletConnection);
        window.ethereum.removeListener('disconnect', () => {
          setIsWalletConnected(false);
          setCurrentWalletAddress('');
        });
      }
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleWalletClick = async () => {
    try {
      // Always open MetaMask interface regardless of connection status
      const walletInfo = await walletService.openWallet();

      // Update our local state with current connection status
      setIsWalletConnected(!!walletInfo.address);
      setCurrentWalletAddress(walletInfo.address || '');

      if (walletInfo.address) {
        toast({
          title: "Wallet Interface Opened",
          description: `Connected to ${walletInfo.address.slice(0, 6)}...${walletInfo.address.slice(-4)} with ${parseFloat(walletInfo.balance).toFixed(4)} ETH`,
        });
      } else {
        toast({
          title: "MetaMask Opened",
          description: "MetaMask interface opened. Please connect your wallet.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to Open Wallet",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return user.role === 'student' ? '/student/dashboard' : '/teacher/dashboard';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">SkillChain</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary animate-smooth">
              Home
            </Link>
            <Link to="/courses" className="text-foreground hover:text-primary animate-smooth">
              Courses
            </Link>
            <Link to="/marketplace" className="text-foreground hover:text-primary animate-smooth">
              Marketplace
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary animate-smooth">
              About
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.username}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="text-xs text-primary capitalize">{user.role}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleWalletClick} className="cursor-pointer">
                    <div className="flex items-center">
                      <Wallet className="mr-2 h-4 w-4" />
                      <span>Wallet</span>
                      <div className={`ml-2 h-2 w-2 rounded-full ${isWalletConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="gradient-primary">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
              <Link
                to="/"
                className="block px-3 py-2 text-foreground hover:text-primary animate-smooth"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className="block px-3 py-2 text-foreground hover:text-primary animate-smooth"
                onClick={() => setIsOpen(false)}
              >
                Courses
              </Link>
              <Link
                to="/marketplace"
                className="block px-3 py-2 text-foreground hover:text-primary animate-smooth"
                onClick={() => setIsOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-foreground hover:text-primary animate-smooth"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>

              {user ? (
                <div className="space-y-1 pt-2 border-t border-border">
                  <Link
                    to={getDashboardLink()}
                    className="block px-3 py-2 text-foreground hover:text-primary animate-smooth"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleWalletClick();
                      setIsOpen(false);
                    }}
                    className="flex items-center w-full text-left px-3 py-2 text-foreground hover:text-primary animate-smooth"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>Wallet</span>
                    <div className={`ml-2 h-2 w-2 rounded-full ${isWalletConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-foreground hover:text-primary animate-smooth"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1 pt-2 border-t border-border">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-foreground hover:text-primary animate-smooth"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 text-primary font-medium animate-smooth"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};