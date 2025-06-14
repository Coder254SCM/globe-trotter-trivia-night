
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, AlertTriangle, Search, FileX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { performQuestionPreCheck, batchPreCheck, QuestionToCheck } from "@/utils/quiz/questionPreCheck";

export const QuestionPreCheckDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [preCheckResults, setPreCheckResults] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const runPreCheck = async () => {
    setLoading(true);
    setProgress(0);

    try {
      console.log("🔍 Running comprehensive pre-check on all questions...");

      // Get all questions from Supabase
      const { data: questions, error } = await supabase
        .from('questions')
        .select(`
          id,
          text,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_answer,
          category,
          countries (name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching questions:", error);
        throw error;
      }

      setProgress(25);

      // Transform to pre-check format
      const questionsToCheck: QuestionToCheck[] = (questions || []).map(q => ({
        text: q.text,
        option_a: q.option_a || '',
        option_b: q.option_b || '',
        option_c: q.option_c || '',
        option_d: q.option_d || '',
        correct_answer: q.correct_answer,
        country_name: q.countries?.name,
        category: q.category
      }));

      setProgress(50);

      // Run batch pre-check
      const results = batchPreCheck(questionsToCheck);
      
      // Add question IDs to results for reference
      const detailedResults = {
        ...results,
        results: results.results.map((result, index) => ({
          ...result,
          questionId: questions[index]?.id,
          fullText: questions[index]?.text
        }))
      };

      setPreCheckResults(detailedResults);
      setProgress(100);

      console.log("✅ Pre-check complete:", {
        total: results.totalQuestions,
        valid: results.validQuestions,
        critical: results.criticalIssues,
        high: results.highIssues
      });

      toast({
        title: "Pre-Check Complete",
        description: `Analyzed ${results.totalQuestions} questions. Found ${results.criticalIssues} critical issues.`,
        variant: results.criticalIssues > 0 ? "destructive" : "default"
      });

    } catch (error) {
      console.error("Pre-check failed:", error);
      toast({
        title: "Pre-Check Failed",
        description: "Could not complete the pre-check. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runPreCheck();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 animate-pulse text-primary" />
            <span className="font-medium">Running Question Pre-Check...</span>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">Analyzing questions for quality issues...</p>
        </div>
      </Card>
    );
  }

  if (!preCheckResults) return null;

  const criticalQuestions = preCheckResults.results.filter(r => r.severity === 'critical');
  const highIssueQuestions = preCheckResults.results.filter(r => r.severity === 'high');

  return (
    <div className="space-y-6">
      {/* Summary Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            Question Pre-Check Results
          </CardTitle>
          <CardDescription>
            Proactive quality analysis of all questions in your database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{preCheckResults.totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{preCheckResults.validQuestions}</div>
              <div className="text-sm text-muted-foreground">Valid Questions</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{preCheckResults.criticalIssues}</div>
              <div className="text-sm text-muted-foreground">Critical Issues</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{preCheckResults.highIssues}</div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Quality</span>
                <span>{Math.round((preCheckResults.validQuestions / preCheckResults.totalQuestions) * 100)}%</span>
              </div>
              <Progress value={(preCheckResults.validQuestions / preCheckResults.totalQuestions) * 100} />
            </div>

            <Button onClick={runPreCheck} variant="outline" className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Re-run Pre-Check
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Critical Issues */}
      {criticalQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Critical Issues ({criticalQuestions.length})
            </CardTitle>
            <CardDescription>
              Questions with severe problems that need immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {criticalQuestions.slice(0, 20).map((question, idx) => (
                <div key={idx} className="border rounded p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      ID: {question.questionId}
                    </span>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-medium mb-1">Question:</p>
                    <p className="bg-muted p-2 rounded text-xs">{question.fullText?.substring(0, 150)}...</p>
                  </div>
                  
                  <div className="space-y-1">
                    {question.issues.map((issue, issueIdx) => (
                      <div key={issueIdx} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                        <span className="text-xs text-red-700">{issue}</span>
                      </div>
                    ))}
                  </div>

                  {question.recommendations.length > 0 && (
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <p className="text-xs font-medium text-blue-800">Recommendations:</p>
                      {question.recommendations.map((rec, recIdx) => (
                        <p key={recIdx} className="text-xs text-blue-700">• {rec}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* High Priority Issues */}
      {highIssueQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-yellow-600">High Priority Issues ({highIssueQuestions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {highIssueQuestions.slice(0, 10).map((question, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm font-mono">{question.questionId}</span>
                  <div className="text-xs text-muted-foreground">
                    {question.issues.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
