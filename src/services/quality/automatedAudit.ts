
import { supabase } from "@/integrations/supabase/client";
import countries from "@/data/countries";

export interface QualityReport {
  overallScore: number;
  totalQuestions: number;
  validQuestions: number;
  invalidQuestions: number;
  countryCoverage: number;
  difficultyDistribution: Record<string, number>;
  criticalIssues: string[];
  recommendations: string[];
  detailedResults: CountryQualityResult[];
}

export interface CountryQualityResult {
  countryId: string;
  countryName: string;
  totalQuestions: number;
  validQuestions: number;
  qualityScore: number;
  difficultyBreakdown: Record<string, number>;
  issues: string[];
  status: 'excellent' | 'good' | 'poor' | 'critical';
}

export class AutomatedAuditService {
  private static readonly QUALITY_THRESHOLDS = {
    excellent: 95,
    good: 80,
    poor: 60,
    critical: 0
  };

  private static readonly MIN_QUESTIONS_PER_DIFFICULTY = 5;

  /**
   * Run comprehensive automated audit
   */
  static async runFullAudit(): Promise<QualityReport> {
    console.log("🔍 Starting automated quality audit...");
    
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*');

    if (error) {
      throw new Error(`Failed to fetch questions for audit: ${error.message}`);
    }

    const auditResults = await this.analyzeQuestions(questions || []);
    const report = this.generateQualityReport(auditResults);
    
    // Auto-trigger cleanup if quality is too low
    if (report.overallScore < this.QUALITY_THRESHOLDS.good) {
      console.warn(`🚨 Quality below threshold (${report.overallScore}%). Triggering auto-cleanup...`);
      await this.autoCleanup(report);
    }

    // Auto-trigger generation for gaps
    await this.fillQualityGaps(report);

    return report;
  }

  /**
   * Analyze all questions for quality issues
   */
  private static async analyzeQuestions(questions: any[]): Promise<Map<string, CountryQualityResult>> {
    const results = new Map<string, CountryQualityResult>();

    // Group questions by country
    const questionsByCountry = new Map<string, any[]>();
    questions.forEach(q => {
      if (!questionsByCountry.has(q.country_id)) {
        questionsByCountry.set(q.country_id, []);
      }
      questionsByCountry.get(q.country_id)!.push(q);
    });

    // Analyze each country
    for (const country of countries) {
      const countryQuestions = questionsByCountry.get(country.id) || [];
      const result = await this.analyzeCountryQuestions(country, countryQuestions);
      results.set(country.id, result);
    }

    return results;
  }

  /**
   * Analyze questions for a specific country
   */
  private static async analyzeCountryQuestions(country: any, questions: any[]): Promise<CountryQualityResult> {
    let validCount = 0;
    const issues: string[] = [];
    const difficultyBreakdown: Record<string, number> = { easy: 0, medium: 0, hard: 0 };

    for (const question of questions) {
      // Count by difficulty
      difficultyBreakdown[question.difficulty] = (difficultyBreakdown[question.difficulty] || 0) + 1;

      // Validate quality
      if (await this.validateQuestion(question, country)) {
        validCount++;
      } else {
        issues.push(`Invalid question: "${question.text.substring(0, 50)}..."`);
      }
    }

    // Check coverage gaps
    for (const [difficulty, count] of Object.entries(difficultyBreakdown)) {
      if (count < this.MIN_QUESTIONS_PER_DIFFICULTY) {
        issues.push(`Insufficient ${difficulty} questions: ${count}/${this.MIN_QUESTIONS_PER_DIFFICULTY}`);
      }
    }

    const qualityScore = questions.length > 0 ? (validCount / questions.length) * 100 : 0;
    const status = this.getQualityStatus(qualityScore);

    return {
      countryId: country.id,
      countryName: country.name,
      totalQuestions: questions.length,
      validQuestions: validCount,
      qualityScore,
      difficultyBreakdown,
      issues: issues.slice(0, 5), // Limit to top 5 issues
      status
    };
  }

  /**
   * Validate individual question quality
   */
  private static async validateQuestion(question: any, country: any): Promise<boolean> {
    // Check 1: Country relevance
    if (!question.text.toLowerCase().includes(country.name.toLowerCase())) {
      return false;
    }

    // Check 2: No placeholder patterns
    const placeholderRegex = /(methodology [a-d]|approach [a-d]|technique [a-d]|method [a-d]|option [a-d] for|placeholder)/i;
    const allText = [
      question.text,
      question.option_a,
      question.option_b,
      question.option_c,
      question.option_d
    ].join(' ');

    if (placeholderRegex.test(allText)) {
      return false;
    }

    // Check 3: Correct answer validation
    const options = [question.option_a, question.option_b, question.option_c, question.option_d];
    if (!options.includes(question.correct_answer)) {
      return false;
    }

    // Check 4: Unique options
    const uniqueOptions = new Set(options.map(opt => opt?.toLowerCase().trim()));
    if (uniqueOptions.size < 4) {
      return false;
    }

    // Check 5: Minimum length
    if (question.text.length < 20) {
      return false;
    }

    return true;
  }

