
import { countryQuestions } from "../questionSets";
import { isQuestionRelevantToCountry } from "./countryAudit";

export interface CategoryAuditResult {
  category: string;
  totalQuestions: number;
  correctlyPlaced: number;
  misplaced: number;
  accuracy: number;
}

// Audit questions by category
export const auditQuestionsByCategory = (): CategoryAuditResult[] => {
  const categoryStats = new Map<string, { total: number; correct: number }>();
  
  Object.entries(countryQuestions).forEach(([countryId, questions]) => {
    questions.forEach(question => {
      const category = question.category;
      
      if (!categoryStats.has(category)) {
        categoryStats.set(category, { total: 0, correct: 0 });
      }
      
      const stats = categoryStats.get(category)!;
      stats.total++;
      
      if (isQuestionRelevantToCountry(question, countryId)) {
        stats.correct++;
      }
    });
  });
  
  return Array.from(categoryStats.entries()).map(([category, stats]) => ({
    category,
    totalQuestions: stats.total,
    correctlyPlaced: stats.correct,
    misplaced: stats.total - stats.correct,
    accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
  }));
};
