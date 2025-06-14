
import { useState } from 'react';
import { Globe, Trophy, Users, Zap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';

interface AppHeaderProps {
  countriesCount: number;
  isGeneratingQuestions?: boolean;
}

export const AppHeader = ({ countriesCount, isGeneratingQuestions }: AppHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Globe', icon: Globe },
    { path: '/weekly-challenges', label: 'Challenges', icon: Trophy },
    { path: '/ultimate-quiz', label: 'Ultimate Quiz', icon: Zap },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Globe className="h-8 w-8 text-white animate-pulse" />
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Global Quiz Game</h1>
              <p className="text-xs text-primary-foreground/80">
                Master Geography • Explore {countriesCount} Countries
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  size="sm"
                  className={`flex items-center gap-2 transition-all duration-200 ${
                    isActive(item.path) 
                      ? "bg-white/20 text-white shadow-md" 
                      : "text-primary-foreground/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Status and User Info */}
          <div className="flex items-center space-x-3">
            {isGeneratingQuestions && (
              <Badge variant="secondary" className="animate-pulse bg-amber-500/20 text-amber-100">
                <Zap className="h-3 w-3 mr-1" />
                Generating...
              </Badge>
            )}
            
            {user ? (
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary-foreground/80" />
                <span className="text-sm font-medium text-white truncate max-w-32">
                  {user.email?.split('@')[0]}
                </span>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="secondary" size="sm" className="bg-white/20 text-white hover:bg-white/30">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary/20 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    size="sm"
                    className={`w-full justify-start gap-3 ${
                      isActive(item.path) 
                        ? "bg-white/20 text-white" 
                        : "text-primary-foreground/90 hover:bg-white/10"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
