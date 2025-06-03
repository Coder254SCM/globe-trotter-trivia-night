
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle, FileText } from "lucide-react";
import { runComprehensiveAudit } from "../../utils/quiz/audit/comprehensiveAudit";

export const QuestionAuditDashboard = () => {
  const [auditResults, setAuditResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAudit = () => {
    setLoading(true);
    setTimeout(() => {
      const results = runComprehensiveAudit();
      setAuditResults(results);
      setLoading(false);
      
      // Log detailed results
      console.log("🚨 AUDIT RESULTS:");
      console.log(`Total Questions: ${results.totalQuestions}`);
      console.log(`Relevant: ${results.relevantQuestions}`);
      console.log(`Irrelevant: ${results.irrelevantQuestions}`);
      console.log(`Accuracy: ${results.overallAccuracy.toFixed(1)}%`);
      
      if (results.irrelevantQuestions > 0) {
        console.log("\n🚨 WORST OFFENDERS:");
        results.questionsByCountry.slice(0, 10).forEach((country: any) => {
          if (country.irrelevantCount > 0) {
            console.log(`${country.countryName}: ${country.irrelevantCount} irrelevant questions`);
            country.irrelevantQuestions.slice(0, 3).forEach((q: any) => {
              console.log(`  - ${q.text} (${q.reason})`);
            });
          }
        });
      }
    }, 1000);
  };

  useEffect(() => {
    runAudit();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Running comprehensive question audit...</span>
        </div>
      </Card>
    );
  }

  if (!auditResults) return null;

  const accuracyColor = auditResults.overallAccuracy >= 80 ? "text-green-600" : 
                       auditResults.overallAccuracy >= 60 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Question Quality Audit
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{auditResults.totalQuestions}</div>
            <div className="text-sm text-muted-foreground">Total Questions</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{auditResults.relevantQuestions}</div>
            <div className="text-sm text-muted-foreground">Relevant</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{auditResults.irrelevantQuestions}</div>
            <div className="text-sm text-muted-foreground">Irrelevant</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${accuracyColor}`}>
              {auditResults.overallAccuracy.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
        </div>

        <Progress value={auditResults.overallAccuracy} className="mb-4" />

        <div className="space-y-2">
          {auditResults.recommendations.map((rec: string, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span>{rec}</span>
            </div>
          ))}
        </div>

        <Button onClick={runAudit} className="mt-4">
          Re-run Audit
        </Button>
      </Card>

      {auditResults.questionsByCountry.filter((c: any) => c.irrelevantCount > 0).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Countries with Question Issues</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {auditResults.questionsByCountry
              .filter((country: any) => country.irrelevantCount > 0)
              .slice(0, 20)
              .map((country: any) => (
                <div key={country.countryId} className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{country.countryName}</span>
                    <Badge variant={country.irrelevantCount > 5 ? "destructive" : "secondary"}>
                      {country.irrelevantCount} issues
                    </Badge>
                  </div>
                  
                  {country.irrelevantQuestions.slice(0, 2).map((q: any) => (
                    <div key={q.id} className="text-sm text-muted-foreground ml-4">
                      • {q.text}
                      <br />
                      <span className="text-xs text-red-600">Reason: {q.reason}</span>
                    </div>
                  ))}
                  
                  {country.irrelevantQuestions.length > 2 && (
                    <div className="text-xs text-muted-foreground ml-4">
                      ... and {country.irrelevantQuestions.length - 2} more
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
