import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShieldPlus, UserPlus } from "lucide-react";

export const AdminBootstrap = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleBootstrapAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('bootstrap_admin_user', {
        user_email: email
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Admin role assigned to ${email}`,
      });
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign admin role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldPlus className="h-5 w-5" />
          Bootstrap Admin User
        </CardTitle>
        <CardDescription>
          Assign admin role to a user by their email address. Use this for initial setup only.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <UserPlus className="h-4 w-4" />
          <AlertDescription>
            The user must already have an account in the system. This will add admin privileges to their existing account.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleBootstrapAdmin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">User Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Assigning..." : "Make Admin"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};