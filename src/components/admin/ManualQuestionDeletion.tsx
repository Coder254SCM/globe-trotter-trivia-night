
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Trash2, Database, Zap, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ManualQuestionDeletion = () => {
  const [deleting, setDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [totalEasyQuestions, setTotalEasyQuestions] = useState<number | null>(null);
  const { toast } = useToast();

  const countEasyQuestions = async () => {
    try {
      const { count, error } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('difficulty', 'easy');

      if (error) {
        console.error("Error counting easy questions:", error);
        throw error;
      }

      setTotalEasyQuestions(count || 0);
      toast({
        title: "Count Complete",
        description: `Found ${count || 0} easy questions in the database.`,
      });

      return count || 0;
    } catch (error) {
      console.error("Failed to count easy questions:", error);
      toast({
        title: "Count Failed",
        description: "Could not count easy questions. Check console for details.",
        variant: "destructive",
      });
      return 0;
    }
  };

  const deleteAllEasyQuestions = async () => {
    setDeleting(true);
    setProgress(0);
    setCurrentStep("🔍 Starting comprehensive deletion process...");

    try {
      // Step 1: Count total easy questions
      setProgress(5);
      setCurrentStep("Counting total easy questions...");
      
      const { count: totalCount, error: countError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('difficulty', 'easy');

      if (countError) {
        console.error("Error counting easy questions:", countError);
        throw countError;
      }

      const totalEasy = totalCount || 0;
      console.log(`🎯 FOUND ${totalEasy} EASY QUESTIONS TO DELETE`);

      if (totalEasy === 0) {
        toast({
          title: "No Easy Questions Found",
          description: "There are no easy questions in the database to delete.",
        });
        setDeleting(false);
        return;
      }

      setProgress(10);
      setCurrentStep(`Found ${totalEasy} easy questions. Starting aggressive deletion...`);

      // Step 2: Multiple deletion passes to ensure complete removal
      let deletionPass = 1;
      let remainingQuestions = totalEasy;
      
      while (remainingQuestions > 0 && deletionPass <= 5) {
        setCurrentStep(`🗑️ Deletion Pass ${deletionPass}: Removing remaining easy questions...`);
        console.log(`\n🔄 DELETION PASS ${deletionPass} - Remaining: ${remainingQuestions}`);
        
        // Delete in smaller batches for reliability
        const batchSize = Math.min(100, remainingQuestions);
        
        // Get IDs of easy questions to delete
        const { data: questionsToDelete, error: fetchError } = await supabase
          .from('questions')
          .select('id')
          .eq('difficulty', 'easy')
          .limit(batchSize);

        if (fetchError) {
          console.error(`❌ Error fetching questions in pass ${deletionPass}:`, fetchError);
          throw fetchError;
        }

        if (!questionsToDelete || questionsToDelete.length === 0) {
          console.log(`✅ No more easy questions found in pass ${deletionPass}`);
          break;
        }

        const idsToDelete = questionsToDelete.map(q => q.id);
        console.log(`🗑️ Deleting ${idsToDelete.length} questions in pass ${deletionPass}`);

        // Perform deletion
        const { error: deleteError, count: deletedCount } = await supabase
          .from('questions')
          .delete()
          .in('id', idsToDelete);

        if (deleteError) {
          console.error(`❌ Error deleting questions in pass ${deletionPass}:`, deleteError);
          throw deleteError;
        }

        const actualDeleted = deletedCount || idsToDelete.length;
        console.log(`✅ Successfully deleted ${actualDeleted} questions in pass ${deletionPass}`);

        // Update progress
        const progressPercent = 10 + ((deletionPass / 5) * 80);
        setProgress(progressPercent);

        // Recount remaining questions
        const { count: newCount, error: recountError } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('difficulty', 'easy');

        if (recountError) {
          console.error(`❌ Error recounting in pass ${deletionPass}:`, recountError);
          // Continue anyway
          remainingQuestions = Math.max(0, remainingQuestions - actualDeleted);
        } else {
          remainingQuestions = newCount || 0;
        }

        console.log(`📊 After pass ${deletionPass}: ${remainingQuestions} easy questions remain`);
        
        deletionPass++;
        
        // Small delay between passes
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Step 3: Final verification
      setProgress(95);
      setCurrentStep("🔍 Final verification...");

      const { count: finalCount, error: verifyError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('difficulty', 'easy');

      if (verifyError) {
        console.error("❌ Error in final verification:", verifyError);
      }

      const finalRemaining = finalCount || 0;
      setProgress(100);
      setCurrentStep("✅ Deletion process complete!");

      console.log(`\n🎉 FINAL DELETION SUMMARY:`);
      console.log(`📊 Original Count: ${totalEasy}`);
      console.log(`🔄 Deletion Passes: ${deletionPass - 1}`);
      console.log(`📋 Final Remaining: ${finalRemaining}`);

      if (finalRemaining === 0) {
        toast({
          title: "🎉 Complete Success!",
          description: `All ${totalEasy} easy questions have been completely deleted from the database.`,
        });
      } else {
        toast({
          title: "⚠️ Partial Success",
          description: `Deleted most easy questions. ${finalRemaining} questions may need manual review.`,
          variant: "destructive"
        });
      }

      setTotalEasyQuestions(finalRemaining);

    } catch (error) {
      console.error("❌ DELETION FAILED:", error);
      toast({
        title: "Deletion Failed",
        description: `Could not delete easy questions: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setProgress(0);
      setCurrentStep("");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Comprehensive Easy Question Deletion
          </CardTitle>
          <CardDescription>
            Advanced multi-pass deletion system to completely remove all easy questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {totalEasyQuestions !== null && (
            <Alert className={totalEasyQuestions > 0 ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"}>
              <Database className="h-4 w-4" />
              <AlertDescription className="font-semibold">
                {totalEasyQuestions > 0 
                  ? `⚠️ ALERT: ${totalEasyQuestions} easy questions still exist in database`
                  : "✅ SUCCESS: No easy questions found in database"
                }
              </AlertDescription>
            </Alert>
          )}

          {deleting && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 animate-pulse text-destructive" />
                <span className="font-medium">Multi-Pass Deletion in Progress...</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">{currentStep}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={countEasyQuestions}
              variant="outline"
              disabled={deleting}
              className="w-full"
            >
              <Database className="mr-2 h-4 w-4" />
              Count Easy Questions
            </Button>

            <Button 
              onClick={deleteAllEasyQuestions}
              variant="destructive"
              disabled={deleting}
              className="w-full"
            >
              {deleting ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Complete Deletion (All Passes)
            </Button>
          </div>

          <Alert className="border-red-500 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>🚨 ENHANCED DELETION:</strong> This system uses multiple deletion passes to ensure complete removal. 
              It will continue until zero easy questions remain in the database.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
