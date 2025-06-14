
import { supabase } from "@/integrations/supabase/client";

export interface GameSession {
  id: string;
  user_id: string;
  country_id?: string;
  total_questions: number;
  correct_answers: number;
  score: number;
  time_taken?: number;
  started_at: string;
  completed_at?: string;
  session_type: 'individual' | 'weekly_challenge' | 'ultimate_quiz';
  difficulty?: string;
}

export interface FailedQuestion {
  id: string;
  user_id: string;
  question_id: string;
  session_id?: string;
  failed_at: string;
  retry_count: number;
  mastered: boolean;
}

export class GameSessionService {
  /**
   * Start a new game session
   */
  static async startSession(
    userId: string, 
    sessionType: 'individual' | 'weekly_challenge' | 'ultimate_quiz',
    totalQuestions: number,
    countryId?: string,
    difficulty?: string
  ): Promise<GameSession> {
    const { data, error } = await supabase
      .from('quiz_sessions')
      .insert({
        user_id: userId,
        country_id: countryId,
        total_questions: totalQuestions,
        correct_answers: 0,
        score: 0,
        session_type: sessionType,
        difficulty: difficulty
      })
      .select()
      .single();

    if (error) {
      console.error('Error starting session:', error);
      throw error;
    }

    return data;
  }

  /**
   * Complete a game session and record failed questions
   */
  static async completeSession(
    sessionId: string,
    correctAnswers: number,
    score: number,
    timeTaken: number,
    failedQuestionIds: string[] = []
  ): Promise<void> {
    try {
      // Update the session
      const { error: sessionError } = await supabase
        .from('quiz_sessions')
        .update({
          correct_answers: correctAnswers,
          score: score,
          time_taken: timeTaken,
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (sessionError) throw sessionError;

      // Get session details to get user_id
      const { data: session } = await supabase
        .from('quiz_sessions')
        .select('user_id')
        .eq('id', sessionId)
        .single();

      if (!session) return;

      // Record failed questions
      if (failedQuestionIds.length > 0) {
        const failedQuestions = failedQuestionIds.map(questionId => ({
          user_id: session.user_id,
          question_id: questionId,
          session_id: sessionId,
          retry_count: 0,
          mastered: false
        }));

        const { error: failedError } = await supabase
          .from('failed_questions')
          .upsert(failedQuestions, {
            onConflict: 'user_id,question_id',
            ignoreDuplicates: false
          });

        if (failedError) {
          console.error('Error recording failed questions:', failedError);
        }
      }

      console.log(`✅ Session completed: ${correctAnswers} correct, ${failedQuestionIds.length} failed questions recorded`);
    } catch (error) {
      console.error('Error completing session:', error);
      throw error;
    }
  }

  /**
   * Get failed questions for Ultimate Quiz
   */
  static async getFailedQuestions(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('failed_questions')
        .select(`
          question_id,
          retry_count,
          questions!inner(*)
        `)
        .eq('user_id', userId)
        .eq('mastered', false);

      if (error) throw error;

      return (data || [])
        .filter(item => item.questions)
        .map(item => ({
          ...item.questions,
          retry_count: item.retry_count
        }));
    } catch (error) {
      console.error('Error fetching failed questions:', error);
      return [];
    }
  }

  /**
   * Mark a failed question as mastered
   */
  static async markQuestionMastered(userId: string, questionId: string): Promise<void> {
    const { error } = await supabase
      .from('failed_questions')
      .update({ mastered: true })
      .eq('user_id', userId)
      .eq('question_id', questionId);

    if (error) {
      console.error('Error marking question as mastered:', error);
      throw error;
    }
  }
}