  /**
   * Generate comprehensive quality report
   */
  private static generateQualityReport(results: Map<string, CountryQualityResult>): QualityReport {
    const detailedResults = Array.from(results.values());
    const totalQuestions = detailedResults.reduce((sum, r) => sum + r.totalQuestions, 0);
    const validQuestions = detailedResults.reduce((sum, r) => sum + r.validQuestions, 0);
    const invalidQuestions = totalQuestions - validQuestions;
    
    const overallScore = totalQuestions > 0 ? (validQuestions / totalQuestions) * 100 : 0;
    const countryCoverage = (detailedResults.filter(r => r.totalQuestions > 0).length / countries.length) * 100;

    // Calculate difficulty distribution
    const difficultyDistribution: Record<string, number> = { easy: 0, medium: 0, hard: 0 };
    detailedResults.forEach(result => {
      Object.entries(result.difficultyBreakdown).forEach(([difficulty, count]) => {
        difficultyDistribution[difficulty] = (difficultyDistribution[difficulty] || 0) + count;
      });
    });

    // Identify critical issues
    const criticalIssues: string[] = [];
    const poorCountries = detailedResults.filter(r => r.status === 'critical' || r.status === 'poor');
    
    if (overallScore < this.QUALITY_THRESHOLDS.good) {
      criticalIssues.push(`Overall quality score too low: ${overallScore.toFixed(1)}%`);
    }
    
    if (poorCountries.length > 0) {
      criticalIssues.push(`${poorCountries.length} countries have poor question quality`);
    }

    const countriesWithoutQuestions = detailedResults.filter(r => r.totalQuestions === 0).length;
    if (countriesWithoutQuestions > 0) {
      criticalIssues.push(`${countriesWithoutQuestions} countries have no questions`);
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (invalidQuestions > 0) {
      recommendations.push(`Clean up ${invalidQuestions} invalid questions`);
    }
    
    if (countriesWithoutQuestions > 0) {
      recommendations.push(`Generate questions for ${countriesWithoutQuestions} countries`);
    }
    
    poorCountries.forEach(country => {
      recommendations.push(`Improve question quality for ${country.countryName}`);
    });

    return {
      overallScore,
      totalQuestions,
      validQuestions,
      invalidQuestions,
      countryCoverage,
      difficultyDistribution,
      criticalIssues,
      recommendations: recommendations.slice(0, 10),
      detailedResults: detailedResults.sort((a, b) => a.qualityScore - b.qualityScore)
    };
  }

  /**
   * Auto-cleanup invalid questions
   */
  private static async autoCleanup(report: QualityReport): Promise<void> {
    console.log("🧹 Starting automated cleanup...");
    
    // Delete questions with critical quality issues
    const { data: badQuestions, error: fetchError } = await supabase
      .from('questions')
      .select('id, text, country_id')
      .or('text.ilike.%methodology%,text.ilike.%approach%,text.ilike.%technique%,text.ilike.%placeholder%');

    if (fetchError) {
      console.error("Failed to fetch bad questions:", fetchError);
      return;
    }

    if (badQuestions && badQuestions.length > 0) {
      const idsToDelete = badQuestions.map(q => q.id);
      
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .in('id', idsToDelete);

      if (deleteError) {
        console.error("Failed to delete bad questions:", deleteError);
      } else {
        console.log(`🗑️ Cleaned up ${badQuestions.length} invalid questions`);
      }
    }
  }

  /**
   * Fill quality gaps by triggering generation
   */
  private static async fillQualityGaps(report: QualityReport): Promise<void> {
    console.log("🔧 Filling quality gaps...");
    
    const gapsToFill = report.detailedResults.filter(result => 
      result.status === 'critical' || result.status === 'poor' ||
      Object.values(result.difficultyBreakdown).some(count => count < this.MIN_QUESTIONS_PER_DIFFICULTY)
    );

    // This would trigger the question generation service
    console.log(`📊 Found ${gapsToFill.length} countries needing improvement`);
    // Implementation would call QuestionGeneratorService here
  }

  /**
   * Get quality status based on score
   */
  private static getQualityStatus(score: number): 'excellent' | 'good' | 'poor' | 'critical' {
    if (score >= this.QUALITY_THRESHOLDS.excellent) return 'excellent';
    if (score >= this.QUALITY_THRESHOLDS.good) return 'good';
    if (score >= this.QUALITY_THRESHOLDS.poor) return 'poor';
    return 'critical';
  }

  /**
   * Schedule automated audits
   */
  static async scheduleRegularAudits(): Promise<void> {
    // Run audit every 24 hours
    setInterval(async () => {
      try {
        console.log("⏰ Running scheduled quality audit...");
        await this.runFullAudit();
      } catch (error) {
        console.error("Scheduled audit failed:", error);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours
  }
}
