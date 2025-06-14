
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, CheckCircle, Database, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuditResult {
  totalQuestions: number;
  questionsByCountry: Array<{
    countryId: string;
    countryName: string;
    questionCount: number;
    byDifficulty: {
      easy: number;
      medium: number;
      hard: number;
    };
    byCategory: Record<string, number>;
  }>;
  totalCountries: number;
  countriesWithQuestions: number;
  avgQuestionsPerCountry: number;
  issues: string[];
}

export const SupabaseQuestionAudit = () => {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const { toast } = useToast();

  const runFullAudit = async () => {
    setLoading(true);
    try {
      console.log("🔍 Starting Supabase question audit...");
      
      // Get all countries
      const { data: countries, error: countriesError } = await supabase
        .from('countries')
        .select('id, name')
        .order('name');

      if (countriesError) {
        throw countriesError;
      }

      // Get all questions
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*');

      if (questionsError) {
        throw questionsError;
      }

      console.log(`📊 Found ${countries?.length || 0} countries and ${questions?.length || 0} questions`);

      const questionsByCountry: AuditResult['questionsByCountry'] = [];
      const issues: string[] = [];

      countries?.forEach(country => {
        const countryQuestions = questions?.filter(q => q.country_id === country.id) || [];
        
        const byDifficulty = {
          easy: countryQuestions.filter(q => q.difficulty === 'easy').length,
          medium: countryQuestions.filter(q => q.difficulty === 'medium').length,
          hard: countryQuestions.filter(q => q.difficulty === 'hard').length,
        };

        const byCategory: Record<string, number> = {};
        countryQuestions.forEach(q => {
          byCategory[q.category] = (byCategory[q.category] || 0) + 1;
        });

        questionsByCountry.push({
          countryId: country.id,
          countryName: country.name,
          questionCount: countryQuestions.length,
          byDifficulty,
          byCategory
        });

        // Check for issues
        if (countryQuestions.length === 0) {
          issues.push(`${country.name} has no questions`);
        } else if (countryQuestions.length < 10) {
          issues.push(`${country.name} has only ${countryQuestions.length} questions`);
        }
      });

      const result: AuditResult = {
        totalQuestions: questions?.length || 0,
        questionsByCountry: questionsByCountry.sort((a, b) => b.questionCount - a.questionCount),
        totalCountries: countries?.length || 0,
        countriesWithQuestions: questionsByCountry.filter(c => c.questionCount > 0).length,
        avgQuestionsPerCountry: questionsByCountry.length > 0 
          ? Math.round((questions?.length || 0) / questionsByCountry.length) 
          : 0,
        issues
      };

      setAuditResult(result);
      
      console.log("📈 AUDIT RESULTS:");
      console.log(`Total Questions: ${result.totalQuestions}`);
      console.log(`Countries with Questions: ${result.countriesWithQuestions}/${result.totalCountries}`);
      console.log(`Average Questions per Country: ${result.avgQuestionsPerCountry}`);
      
      if (result.issues.length > 0) {
        console.log("⚠️ ISSUES FOUND:");
        result.issues.forEach(issue => console.log(`- ${issue}`));
      }

      toast({
        title: "Audit Complete",
        description: `Found ${result.totalQuestions} questions across ${result.countriesWithQuestions} countries`,
      });

    } catch (error) {
      console.error("Audit failed:", error);
      toast({
        title: "Audit Failed",
        description: "Could not complete the audit. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testQuestionFetch = async (countryId: string) => {
    try {
      console.log(`🧪 Testing question fetch for country: ${countryId}`);
      
      const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('country_id', countryId)
        .limit(10);

      if (error) {
        console.error("Question fetch error:", error);
        toast({
          title: "Fetch Test Failed",
          description: `Error fetching questions: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log(`✅ Successfully fetched ${questions?.length || 0} questions for ${countryId}`);
      toast({
        title: "Fetch Test Success",
        description: `Found ${questions?.length || 0} questions for the selected country`,
      });

    } catch (error) {
      console.error("Fetch test failed:", error);
    }
  };

  useEffect(() => {
    runFullAudit();
  }, []);

  if (loading && !auditResult) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Running Supabase question audit...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Supabase Question Audit</h2>
          </div>
          <Button onClick={runFullAudit} disabled={loading}>
            {loading ? "Running..." : "Refresh Audit"}
          </Button>
        </div>

        {auditResult && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{auditResult.totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{auditResult.countriesWithQuestions}</div>
                <div className="text-sm text-muted-foreground">Countries with Questions</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{auditResult.totalCountries}</div>
                <div className="text-sm text-muted-foreground">Total Countries</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{auditResult.avgQuestionsPerCountry}</div>
                <div className="text-sm text-muted-foreground">Avg per Country</div>
              </div>
            </div>

            {auditResult.issues.length > 0 && (
              <Alert className="mb-6 border-yellow-500 bg-yellow-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{auditResult.issues.length} issues found:</strong>
                  <ul className="mt-2 space-y-1">
                    {auditResult.issues.slice(0, 10).map((issue, index) => (
                      <li key={index} className="text-sm">• {issue}</li>
                    ))}
                    {auditResult.issues.length > 10 && (
                      <li className="text-sm text-muted-foreground">... and {auditResult.issues.length - 10} more</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Test Question Fetching</h3>
              <div className="flex gap-2">
                <select 
                  value={selectedCountry} 
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-md"
                >
                  <option value="">Select a country to test...</option>
                  {auditResult.questionsByCountry
                    .filter(c => c.questionCount > 0)
                    .map(country => (
                      <option key={country.countryId} value={country.countryId}>
                        {country.countryName} ({country.questionCount} questions)
                      </option>
                    ))}
                </select>
                <Button 
                  onClick={() => selectedCountry && testQuestionFetch(selectedCountry)}
                  disabled={!selectedCountry}
                  variant="outline"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Test Fetch
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {auditResult && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Countries by Question Count</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {auditResult.questionsByCountry.slice(0, 20).map((country) => (
              <div key={country.countryId} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <span className="font-medium">{country.countryName}</span>
                  <div className="text-sm text-muted-foreground">
                    Easy: {country.byDifficulty.easy}, Medium: {country.byDifficulty.medium}, Hard: {country.byDifficulty.hard}
                  </div>
                </div>
                <Badge variant={country.questionCount >= 50 ? "default" : country.questionCount >= 10 ? "secondary" : "destructive"}>
                  {country.questionCount} questions
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
