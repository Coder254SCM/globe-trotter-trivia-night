
import { supabase } from "@/integrations/supabase/client";

export interface CommunityQuestion {
  id: string;
  submitted_by?: string;
  country_id: string;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'pending' | 'approved' | 'rejected';
  votes_up: number;
  votes_down: number;
  moderated_by?: string;
  moderated_at?: string;
  moderation_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionVote {
  id: string;
  user_id: string;
  question_id: string;
  vote_type: 'up' | 'down';
  created_at: string;
}

export class CommunityService {
  /**
   * Submit a new community question
   */
  static async submitQuestion(questionData: Omit<CommunityQuestion, 'id' | 'status' | 'votes_up' | 'votes_down' | 'created_at' | 'updated_at' | 'submitted_by'>): Promise<void> {
    const { error } = await supabase
      .from('community_questions')
      .insert({
        ...questionData,
        submitted_by: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) {
      console.error('Error submitting community question:', error);
      throw error;
    }
  }

  /**
   * Get pending questions for moderation
   */
  static async getPendingQuestions(limit: number = 50): Promise<CommunityQuestion[]> {
    const { data, error } = await supabase
      .from('community_questions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching pending questions:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Moderate a community question (approve/reject)
   */
  static async moderateQuestion(
    questionId: string, 
    status: 'approved' | 'rejected',
    moderationNotes?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('community_questions')
      .update({
        status,
        moderated_by: (await supabase.auth.getUser()).data.user?.id,
        moderated_at: new Date().toISOString(),
        moderation_notes: moderationNotes
      })
      .eq('id', questionId);

    if (error) {
      console.error('Error moderating question:', error);
      throw error;
    }
  }

  /**
   * Get approved community questions for a country
   */
  static async getApprovedQuestions(countryId: string, limit: number = 20): Promise<CommunityQuestion[]> {
    const { data, error } = await supabase
      .from('community_questions')
      .select('*')
      .eq('country_id', countryId)
      .eq('status', 'approved')
      .order('votes_up', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching approved questions:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Vote on a community question
   */
  static async voteOnQuestion(questionId: string, voteType: 'up' | 'down'): Promise<void> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error('User not authenticated');

    // First, check if user already voted
    const { data: existingVote } = await supabase
      .from('question_votes')
      .select('*')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .single();

    if (existingVote) {
      // Update existing vote
      const { error } = await supabase
        .from('question_votes')
        .update({ vote_type: voteType })
        .eq('id', existingVote.id);

      if (error) throw error;
    } else {
      // Create new vote
      const { error } = await supabase
        .from('question_votes')
        .insert({
          user_id: userId,
          question_id: questionId,
          vote_type: voteType
        });

      if (error) throw error;
    }

    // Update vote counts on the question
    await this.updateVoteCounts(questionId);
  }

  /**
   * Update vote counts for a question
   */
  private static async updateVoteCounts(questionId: string): Promise<void> {
    const { data: votes } = await supabase
      .from('question_votes')
      .select('vote_type')
      .eq('question_id', questionId);

    const upVotes = votes?.filter(v => v.vote_type === 'up').length || 0;
    const downVotes = votes?.filter(v => v.vote_type === 'down').length || 0;

    await supabase
      .from('community_questions')
      .update({
        votes_up: upVotes,
        votes_down: downVotes
      })
      .eq('id', questionId);
  }

  /**
   * Get user's submitted questions
   */
  static async getUserQuestions(userId?: string): Promise<CommunityQuestion[]> {
    const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    if (!targetUserId) return [];

    const { data, error } = await supabase
      .from('community_questions')
      .select('*')
      .eq('submitted_by', targetUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user questions:', error);
      throw error;
    }

    return data || [];
  }
}
