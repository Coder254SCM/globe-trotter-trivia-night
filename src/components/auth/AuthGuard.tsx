import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, UserX } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireModerator?: boolean;
}

export const AuthGuard = ({ 
  children, 
  requireAuth = false, 
  requireAdmin = false, 
  requireModerator = false 
}: AuthGuardProps) => {
  const { user, loading, isAdmin, isModerator } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-2" />
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You need administrator privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              This area is restricted to administrators only. If you believe you should have access, please contact your system administrator.
            </p>
            <div className="space-y-2">
              <Link to="/">
                <Button variant="default" className="w-full">
                  Return to Home
                </Button>
              </Link>
              {!user && (
                <Link to="/auth">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check moderator requirement
  if (requireModerator && !isModerator) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <UserX className="h-12 w-12 text-destructive mx-auto mb-2" />
            <CardTitle className="text-destructive">Moderator Access Required</CardTitle>
            <CardDescription>
              You need moderator or administrator privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              This area is restricted to moderators and administrators only.
            </p>
            <div className="space-y-2">
              <Link to="/">
                <Button variant="default" className="w-full">
                  Return to Home
                </Button>
              </Link>
              {!user && (
                <Link to="/auth">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

// Convenience wrapper components
export const AdminGuard = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard requireAuth requireAdmin>{children}</AuthGuard>
);

export const ModeratorGuard = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard requireAuth requireModerator>{children}</AuthGuard>
);

export const UserGuard = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard requireAuth>{children}</AuthGuard>
);