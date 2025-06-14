
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { 
  Home, 
  Shield, 
  Calendar, 
  Trophy, 
  User, 
  LogOut, 
  Settings,
  BookOpen
} from "lucide-react";

export const MainNavigation = () => {
  const { user, signOut, isAdmin } = useAuth();

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Global Quiz</span>
            </Link>
            
            {user && (
              <div className="flex space-x-4">
                <Link to="/weekly-challenges">
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Weekly Challenges
                  </Button>
                </Link>
                <Link to="/ultimate-quiz">
                  <Button variant="ghost" size="sm">
                    <Trophy className="h-4 w-4 mr-2" />
                    Ultimate Quiz
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Welcome back!
                </span>
                
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
