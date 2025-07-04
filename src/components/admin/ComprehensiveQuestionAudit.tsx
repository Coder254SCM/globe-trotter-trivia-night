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
  const [lastAuditTime, setLastAuditTime] = useState<string>("");
  const { toast } = useToast();

  const analyzeQuestion = (question: any): QuestionAnalysis => {
    const issues: QuestionIssue[] = [];
    let qualityScore = 100;

    const text = question.text?.toLowerCase() || '';
    const countryName = question.countries?.name?.toLowerCase() || '';
    const options = [question.option_a, question.option_b, question.option_c, question.option_d];

    // More precise placeholder detection - look for exact template patterns
    const isPlaceholderQuestion = 
      text.includes('correct answer for') && text.includes(question.countries?.name) ||
      text.includes('option a for') && text.includes(question.countries?.name) ||
      text.includes('option b for') && text.includes(question.countries?.name) ||
      text.includes('option c for') && text.includes(question.countries?.name) ||
      text.includes('option d for') && text.includes(question.countries?.name);

    if (isPlaceholderQuestion) {
      issues.push({
        type: 'placeholder',
        severity: 'high',
        description: 'Contains placeholder template text'
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

  const runFreshDeletionVerification = async () => {
    setLoading(true);
    setProgress(0);
    setCurrentStep("🔍 VERIFICATION: Checking if placeholder questions were actually deleted...");

    try {
      const timestamp = Date.now();
      console.log(`🕐 Starting fresh verification at ${new Date().toISOString()}`);

      // Force fresh count with no caching
      const { count: totalCount, error: countError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error("❌ Error getting total count:", countError);
        throw countError;
      }

      console.log(`📊 CURRENT TOTAL QUESTIONS: ${totalCount}`);
      setProgress(20);
      setCurrentStep(`Found ${totalCount} total questions. Checking for placeholders...`);

      // Check for placeholder questions with multiple detection methods
      const placeholderPatterns = [
        'text.ilike.%correct answer for%',
        'text.ilike.%option a for%', 
        'text.ilike.%option b for%',
        'text.ilike.%option c for%',
        'text.ilike.%option d for%',
        'text.ilike.%incorrect option%',
        'option_a.ilike.%correct answer for%',
        'option_a.ilike.%incorrect option%',
        'option_b.ilike.%correct answer for%',
        'option_b.ilike.%incorrect option%',
        'option_c.ilike.%correct answer for%',
        'option_c.ilike.%incorrect option%',
        'option_d.ilike.%correct answer for%',
        'option_d.ilike.%incorrect option%'
      ];

      console.log("🔍 Checking for placeholder patterns:", placeholderPatterns);

      const { data: remainingPlaceholders, error: placeholderError } = await supabase
        .from('questions')
        .select('id, text, option_a, option_b, option_c, option_d')
        .or(placeholderPatterns.join(','));

      if (placeholderError) {
        console.error("❌ Error checking placeholders:", placeholderError);
        throw placeholderError;
      }

      setProgress(50);
      console.log(`🎯 PLACEHOLDER CHECK RESULT: Found ${remainingPlaceholders?.length || 0} questions`);

      if (remainingPlaceholders && remainingPlaceholders.length > 0) {
        console.log("🚨 REMAINING PLACEHOLDER QUESTIONS:");
        remainingPlaceholders.slice(0, 5).forEach((q, idx) => {
          console.log(`${idx + 1}. ID: ${q.id}`);
          console.log(`   Text: ${q.text.substring(0, 100)}...`);
          console.log(`   Option A: ${q.option_a?.substring(0, 50)}...`);
        });
      }

      setCurrentStep(`Found ${remainingPlaceholders?.length || 0} placeholder questions remaining`);
      setProgress(75);

      // Get a sample of all questions to verify database state
      const { data: sampleQuestions, error: sampleError } = await supabase
        .from('questions')
        .select('id, text, country_id, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (sampleError) {
        console.error("❌ Error getting sample:", sampleError);
      } else {
        console.log("📋 LATEST 10 QUESTIONS IN DATABASE:");
        sampleQuestions?.forEach((q, idx) => {
          console.log(`${idx + 1}. ${q.id} - "${q.text.substring(0, 60)}..." (${q.country_id})`);
        });
      }

      setProgress(100);
      setCurrentStep("Verification complete!");
      setLastAuditTime(new Date().toISOString());

      const verificationResults = {
        timestamp: new Date().toISOString(),
        totalQuestions: totalCount || 0,
        placeholderQuestions: remainingPlaceholders?.length || 0,
        wasDeleted: (remainingPlaceholders?.length || 0) === 0,
        sampleData: sampleQuestions?.slice(0, 5) || []
      };

      toast({
        title: "Verification Complete!",
        description: `Found ${totalCount} total questions, ${remainingPlaceholders?.length || 0} placeholders remaining`,
        variant: (remainingPlaceholders?.length || 0) > 0 ? "destructive" : "default"
      });

      console.log("✅ VERIFICATION SUMMARY:", verificationResults);
      
      // Run full audit after verification
      await runComprehensiveAudit();

    } catch (error) {
      console.error("❌ Verification failed:", error);
      toast({
        title: "Verification Failed",
        description: `Could not verify deletion: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
    setCurrentStep("Finding placeholder questions...");
    setProgress(0);
    
    try {
      // Get fresh list of placeholder questions
      const { data: placeholderQuestions, error: fetchError } = await supabase
        .from('questions')
        .select('id')
        .or('text.ilike.%correct answer for%,text.ilike.%option a for%,text.ilike.%option b for%,text.ilike.%option c for%,text.ilike.%option d for%,option_a.ilike.%correct answer for%,option_b.ilike.%correct answer for%,option_c.ilike.%correct answer for%,option_d.ilike.%correct answer for%,option_a.ilike.%incorrect option%,option_b.ilike.%incorrect option%,option_c.ilike.%incorrect option%,option_d.ilike.%incorrect option%');

      if (fetchError) {
        console.error("Error fetching placeholder questions:", fetchError);
        throw fetchError;
      }

      const questionIdsToDelete = placeholderQuestions?.map(q => q.id) || [];
      console.log(`🗑️ Found ${questionIdsToDelete.length} placeholder questions to delete`);

      if (questionIdsToDelete.length === 0) {
        toast({
          title: "No Placeholder Questions Found",
          description: "No questions with placeholder patterns were found.",
        });
        setFixing(false);
        return;
      }

      setCurrentStep(`Deleting ${questionIdsToDelete.length} placeholder questions...`);
      setProgress(25);

      // Delete in batches of 50
      const batchSize = 50;
      let totalDeleted = 0;
      
      for (let i = 0; i < questionIdsToDelete.length; i += batchSize) {
        const batch = questionIdsToDelete.slice(i, i + batchSize);
        
        console.log(`🗑️ Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(questionIdsToDelete.length/batchSize)}: ${batch.length} questions`);
        
        const { error, count } = await supabase
          .from('questions')
          .delete()
          .in('id', batch);

        if (error) {
          console.error(`Error deleting batch:`, error);
        } else {
          const deletedInBatch = count || batch.length;
          totalDeleted += deletedInBatch;
          console.log(`✅ Successfully deleted ${deletedInBatch} questions from batch`);
        }
        
        const progressPercent = 25 + ((totalDeleted / questionIdsToDelete.length) * 50);
        setProgress(progressPercent);
        setCurrentStep(`Deleted ${totalDeleted}/${questionIdsToDelete.length} placeholder questions...`);
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`🎉 Deletion complete! Total deleted: ${totalDeleted}/${questionIdsToDelete.length}`);
      setProgress(75);
      setCurrentStep("Running fresh audit...");

      if (totalDeleted > 0) {
        toast({
          title: "Cleanup Complete!",
          description: `Successfully deleted ${totalDeleted} placeholder questions.`,
        });

        // Run fresh audit after successful deletion
        await new Promise(resolve => setTimeout(resolve, 1000));
        await runComprehensiveAudit();
      } else {
        toast({
          title: "No Questions Deleted",
          description: "Could not delete any questions. They may have already been removed.",
          variant: "destructive",
        });
      }

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
    if (loading) return; // Prevent multiple simultaneous audits
    
    setLoading(true);
    setProgress(0);
    setCurrentStep("Getting fresh question count...");

    try {
      // Get fresh count with no caching
      const timestamp = Date.now();
      const { count: totalCount, error: countError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error("Error getting question count:", countError);
        throw countError;
      }

      console.log(`📊 Current total questions in database: ${totalCount}`);
      setCurrentStep(`Analyzing ${totalCount} questions...`);

      // Get all questions with a timestamp to avoid caching
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

      if (error) {
        console.error("Error fetching questions:", error);
        throw error;
      }

      console.log(`📥 Fetched ${questions?.length || 0} questions for analysis`);

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

        // More precise placeholder detection
        const hasPlaceholder = analysis.issues.some(issue => issue.type === 'placeholder');
        if (hasPlaceholder) {
          placeholderQuestionIds.push(question.id);
          placeholderCount++;
          console.log(`🚨 Found placeholder question: ${question.id} - "${question.text.substring(0, 50)}..."`);
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
        duplicate_questions: 0,
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
      console.log("🔍 FRESH AUDIT RESULTS:");
      console.log(`📊 Total Questions: ${totalQuestions}`);
      console.log(`🚨 Placeholder Questions: ${placeholderCount} (${((placeholderCount/totalQuestions)*100).toFixed(1)}%)`);

      toast({
        title: "Audit Complete",
        description: `Analyzed ${totalQuestions} questions. Found ${placeholderCount} placeholder questions.`,
        variant: placeholderCount > 0 ? "destructive" : "default"
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

  useEffect(() => {
    runFreshDeletionVerification();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 animate-pulse text-primary" />
            <span className="font-medium">Verifying Deletion Status...</span>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">{currentStep}</p>
          {lastAuditTime && (
            <p className="text-xs text-muted-foreground">Last check: {new Date(lastAuditTime).toLocaleString()}</p>
          )}
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
      {/* Deletion Status Alert */}
      {auditResults.placeholder_questions === 0 ? (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="font-semibold text-green-800">
            ✅ SUCCESS: All placeholder questions have been successfully deleted from your Supabase database!
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-semibold text-red-800">
            🚨 STILL FOUND: {auditResults.placeholder_questions} placeholder questions remain in your database. Deletion may not have worked properly.
          </AlertDescription>
        </Alert>
      )}

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
              <div className={`text-3xl font-bold ${auditResults.placeholder_questions === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {auditResults.placeholder_questions}
              </div>
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

            {lastAuditTime && (
              <p className="text-xs text-muted-foreground text-center">
                Last verified: {new Date(lastAuditTime).toLocaleString()}
              </p>
            )}
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
