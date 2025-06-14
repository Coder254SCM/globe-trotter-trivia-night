
import { Question } from "../../types/quiz";
import { QuestionService } from "@/services/supabase/questionService";

/**
 * Clean question fetcher that only returns validated, high-quality questions
 */
export const getCleanQuizQuestions = async (
  countryId?: string,
  difficulty?: string,
  count: number = 10
): Promise<Question[]> => {
  console.log(`🧹 Fetching clean questions:`, { countryId, difficulty, count });
  
  try {
    // Only allow medium and hard difficulties
    const validDifficulty = difficulty === 'hard' ? 'hard' : 'medium';
    
    if (difficulty === 'easy') {
      console.warn('❌ Easy questions are no longer available - using medium instead');
    }
    
    // Get questions from Supabase with validation
    const questions = await QuestionService.getFilteredQuestions({
      countryId,
      difficulty: validDifficulty,
      limit: count * 2, // Get extra to filter out any remaining bad ones
      excludeEasy: true,
      validateContent: true
    });
    
    if (questions.length === 0) {
      console.warn(`⚠️ No clean questions found for country: ${countryId}, difficulty: ${validDifficulty}`);
      
      // Fallback: try any difficulty for this country
      const fallbackQuestions = await QuestionService.getFilteredQuestions({
        countryId,
        limit: count * 2,
        excludeEasy: true,
        validateContent: true
      });
      
      return fallbackQuestions.slice(0, count);
    }
    
    // Return only the requested number of questions
    const cleanQuestions = questions.slice(0, count);
    
    console.log(`✅ Retrieved ${cleanQuestions.length} clean questions`);
    return cleanQuestions;
    
  } catch (error) {
    console.error('💥 Error fetching clean questions:', error);
    return [];
  }
};

/**
 * Validate that a question is clean and appropriate
 */
export const isQuestionClean = (question: Question): boolean => {
  // Check for placeholder patterns
  const placeholderPatterns = [
    /placeholder/i,
    /methodology [a-d]/i,
    /approach [a-d]/i,
    /technique [a-d]/i,
    /method [a-d]/i,
    /option [a-d] for/i,
    /correct answer for/i,
    /incorrect option/i,
    /cutting-edge/i,
    /state-of-the-art/i,
    /innovative/i,
    /advanced/i
  ];
  
  const textToCheck = [
    question.text,
    ...question.choices.map(c => c.text)
  ].join(' ');
  
  const hasPlaceholders = placeholderPatterns.some(pattern => 
    pattern.test(textToCheck)
  );
  
  if (hasPlaceholders) {
    console.warn('❌ Question contains placeholder content:', question.text.substring(0, 50));
    return false;
  }
  
  // Check for minimum quality standards
  if (question.text.length < 20) {
    console.warn('❌ Question text too short:', question.text);
    return false;
  }
  
  if (question.choices.length !== 4) {
    console.warn('❌ Question must have exactly 4 choices:', question.id);
    return false;
  }
  
  // Check for duplicate choices
  const choiceTexts = question.choices.map(c => c.text.toLowerCase().trim());
  const uniqueChoices = new Set(choiceTexts);
  
  if (uniqueChoices.size < choiceTexts.length) {
    console.warn('❌ Question has duplicate choices:', question.id);
    return false;
  }
  
  return true;
};

/**
 * Get statistics about question cleanliness
 */
export const getQuestionCleanlinessStats = (questions: Question[]): {
  total: number;
  clean: number;
  dirty: number;
  cleanPercentage: number;
} => {
  const clean = questions.filter(isQuestionClean).length;
  const total = questions.length;
  const dirty = total - clean;
  
  return {
    total,
    clean,
    dirty,
    cleanPercentage: total > 0 ? (clean / total) * 100 : 0
  };
};
