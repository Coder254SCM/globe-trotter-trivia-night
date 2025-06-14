
import { supabase } from "@/integrations/supabase/client";
import { QuestionService } from "./questionService";

export interface WeeklyChallenge {
  id: string;
  week_start: string;
  week_end: string;
  question_ids: string[];
  participants: number;
  created_at: string;
}

export class WeeklyChallengeService {
  /**
   * Create a new weekly challenge with random questions
   */
  static async createWeeklyChallenge(): Promise<WeeklyChallenge> {
    try {
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      // Get random hard questions from multiple countries for the challenge
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('id')
        .eq('difficulty', 'hard')
        .limit(100);

      if (questionsError) throw questionsError;

      if (!questions || questions.length < 20) {
        throw new Error('Not enough questions available for weekly challenge');
      }

      // Randomly select 20 questions
      const shuffled = questions.sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, 20);
      const questionIds = selectedQuestions.map(q => q.id);

      const { data, error } = await supabase
        .from('weekly_challenges')
        .insert({
          week_start: startOfWeek.toISOString().split('T')[0],
          week_end: endOfWeek.toISOString().split('T')[0],
          question_ids: questionIds,
          participants: 0
        })
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Created weekly challenge with ${questionIds.length} questions`);
      return data;
    } catch (error) {
      console.error('Error creating weekly challenge:', error);
      throw error;
    }
  }

  /**
   * Get current week's challenge
   */
  static async getCurrentChallenge(): Promise<WeeklyChallenge | null> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('weekly_challenges')
        .select('*')
        .lte('week_start', today)
        .gte('week_end', today)
        .order('week_start', { ascending: false })
        .limit(1);

      if (error) throw error;

      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error fetching current challenge:', error);
      return null;
    }
  }

  /**
   * Get questions for a challenge
   */
  static async getChallengeQuestions(challenge: WeeklyChallenge): Promise<any[]> {
    try {
      if (!challenge.question_ids || challenge.question_ids.length === 0) {
        return [];
      }

      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .in('id', challenge.question_ids);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching challenge questions:', error);
      return [];
    }
  }

  /**
   * Record user's challenge attempt
   */
  static async recordChallengeAttempt(
    userId: string,
    challengeId: string,
    score: number,
    questionsCorrect: number,
    totalQuestions: number
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_challenge_attempts')
        .upsert({
          user_id: userId,
          challenge_id: challengeId,
          score: score,
          questions_correct: questionsCorrect,
          total_questions: totalQuestions
        });

      if (error) throw error;

      // Update participant count manually
      const { error: updateError } = await supabase
        .from('weekly_challenges')
        .update({ 
          participants: supabase.raw('participants + 1')
        })
        .eq('id', challengeId);

      if (updateError) {
        console.error('Error updating participant count:', updateError);
      }

      console.log(`✅ Recorded challenge attempt: ${questionsCorrect}/${totalQuestions} correct`);
    } catch (error) {
      console.error('Error recording challenge attempt:', error);
      throw error;
    }
  }
}
