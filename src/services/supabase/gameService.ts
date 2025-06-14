
import { supabase } from "@/integrations/supabase/client";
import { Question as FrontendQuestion } from "@/types/quiz";
import { QuestionService } from "./questionService";

export class GameService {
  /**
   * Get failed questions for Ultimate Quiz
   */
  static async getFailedQuestions(userId: string): Promise<FrontendQuestion[]> {
    try {
      const { data, error } = await supabase
        .from('failed_questions')
        .select(`
          question_id,
          questions (*)
        `)
        .eq('user_id', userId)
        .eq('mastered', false);

      if (error) {
        console.error('Error fetching failed questions:', error);
        throw error;
      }

      return (data || [])
        .filter(item => item.questions)
        .map(item => QuestionService.transformToFrontendQuestion(item.questions));
    } catch (error) {
      console.error('Failed to fetch failed questions:', error);
      return [];
    }
  }

  /**
   * Get leaderboard data
   */
  static async getLeaderboard(period: string = 'weekly', category?: string): Promise<any[]> {
    try {
      let query = supabase
        .from('leaderboards')
        .select(`
          *,
          user_profiles (username, avatar_url)
        `)
        .eq('period', period)
        .order('rank');

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.limit(100);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      return [];
    }
  }
}
