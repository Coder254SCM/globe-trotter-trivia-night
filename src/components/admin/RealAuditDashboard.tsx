
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react";
import { performRealAudit } from "../../utils/quiz/audit/realAudit";
import countries from "../../data/countries";
import { countryQuestions } from "../../utils/quiz/questionSets";

export const RealAuditDashboard = () => {
  const [auditResults, setAuditResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const runRealAudit = () => {
    setLoading(true);
    setTimeout(() => {
      const results = performRealAudit();
      setAuditResults(results);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    runRealAudit();
  }, []);

  // Quick stats calculation
  const quickStats = {
    totalCountries: countries.length,
    countriesWithQuestions: Object.keys(countryQuestions).length,
    handCraftedCountries: 15, // We know we have 15 hand-crafted sets
    generatedCountries: Object.keys(countryQuestions).length - 15
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Running REAL comprehensive audit...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Truth Alert */}
      <Alert className="border-red-500 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="font-semibold">
          REALITY CHECK: We have {quickStats.totalCountries} countries total, but only {quickStats.countriesWithQuestions} have question sets. 
          Only {quickStats.handCraftedCountries} countries have hand-crafted questions. The rest are auto-generated with questionable quality.
        </AlertDescription>
      </Alert>

      {auditResults && (
        <>
          {/* Main Stats */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6" />
              REAL Question Quality Audit
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{auditResults.totalCountries}</div>
                <div className="text-sm text-muted-foreground">Total Countries</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{auditResults.actualCountriesWithQuestions}</div>
                <div className="text-sm text-muted-foreground">Have Questions</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{auditResults.irrelevantQuestions}</div>
                <div className="text-sm text-muted-foreground">Irrelevant Questions</div>
              </div>
              
              <div className="text-center">
                <div className={`text-3xl font-bold ${auditResults.accuracyPercentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                  {auditResults.accuracyPercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>

            <Progress value={auditResults.accuracyPercentage} className="mb-4" />

            <div className="flex gap-2 mb-4">
              <Button onClick={runRealAudit}>Re-run Audit</Button>
              <Button variant="outline" onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? 'Hide' : 'Show'} Details
              </Button>
            </div>
          </Card>

          {/* Worst Offenders */}
          {auditResults.worstOffenders.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-600">🚨 Countries with Most Irrelevant Questions</h3>
              <div className="space-y-2">
                {auditResults.worstOffenders.map((country: any) => (
                  <div key={country.countryName} className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">{country.countryName}</span>
                    <Badge variant="destructive">
                      {country.irrelevantCount}/{country.totalQuestions} irrelevant
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Detailed Breakdown */}
          {showDetails && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Detailed Country Breakdown</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {auditResults.countryBreakdown
                  .filter((country: any) => country.questionCount > 0)
                  .sort((a: any, b: any) => b.irrelevantCount - a.irrelevantCount)
                  .map((country: any) => (
                    <div key={country.countryId} className="border rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{country.countryName}</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">{country.questionCount} total</Badge>
                          {country.irrelevantCount > 0 && (
                            <Badge variant="destructive">{country.irrelevantCount} bad</Badge>
                          )}
                        </div>
                      </div>
                      
                      {country.issues.length > 0 && (
                        <div className="text-sm text-red-600 space-y-1">
                          {country.issues.slice(0, 3).map((issue: string, idx: number) => (
                            <div key={idx} className="text-xs">{issue}</div>
                          ))}
                          {country.issues.length > 3 && (
                            <div className="text-xs">... and {country.issues.length - 3} more issues</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
