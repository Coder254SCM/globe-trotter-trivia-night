
import { Question } from "../../types/quiz";
import { QuestionService } from "../../services/supabase/questionService";

// Enhanced question fetching with Supabase integration
export const fetchSupabaseQuestions = async (
  countryId?: string,
  difficulty?: string,
  count: number = 10
): Promise<Question[]> => {
  if (!countryId) return [];
  
  try {
    const supabaseQuestions = await QuestionService.getQuestions(countryId, difficulty, count);
    if (supabaseQuestions.length > 0) {
      console.log(`✅ Loaded ${supabaseQuestions.length} questions from Supabase for ${countryId}`);
      return supabaseQuestions;
    }
  } catch (error) {
    console.error('Failed to load questions from Supabase:', error);
  }
  
  return [];
};

export const hasSupabaseQuestionsForCountry = async (countryId: string): Promise<boolean> => {
  try {
    const questions = await QuestionService.getQuestions(countryId, 'medium', 1);
    return questions.length > 0;
  } catch (error) {
    console.error('Error checking Supabase questions:', error);
    return false;
  }
};
