
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, AlertTriangle, Database, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ManualQuestionDeletion = () => {
  const [questionIds, setQuestionIds] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const handleDirectSQLDeletion = async () => {
    const confirmed = window.confirm(
      "⚠️ WARNING: This will permanently delete ALL placeholder questions from Supabase. This cannot be undone. Are you sure?"
    );
    
    if (!confirmed) return;

    setDeleting(true);
    setErrors([]);
    setDeletedCount(0);
    
    try {
      console.log("🗑️ Starting comprehensive deletion of placeholder questions");

      // First, get all questions that match placeholder patterns
      const { data: placeholderQuestions, error: fetchError } = await supabase
        .from('questions')
        .select('id, text, option_a, option_b, option_c, option_d')
        .or('text.ilike.%correct answer for%,text.ilike.%option a for%,text.ilike.%option b for%,text.ilike.%option c for%,text.ilike.%option d for%,option_a.ilike.%correct answer for%,option_b.ilike.%correct answer for%,option_c.ilike.%correct answer for%,option_d.ilike.%correct answer for%,option_a.ilike.%incorrect option%,option_b.ilike.%incorrect option%,option_c.ilike.%incorrect option%,option_d.ilike.%incorrect option%');

      if (fetchError) {
        console.error("Error fetching placeholder questions:", fetchError);
        setErrors([`Fetch error: ${fetchError.message}`]);
        return;
      }

      const questionIdsToDelete = placeholderQuestions?.map(q => q.id) || [];
      console.log(`📋 Found ${questionIdsToDelete.length} placeholder questions to delete`);

      if (questionIdsToDelete.length === 0) {
        toast({
          title: "No Placeholder Questions Found",
          description: "No questions with placeholder patterns were found.",
        });
        return;
      }

      // Delete in smaller batches of 50
      const batchSize = 50;
      let totalDeleted = 0;
      
      for (let i = 0; i < questionIdsToDelete.length; i += batchSize) {
        const batch = questionIdsToDelete.slice(i, i + batchSize);
        
        console.log(`🗑️ Deleting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(questionIdsToDelete.length/batchSize)}: ${batch.length} questions`);
        
        const { error, count } = await supabase
          .from('questions')
          .delete()
          .in('id', batch);

        if (error) {
          console.error(`Error deleting batch:`, error);
          setErrors(prev => [...prev, `Batch ${Math.floor(i/batchSize) + 1} error: ${error.message}`]);
        } else {
          const deletedInBatch = count || batch.length;
          totalDeleted += deletedInBatch;
          console.log(`✅ Successfully deleted ${deletedInBatch} questions from batch`);
        }
        
        setDeletedCount(totalDeleted);
        
        // Small delay between batches to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`🎉 Deletion complete! Total deleted: ${totalDeleted}/${questionIdsToDelete.length}`);

      toast({
        title: "Cleanup Complete!",
        description: `Successfully deleted ${totalDeleted} placeholder questions from Supabase.`,
      });

    } catch (error) {
      console.error("Failed to delete placeholder questions:", error);
      setErrors(prev => [...prev, `Unexpected error: ${error.message}`]);
      toast({
        title: "Deletion Failed",
        description: "Could not delete placeholder questions. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleManualDeletion = async () => {
    if (!questionIds.trim()) {
      toast({
        title: "No IDs Provided",
        description: "Please enter question IDs to delete.",
        variant: "destructive",
      });
      return;
    }

    const ids = questionIds.split('\n').map(id => id.trim()).filter(id => id);
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${ids.length} questions? This cannot be undone.`
    );
    
    if (!confirmed) return;

    setDeleting(true);
    setErrors([]);
    
    try {
      console.log(`🗑️ Manually deleting ${ids.length} questions:`, ids);

      const { error, count } = await supabase
        .from('questions')
        .delete()
        .in('id', ids);

      if (error) {
        console.error("Error deleting questions:", error);
        setErrors([error.message]);
        toast({
          title: "Deletion Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setDeletedCount(count || 0);
        toast({
          title: "Manual Deletion Complete!",
          description: `Successfully deleted ${count || 0} questions.`,
        });
        setQuestionIds(""); // Clear the textarea
      }

    } catch (error) {
      console.error("Failed to delete questions:", error);
      setErrors([error.message]);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-6 w-6" />
            Manual Question Deletion
          </CardTitle>
          <CardDescription>
            Direct deletion tools for removing problematic questions from Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Automatic Placeholder Deletion */}
          <div className="border rounded p-4 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold">Automatic Placeholder Question Cleanup</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              This will find and delete ALL questions containing placeholder text patterns like "correct answer for", "option a for", "incorrect option", etc.
            </p>
            <Button 
              onClick={handleDirectSQLDeletion}
              disabled={deleting}
              variant="destructive"
              className="w-full"
            >
              {deleting ? "Deleting..." : "🗑️ Find & Delete All Placeholder Questions"}
            </Button>
          </div>

          {/* Manual ID-based Deletion */}
          <div className="border rounded p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Manual Deletion by Question IDs</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter specific question IDs (one per line) to delete them manually:
            </p>
            <Textarea
              placeholder="Enter question IDs, one per line:&#10;question-1&#10;question-2&#10;question-3"
              value={questionIds}
              onChange={(e) => setQuestionIds(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
            <Button 
              onClick={handleManualDeletion}
              disabled={deleting || !questionIds.trim()}
              variant="destructive"
              className="w-full"
            >
              {deleting ? "Deleting..." : `Delete ${questionIds.split('\n').filter(id => id.trim()).length} Questions`}
            </Button>
          </div>

          {/* Results */}
          {deletedCount > 0 && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="font-semibold text-green-800">
                ✅ Successfully deleted {deletedCount} questions from Supabase!
              </AlertDescription>
            </Alert>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <Alert className="border-red-500 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-semibold text-red-800">Deletion Errors:</p>
                  {errors.map((error, idx) => (
                    <p key={idx} className="text-sm text-red-700">• {error}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Instructions */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> These operations permanently delete data from your Supabase database. 
              Always review the questions carefully before deletion. Consider backing up your data first.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
