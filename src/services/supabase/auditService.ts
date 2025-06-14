
import { supabase } from "@/integrations/supabase/client";
import countries from "@/data/countries";

export interface AuditResult {
  totalQuestions: number;
  wrongCountryQuestions: number;
  wrongCategoryQuestions: number;
  details: Array<{
    questionId: string;
    text: string;
    assignedCountry: string;
    assignedCategory: string;
    issues: string[];
  }>;
}

export class AuditService {
  /**
   * Audit questions - Check which questions are in wrong countries/categories
   */
  static async auditQuestions(): Promise<AuditResult> {
    try {
      console.log('🔍 Starting comprehensive question audit...');
      
      // Get all questions with their country assignments
      const { data: questions, error } = await supabase
        .from('questions')
        .select(`
          id,
          text,
          country_id,
          category,
          countries (name, continent)
        `);

      if (error) {
        console.error('Error fetching questions for audit:', error);
        throw error;
      }

      const auditResults: AuditResult = {
        totalQuestions: questions?.length || 0,
        wrongCountryQuestions: 0,
        wrongCategoryQuestions: 0,
        details: []
      };

      (questions || []).forEach(question => {
        const issues: string[] = [];
        const questionText = question.text.toLowerCase();
        const countryName = question.countries?.name?.toLowerCase() || '';
        
        // Check if question mentions the assigned country
        const mentionsAssignedCountry = questionText.includes(countryName);
        
        // Check if question mentions other countries (potential wrong assignment)
        const otherCountries = countries.filter(c => 
          c.name.toLowerCase() !== countryName && 
          questionText.includes(c.name.toLowerCase())
        );

        if (!mentionsAssignedCountry && otherCountries.length > 0) {
          issues.push(`Question mentions ${otherCountries[0].name} but assigned to ${question.countries?.name}`);
          auditResults.wrongCountryQuestions++;
        }

        // Check category relevance (basic check)
        const categoryKeywords: Record<string, string[]> = {
          'Geography': ['capital', 'border', 'mountain', 'river', 'location', 'continent'],
          'History': ['founded', 'independence', 'war', 'ancient', 'empire', 'century'],
          'Culture': ['tradition', 'festival', 'language', 'custom', 'religion'],
          'Economy': ['currency', 'export', 'industry', 'trade', 'gdp'],
          'Nature': ['wildlife', 'animal', 'plant', 'climate', 'forest']
        };

        const categoryWords = categoryKeywords[question.category] || [];
        const hasRelevantKeywords = categoryWords.some(keyword => 
          questionText.includes(keyword)
        );

        if (!hasRelevantKeywords && !mentionsAssignedCountry) {
          issues.push(`Question category '${question.category}' may not match content`);
          auditResults.wrongCategoryQuestions++;
        }

        if (issues.length > 0) {
          auditResults.details.push({
            questionId: question.id,
            text: question.text.substring(0, 100) + '...',
            assignedCountry: question.countries?.name || 'Unknown',
            assignedCategory: question.category,
            issues
          });
        }
      });

      console.log('📊 Audit Results:', {
        total: auditResults.totalQuestions,
        wrongCountry: auditResults.wrongCountryQuestions,
        wrongCategory: auditResults.wrongCategoryQuestions,
        issuesFound: auditResults.details.length
      });

      return auditResults;
    } catch (error) {
      console.error('Failed to audit questions:', error);
      throw error;
    }
  }
}
