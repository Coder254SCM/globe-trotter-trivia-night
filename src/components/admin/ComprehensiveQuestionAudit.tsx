
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, CheckCircle, Database, Search, Eye, Zap, FileText, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuestionIssue {
  type: 'placeholder' | 'generic' | 'wrong_country' | 'poor_quality' | 'duplicate';
  severity: 'high' | 'medium' | 'low';
  description: string;
}

interface QuestionAnalysis {
  id: string;
  text: string;
  country_name: string;
  category: string;
  difficulty: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  issues: QuestionIssue[];
  quality_score: number;
}

interface AuditResults {
  total_questions: number;
  placeholder_questions: number;
  generic_questions: number;
  wrong_country_questions: number;
  poor_quality_questions: number;
  duplicate_questions: number;
  countries_analyzed: number;
  average_quality_score: number;
  worst_questions: QuestionAnalysis[];
  placeholder_question_ids: string[];
  country_breakdown: Array<{
    country_name: string;
    total_questions: number;
    placeholder_count: number;
    quality_score: number;
  }>;
}

export const ComprehensiveQuestionAudit = () => {
  const [auditResults, setAuditResults] = useState<AuditResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const { toast } = useToast();

  const analyzeQuestion = (question: any): QuestionAnalysis => {
    const issues: QuestionIssue[] = [];
    let qualityScore = 100;

    const text = question.text?.toLowerCase() || '';
    const countryName = question.countries?.name?.toLowerCase() || '';
    const options = [question.option_a, question.option_b, question.option_c, question.option_d];

    // Check for placeholder text in question
    if (text.includes('correct answer for') || text.includes('incorrect option') || 
        text.includes('option a for') || text.includes('option b for') ||
        text.includes('option c for') || text.includes('option d for')) {
      issues.push({
        type: 'placeholder',
        severity: 'high',
        description: 'Contains placeholder text in question'
      });
      qualityScore -= 50;
    }

    // Check if options contain placeholder text
    const hasPlaceholderOptions = options.some(option => 
      option?.toLowerCase().includes('correct answer for') || 
      option?.toLowerCase().includes('incorrect option') ||
      option?.toLowerCase().includes('option a for') ||
      option?.toLowerCase().includes('option b for') ||
      option?.toLowerCase().includes('option c for') ||
      option?.toLowerCase().includes('option d for')
    );

    if (hasPlaceholderOptions) {
      issues.push({
        type: 'placeholder',
        severity: 'high',
        description: 'Answer options contain placeholder text'
      });
      qualityScore -= 40;
    }

    // Check if question mentions the assigned country
    if (countryName && !text.includes(countryName)) {
      // Check if it mentions other countries
      const mentionsOtherCountry = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g)?.some(word => 
        word.length > 3 && word !== question.countries?.name
      );
      
      if (mentionsOtherCountry) {
        issues.push({
          type: 'wrong_country',
          severity: 'high',
          description: 'Question may be assigned to wrong country'
        });
        qualityScore -= 30;
      }
    }

    // Check for generic/vague questions
    if (text.includes('what is') && text.length < 50) {
      issues.push({
        type: 'generic',
        severity: 'medium',
        description: 'Question appears too generic or vague'
      });
      qualityScore -= 20;
    }

    // Check for poor answer quality
    const allOptionsGeneric = options.every(option => 
      option?.toLowerCase().includes('for ' + question.countries?.name?.toLowerCase()) || 
      option?.length < 10
    );

    if (allOptionsGeneric) {
      issues.push({
        type: 'poor_quality',
        severity: 'high',
        description: 'All answer options appear generic or low quality'
      });
      qualityScore -= 35;
    }

    return {
      id: question.id,
      text: question.text,
      country_name: question.countries?.name || 'Unknown',
      category: question.category,
      difficulty: question.difficulty,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_answer: question.correct_answer,
      issues,
      quality_score: Math.max(0, qualityScore)
    };
  };

  const deletePlaceholderQuestions = async () => {
    if (!auditResults || auditResults.placeholder_question_ids.length === 0) {
      toast({
        title: "No Placeholder Questions Found",
        description: "All questions appear to be properly formatted.",
      });
      return;
    }
    
    setFixing(true);
    setCurrentStep("Deleting placeholder questions...");
    setProgress(0);
    
    try {
      const questionIds = auditResults.placeholder_question_ids;
      console.log(`🗑️ Deleting ${questionIds.length} placeholder questions:`, questionIds);

      // Delete questions in batches of 50
      const batchSize = 50;
      let deleted = 0;

      for (let i = 0; i < questionIds.length; i += batchSize) {
        const batch = questionIds.slice(i, i + batchSize);
        
        console.log(`Deleting batch ${Math.floor(i/batchSize) + 1}: ${batch.length} questions`);
        
        const { error, count } = await supabase
          .from('questions')
          .delete()
          .in('id', batch);

        if (error) {
          console.error('Error deleting batch:', error);
          throw error;
        }

        deleted += batch.length;
        setProgress((deleted / questionIds.length) * 100);
        setCurrentStep(`Deleted ${deleted}/${questionIds.length} placeholder questions...`);
        
        console.log(`✅ Deleted batch of ${batch.length} questions. Total deleted: ${deleted}`);
      }

      toast({
        title: "Cleanup Complete!",
        description: `Successfully deleted ${deleted} placeholder questions.`,
      });

      console.log(`🎉 Successfully deleted ${deleted} placeholder questions from Supabase!`);

      // Re-run audit to show updated results
      setTimeout(() => {
        runComprehensiveAudit();
      }, 1000);

    } catch (error) {
      console.error("Failed to delete placeholder questions:", error);
      toast({
        title: "Cleanup Failed",
        description: `Could not delete placeholder questions: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setFixing(false);
      setProgress(0);
    }
  };

  const runComprehensiveAudit = async () => {
    setLoading(true);
    setProgress(0);
    setCurrentStep("Fetching questions from Supabase...");

    try {
      // Get all questions with country information
      const { data: questions, error } = await supabase
        .from('questions')
        .select(`
          id,
          text,
          category,
          difficulty,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_answer,
          country_id,
          countries (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProgress(25);
      setCurrentStep("Analyzing question quality...");

      const analyzedQuestions: QuestionAnalysis[] = [];
      const placeholderQuestionIds: string[] = [];
      let placeholderCount = 0;
      let genericCount = 0;
      let wrongCountryCount = 0;
      let poorQualityCount = 0;
      
      const countryStats = new Map<string, { total: number; placeholder: number; totalScore: number }>();

      for (const question of questions || []) {
        const analysis = analyzeQuestion(question);
        analyzedQuestions.push(analysis);

        // Track placeholder questions for deletion
        const hasPlaceholder = analysis.issues.some(issue => issue.type === 'placeholder');
        if (hasPlaceholder) {
          placeholderQuestionIds.push(question.id);
          placeholderCount++;
        }

        // Count issue types
        analysis.issues.forEach(issue => {
          switch (issue.type) {
            case 'generic':
              genericCount++;
              break;
            case 'wrong_country':
              wrongCountryCount++;
              break;
            case 'poor_quality':
              poorQualityCount++;
              break;
          }
        });

        // Track country stats
        const countryName = analysis.country_name;
        if (!countryStats.has(countryName)) {
          countryStats.set(countryName, { total: 0, placeholder: 0, totalScore: 0 });
        }
        const stats = countryStats.get(countryName)!;
        stats.total++;
        stats.totalScore += analysis.quality_score;
        if (hasPlaceholder) {
          stats.placeholder++;
        }
      }

      setProgress(75);
      setCurrentStep("Generating audit report...");

      // Get worst questions (lowest quality scores)
      const worstQuestions = analyzedQuestions
        .filter(q => q.quality_score < 70)
        .sort((a, b) => a.quality_score - b.quality_score)
        .slice(0, 50);

      // Generate country breakdown
      const countryBreakdown = Array.from(countryStats.entries()).map(([name, stats]) => ({
        country_name: name,
        total_questions: stats.total,
        placeholder_count: stats.placeholder,
        quality_score: stats.total > 0 ? Math.round(stats.totalScore / stats.total) : 0
      })).sort((a, b) => a.quality_score - b.quality_score);

      const totalQuestions = questions?.length || 0;
      const averageQualityScore = totalQuestions > 0 
        ? Math.round(analyzedQuestions.reduce((sum, q) => sum + q.quality_score, 0) / totalQuestions)
        : 0;

      const results: AuditResults = {
        total_questions: totalQuestions,
        placeholder_questions: placeholderCount,
        generic_questions: genericCount,
        wrong_country_questions: wrongCountryCount,
        poor_quality_questions: poorQualityCount,
        duplicate_questions: 0, // TODO: Implement duplicate detection
        countries_analyzed: countryStats.size,
        average_quality_score: averageQualityScore,
        worst_questions: worstQuestions,
        placeholder_question_ids: placeholderQuestionIds,
        country_breakdown: countryBreakdown
      };

      setAuditResults(results);
      setProgress(100);
      setCurrentStep("Audit complete!");

      // Log key findings
      console.log("🔍 COMPREHENSIVE QUESTION AUDIT RESULTS:");
      console.log(`📊 Total Questions: ${totalQuestions}`);
      console.log(`🚨 Placeholder Questions: ${placeholderCount} (${((placeholderCount/totalQuestions)*100).toFixed(1)}%)`);
      console.log(`⚠️ Generic Questions: ${genericCount}`);
      console.log(`❌ Wrong Country Questions: ${wrongCountryCount}`);
      console.log(`📉 Average Quality Score: ${averageQualityScore}/100`);
      console.log(`🗑️ Placeholder Question IDs ready for deletion:`, placeholderQuestionIds.slice(0, 10));

      toast({
        title: "Comprehensive Audit Complete",
        description: `Analyzed ${totalQuestions} questions. Found ${placeholderCount} placeholder questions that need immediate attention.`,
        variant: placeholderCount > totalQuestions * 0.1 ? "destructive" : "default"
      });

    } catch (error) {
      console.error("Audit failed:", error);
      toast({
        title: "Audit Failed",
        description: "Could not complete the comprehensive audit. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runComprehensiveAudit();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 animate-pulse text-primary" />
            <span className="font-medium">Running Comprehensive Question Audit...</span>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">{currentStep}</p>
        </div>
      </Card>
    );
  }

  if (fixing) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 animate-pulse text-destructive" />
            <span className="font-medium">Cleaning Up Placeholder Questions...</span>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">{currentStep}</p>
        </div>
      </Card>
    );
  }

  if (!auditResults) return null;

  const criticalIssues = auditResults.placeholder_questions + auditResults.wrong_country_questions;
  const qualityColor = auditResults.average_quality_score >= 80 ? "text-green-600" : 
                       auditResults.average_quality_score >= 60 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="space-y-6">
      {/* Critical Alert */}
      {criticalIssues > auditResults.total_questions * 0.1 && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-semibold">
            🚨 CRITICAL: {criticalIssues} questions ({((criticalIssues/auditResults.total_questions)*100).toFixed(1)}%) have serious quality issues and need immediate attention!
          </AlertDescription>
        </Alert>
      )}

      {/* Main Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Comprehensive Question Quality Audit
          </CardTitle>
          <CardDescription>
            Deep analysis of all {auditResults.total_questions} questions in your Supabase database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{auditResults.total_questions}</div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{auditResults.placeholder_questions}</div>
              <div className="text-sm text-muted-foreground">Placeholder Questions</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{auditResults.poor_quality_questions}</div>
              <div className="text-sm text-muted-foreground">Poor Quality</div>
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold ${qualityColor}`}>
                {auditResults.average_quality_score}
              </div>
              <div className="text-sm text-muted-foreground">Avg Quality Score</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Quality</span>
                <span>{auditResults.average_quality_score}/100</span>
              </div>
              <Progress value={auditResults.average_quality_score} />
            </div>

            <div className="flex gap-2">
              <Button onClick={runComprehensiveAudit} variant="outline" className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Re-run Audit
              </Button>
              
              {auditResults.placeholder_questions > 0 && (
                <Button onClick={deletePlaceholderQuestions} variant="destructive" className="flex-1">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete {auditResults.placeholder_questions} Placeholder Questions
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Worst Questions */}
      {auditResults.worst_questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">🚨 Worst Quality Questions</CardTitle>
            <CardDescription>
              Questions with the lowest quality scores that need immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {auditResults.worst_questions.slice(0, 10).map((question) => (
                <div key={question.id} className="border rounded p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{question.country_name}</span>
                    <div className="flex gap-2">
                      <Badge variant="outline">{question.category}</Badge>
                      <Badge variant={question.quality_score < 30 ? "destructive" : "secondary"}>
                        Score: {question.quality_score}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-medium mb-1">Question:</p>
                    <p className="bg-muted p-2 rounded">{question.text}</p>
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-medium mb-1">Options:</p>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <p>A: {question.option_a}</p>
                      <p>B: {question.option_b}</p>
                      <p>C: {question.option_c}</p>
                      <p>D: {question.option_d}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {question.issues.map((issue, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className={`h-3 w-3 ${
                          issue.severity === 'high' ? 'text-red-500' : 
                          issue.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                        }`} />
                        <span className="text-xs">{issue.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Country Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Country Quality Breakdown</CardTitle>
          <CardDescription>
            Quality scores by country (worst first)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {auditResults.country_breakdown.slice(0, 20).map((country) => (
              <div key={country.country_name} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <span className="font-medium">{country.country_name}</span>
                  <div className="text-sm text-muted-foreground">
                    {country.total_questions} questions
                    {country.placeholder_count > 0 && (
                      <span className="text-red-600 ml-2">
                        ({country.placeholder_count} placeholder)
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant={
                  country.quality_score >= 80 ? "default" : 
                  country.quality_score >= 60 ? "secondary" : "destructive"
                }>
                  {country.quality_score}/100
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
