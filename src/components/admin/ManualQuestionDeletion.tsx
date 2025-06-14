
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
    setCurrentStep("🔍 Finding all easy questions...");

    try {
      // First, get the total count
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

      setCurrentStep(`Found ${totalEasy} easy questions. Starting deletion...`);
      setProgress(10);

      // Get all easy question IDs in smaller batches
      const batchSize = 50;
      let allEasyQuestionIds: string[] = [];
      let offset = 0;

      while (true) {
        const { data: batch, error: fetchError } = await supabase
          .from('questions')
          .select('id')
          .eq('difficulty', 'easy')
          .range(offset, offset + batchSize - 1);

        if (fetchError) {
          console.error("Error fetching easy question batch:", fetchError);
          throw fetchError;
        }

        if (!batch || batch.length === 0) break;

        allEasyQuestionIds.push(...batch.map(q => q.id));
        offset += batchSize;

        console.log(`📥 Fetched batch: ${batch.length} questions (total so far: ${allEasyQuestionIds.length})`);
      }

      console.log(`🗑️ TOTAL EASY QUESTIONS TO DELETE: ${allEasyQuestionIds.length}`);
      setProgress(25);

      if (allEasyQuestionIds.length === 0) {
        toast({
          title: "No Easy Questions Found",
          description: "No easy questions were found to delete.",
        });
        setDeleting(false);
        return;
      }

      // Delete in small batches
      const deleteBatchSize = 25;
      let totalDeleted = 0;

      for (let i = 0; i < allEasyQuestionIds.length; i += deleteBatchSize) {
        const batch = allEasyQuestionIds.slice(i, i + deleteBatchSize);
        
        console.log(`🗑️ DELETING BATCH ${Math.floor(i/deleteBatchSize) + 1}/${Math.ceil(allEasyQuestionIds.length/deleteBatchSize)}: ${batch.length} questions`);
        
        setCurrentStep(`Deleting batch ${Math.floor(i/deleteBatchSize) + 1}/${Math.ceil(allEasyQuestionIds.length/deleteBatchSize)} (${batch.length} questions)...`);

        const { error: deleteError, count: deletedCount } = await supabase
          .from('questions')
          .delete()
          .in('id', batch);

        if (deleteError) {
          console.error(`❌ ERROR DELETING BATCH:`, deleteError);
          throw deleteError;
        }

        const actualDeleted = deletedCount || batch.length;
        totalDeleted += actualDeleted;
        
        console.log(`✅ SUCCESSFULLY DELETED ${actualDeleted} QUESTIONS FROM BATCH`);
        
        const progressPercent = 25 + ((totalDeleted / allEasyQuestionIds.length) * 70);
        setProgress(progressPercent);

        // Small delay to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setProgress(95);
      setCurrentStep("Verifying deletion...");

      // Verify deletion
      const { count: remainingCount, error: verifyError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('difficulty', 'easy');

      if (verifyError) {
        console.error("Error verifying deletion:", verifyError);
      }

      setProgress(100);
      setCurrentStep("Deletion complete!");

      console.log(`🎉 DELETION SUMMARY:`);
      console.log(`📊 Original Count: ${totalEasy}`);
      console.log(`🗑️ Attempted to Delete: ${allEasyQuestionIds.length}`);
      console.log(`✅ Actually Deleted: ${totalDeleted}`);
      console.log(`📋 Remaining Easy Questions: ${remainingCount || 0}`);

      toast({
        title: "Deletion Complete!",
        description: `Successfully deleted ${totalDeleted} easy questions. ${remainingCount || 0} easy questions remain.`,
        variant: (remainingCount || 0) > 0 ? "destructive" : "default"
      });

      // Update the count display
      setTotalEasyQuestions(remainingCount || 0);

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
            Delete All Easy Questions
          </CardTitle>
          <CardDescription>
            Permanently remove all questions with difficulty level "easy" from your Supabase database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {totalEasyQuestions !== null && (
            <Alert className={totalEasyQuestions > 0 ? "border-yellow-500 bg-yellow-50" : "border-green-500 bg-green-50"}>
              <Database className="h-4 w-4" />
              <AlertDescription className="font-semibold">
                {totalEasyQuestions > 0 
                  ? `📊 Found ${totalEasyQuestions} easy questions in database`
                  : "✅ No easy questions found in database"
                }
              </AlertDescription>
            </Alert>
          )}

          {deleting && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 animate-pulse text-destructive" />
                <span className="font-medium">Deleting Easy Questions...</span>
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
              disabled={deleting || totalEasyQuestions === 0}
              className="w-full"
            >
              {deleting ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete All Easy Questions
            </Button>
          </div>

          <Alert className="border-red-500 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>⚠️ WARNING:</strong> This action will permanently delete ALL easy questions from your database. This cannot be undone. Make sure you have a backup if needed.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
