
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QuestionQualityService, QuestionQualityResult } from "@/services/quality/questionQualityService";
import { AlertTriangle, CheckCircle, XCircle, Wrench, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const QuestionQualityDashboard = () => {
  const [auditResults, setAuditResults] = useState<QuestionQualityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    validQuestions: 0,
    criticalIssues: 0,
    averageQualityScore: 0,
    issuesByType: {} as Record<string, number>
  });
  const [autoFixing, setAutoFixing] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadQualityStats();
  }, []);

  const loadQualityStats = async () => {
    try {
      const stats = await QuestionQualityService.getQualityStats();
      setStats(stats);
    } catch (error) {
      console.error('Failed to load quality stats:', error);
    }
  };

  const runFullAudit = async () => {
    setLoading(true);
    try {
      const results = await QuestionQualityService.auditAllQuestions();
      setAuditResults(results);
      
      // Update stats
      await loadQualityStats();
      
      toast({
        title: "Quality Audit Complete",
        description: `Audited ${results.length} questions. Found ${results.filter(r => !r.isValid).length} issues.`,
      });
    } catch (error) {
      console.error('Audit failed:', error);
      toast({
        title: "Audit Failed",
        description: "Failed to complete quality audit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const autoFixQuestion = async (questionId: string) => {
    setAutoFixing(prev => [...prev, questionId]);
    
    try {
      const success = await QuestionQualityService.autoFixQuestion(questionId);
      
      if (success) {
        toast({
          title: "Question Fixed",
          description: "Question has been automatically corrected",
        });
        
        // Refresh audit results
        await runFullAudit();
      } else {
        toast({
          title: "Auto-fix Failed",
          description: "Could not automatically fix this question",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Auto-fix failed:', error);
      toast({
        title: "Auto-fix Error",
        description: "An error occurred while fixing the question",
        variant: "destructive",
      });
    } finally {
      setAutoFixing(prev => prev.filter(id => id !== questionId));
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Question Quality Control</h2>
        <Button onClick={runFullAudit} disabled={loading}>
          {loading ? 'Auditing...' : 'Run Full Audit'}
        </Button>
      </div>

      {/* Quality Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Questions</p>
              <p className="text-2xl font-bold">{stats.totalQuestions}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Valid Questions</p>
              <p className="text-2xl font-bold text-green-600">{stats.validQuestions}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical Issues</p>
              <p className="text-2xl font-bold text-red-600">{stats.criticalIssues}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Quality Score</p>
              <p className={`text-2xl font-bold ${getQualityColor(stats.averageQualityScore)}`}>
                {stats.averageQualityScore.toFixed(1)}%
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
      </div>

      {/* Quality Progress */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Overall Quality Health</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Question Quality</span>
            <span>{stats.averageQualityScore.toFixed(1)}%</span>
          </div>
          <Progress value={stats.averageQualityScore} className="h-3" />
        </div>
      </Card>

      {/* Critical Issues Alert */}
      {stats.criticalIssues > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <strong>Critical Issues Found:</strong> {stats.criticalIssues} questions have critical quality issues that need immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Issue Types Breakdown */}
      {Object.keys(stats.issuesByType).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Issue Types</h3>
          <div className="space-y-2">
            {Object.entries(stats.issuesByType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="capitalize">{type.replace(/_/g, ' ')}</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Audit Results */}
      {auditResults.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Audit Results</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {auditResults
              .filter(result => !result.isValid)
              .slice(0, 20)
              .map((result) => (
                <div key={result.questionId} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{result.questionText}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={result.isValid ? "default" : "destructive"}>
                          Quality: {result.qualityScore}%
                        </Badge>
                        <Badge variant="outline">
                          {result.issues.length} issues
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => autoFixQuestion(result.questionId)}
                      disabled={autoFixing.includes(result.questionId)}
                      className="ml-4"
                    >
                      {autoFixing.includes(result.questionId) ? (
                        'Fixing...'
                      ) : (
                        <>
                          <Wrench className="h-4 w-4 mr-1" />
                          Auto-Fix
                        </>
                      )}
                    </Button>
                  </div>

                  {result.issues.length > 0 && (
                    <div className="space-y-1">
                      {result.issues.map((issue, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                            {issue.severity}
                          </Badge>
                          <span>{issue.description}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {result.autoFixSuggestions.length > 0 && (
                    <div className="bg-blue-50 p-3 rounded text-sm">
                      <p className="font-medium text-blue-800 mb-1">Auto-fix suggestions:</p>
                      <ul className="text-blue-700 space-y-1">
                        {result.autoFixSuggestions.map((suggestion, index) => (
                          <li key={index}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
};
