import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, ShieldAlert } from "lucide-react";

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke("delete-account", {
        body: {},
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);

      toast({ title: "Account deleted", description: "Your account and data have been permanently removed." });
      await signOut();
      navigate("/", { replace: true });
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Deletion failed",
        description: e?.message ?? "Please try again or contact scmcoded@gmail.com",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Your Account</h1>
        <p className="text-muted-foreground mt-1">Signed in as {user.email}</p>
      </section>

      <section className="rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Account actions</h2>
        <Button variant="outline" onClick={() => signOut().then(() => navigate("/"))}>
          Sign out
        </Button>
      </section>

      <section className="rounded-lg border border-destructive/40 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-destructive mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-destructive">Delete my account</h2>
            <p className="text-sm text-muted-foreground mt-1">
              This will permanently delete your account, profile, stats, quiz sessions,
              submitted questions, votes and room participation. This action cannot be undone.
            </p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete my account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently erase your account and all associated data. Type
                <strong> DELETE </strong> below to confirm.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2">
              <Label htmlFor="confirm">Type DELETE to confirm</Label>
              <Input id="confirm" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={confirmText !== "DELETE" || deleting}
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Permanently delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      <p className="text-sm text-muted-foreground">
        See our <Link to="/privacy" className="underline">Privacy Policy</Link> and{" "}
        <Link to="/terms" className="underline">Terms of Service</Link>.
      </p>
    </main>
  );
};

export default Account;
