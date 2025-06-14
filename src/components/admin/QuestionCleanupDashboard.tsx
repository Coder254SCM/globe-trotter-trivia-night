
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Trash2, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { QuestionCleanupService, CleanupResult } from "@/services/supabase/questionCleanupService";
import { useToast } from "@/hooks/use-toast";

export const QuestionCleanupDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [cleanupResult, setCleanupResult] = useState<CleanupResult | null>(null);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statistics = await QuestionCleanupService.getCleanupStats();
      setStats(statistics);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const runCleanup = async () => {
    setLoading(true);
    try {
      console.log('🧹 Starting comprehensive cleanup...');
      
      const result = await QuestionCleanupService.performComprehensiveCleanup();
      setCleanupResult(result);
      
      // Reload stats after cleanup
      await loadStats();
      
      if (result.errors.length === 0) {
        toast({
          title: "Cleanup Successful",
          description: result.summary,
          variant: "default",
        });
      } else {
        toast({
          title: "Cleanup Completed with Errors",
          description: `${result.errors.length} errors occurred. Check console for details.`,
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Cleanup failed:', error);
      toast({
        title: "Cleanup Failed",
        description: "Failed to complete cleanup process.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Alert */}
      <Alert className="border-blue-500 bg-blue-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="font-semibold">
          This dashboard performs comprehensive question cleanup including removing easy questions, 
          placeholder content, duplicates, and broken images.
        </AlertDescription>
      </Alert>

      {/* Current Stats */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Current Question Statistics</CardTitle>
            <CardDescription>Overview of questions before cleanup</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.questionsByDifficulty.medium || 0}
                </div>
                <div className="text-sm text-muted-foreground">Medium Questions</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.questionsByDifficulty.hard || 0}
                </div>
                <div className="text-sm text-muted-foreground">Hard Questions</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.questionsByDifficulty.easy || 0}
                </div>
                <div className="text-sm text-muted-foreground">Easy Questions (to delete)</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Questions with Images</span>
                <span>{stats.questionsWithImages}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Estimated Issues</span>
                <span>{stats.estimatedIssues}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cleanup Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Question Cleanup Operations
          </CardTitle>
          <CardDescription>
            Remove problematic questions and improve overall quality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-semibold mb-2">Cleanup Process:</h4>
              <ul className="text-sm space-y-1">
                <li>• Delete all easy questions completely</li>
                <li>• Remove questions with placeholder content</li>
                <li>• Delete duplicate questions</li>
                <li>• Fix broken image URLs</li>
                <li>• Validate remaining question quality</li>
              </ul>
            </div>

            <Button 
              onClick={runCleanup} 
              disabled={loading}
              className="w-full"
              variant={loading ? "secondary" : "destructive"}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Comprehensive Cleanup...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Start Comprehensive Cleanup
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cleanup Results */}
      {cleanupResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Cleanup Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{cleanupResult.deletedQuestions}</div>
                  <div className="text-sm text-muted-foreground">Questions Deleted</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{cleanupResult.fixedQuestions}</div>
                  <div className="text-sm text-muted-foreground">Questions Fixed</div>
                </div>
              </div>

              <Alert className={cleanupResult.errors.length > 0 ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Summary:</strong> {cleanupResult.summary}
                </AlertDescription>
              </Alert>

              {cleanupResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600">Errors:</h4>
                  {cleanupResult.errors.map((error, idx) => (
                    <div key={idx} className="text-sm bg-red-50 p-2 rounded border border-red-200">
                      {error}
                    </div>
                  ))}
                </div>
              )}

              <Button onClick={loadStats} variant="outline" className="w-full">
                Refresh Statistics
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
