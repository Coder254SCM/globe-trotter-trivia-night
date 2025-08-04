/**
 * Community-driven question validation system
 * Uses existing tables for non-AI quality management through user voting and moderation
 */

import { supabase } from "@/integrations/supabase/client";

export interface QuestionVote {
  id: string;
  questionId: string;
  userId: string;
  voteType: 'upvote' | 'downvote' | 'report';
  reason?: string;
  createdAt: Date;
}

export class CommunityValidationService {
  
  /**
   * Submit a user vote for a question using existing question_votes table
   */
  static async voteOnQuestion(
    questionId: string, 
    voteType: 'upvote' | 'downvote' | 'report', 
    reason?: string
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user already voted on this question
      const { data: existingVote } = await supabase
        .from('question_votes')
        .select('id')
        .eq('question_id', questionId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingVote) {
        // Update existing vote
        const { error } = await supabase
          .from('question_votes')
          .update({ 
            vote_type: voteType
          })
          .eq('id', existingVote.id);

        if (error) throw error;
      } else {
        // Create new vote
        const { error } = await supabase
          .from('question_votes')
          .insert({
            question_id: questionId,
            user_id: user.id,
            vote_type: voteType
          });

        if (error) throw error;
      }
      
      console.log(`✅ Vote recorded: ${voteType} for question ${questionId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to vote on question:', error);
      return false;
    }
  }

  /**
   * Report a question for quality issues using community_questions moderation
   */
  static async reportQuestion(
    questionId: string,
    issueType: 'duplicate' | 'irrelevant' | 'incorrect' | 'inappropriate' | 'poor_quality',
    description: string
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Auto-vote as report using existing system
      await this.voteOnQuestion(questionId, 'report', description);
      
      console.log(`✅ Question reported: ${questionId} for ${issueType}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to report question:', error);
      return false;
    }
  }

  /**
   * Get questions with high report counts
   */
  static async getPendingModerationQuestions(): Promise<any[]> {
    try {
      // Get questions with multiple reports
      const { data: reportedQuestions, error } = await supabase
        .from('question_votes')
        .select('question_id')
        .eq('vote_type', 'report');

      if (error) throw error;

      if (!reportedQuestions || reportedQuestions.length === 0) {
        return [];
      }

      // Get unique question IDs with report counts
      const questionCounts = reportedQuestions.reduce((acc: any, vote: any) => {
        acc[vote.question_id] = (acc[vote.question_id] || 0) + 1;
        return acc;
      }, {});

      // Get questions with 2+ reports
      const problematicQuestionIds = Object.keys(questionCounts).filter(
        id => questionCounts[id] >= 2
      );

      if (problematicQuestionIds.length === 0) {
        return [];
      }

      // Fetch question details
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .in('id', problematicQuestionIds);

      if (questionsError) throw questionsError;

      return (questions || []).map(q => ({
        ...q,
        reportCount: questionCounts[q.id]
      }));
    } catch (error) {
      console.error('❌ Failed to fetch pending questions:', error);
      return [];
    }
  }

  /**
   * Moderate a question (admin/moderator only)
   */
  static async moderateQuestion(
    questionId: string,
    action: 'approve' | 'reject' | 'edit' | 'flag',
    reason: string
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user has moderator role
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!userRole || !['admin', 'moderator'].includes(userRole.role)) {
        throw new Error('Insufficient permissions');
      }

      // If rejecting, remove the question
      if (action === 'reject') {
        const { error } = await supabase
          .from('questions')
          .delete()
          .eq('id', questionId);

        if (error) throw error;
      }

      console.log(`✅ Question moderated: ${action} for question ${questionId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to moderate question:', error);
      return false;
    }
  }

  /**
   * Get question quality metrics
   */
  static async getQuestionQualityMetrics(questionId: string): Promise<{
    upvotes: number;
    downvotes: number;
    reports: number;
    qualityScore: number;
  }> {
    try {
      const { data: votes, error } = await supabase
        .from('question_votes')
        .select('vote_type')
        .eq('question_id', questionId);

      if (error) throw error;

      const upvotes = votes?.filter(v => v.vote_type === 'upvote').length || 0;
      const downvotes = votes?.filter(v => v.vote_type === 'downvote').length || 0;
      const reports = votes?.filter(v => v.vote_type === 'report').length || 0;

      // Calculate quality score (0-100)
      const totalVotes = upvotes + downvotes;
      const qualityScore = totalVotes > 0 ? 
        Math.round(((upvotes - reports) / totalVotes) * 100) : 50;

      return {
        upvotes,
        downvotes,
        reports,
        qualityScore: Math.max(0, Math.min(100, qualityScore))
      };
    } catch (error) {
      console.error('❌ Failed to get quality metrics:', error);
      return { upvotes: 0, downvotes: 0, reports: 0, qualityScore: 50 };
    }
  }

  /**
   * Get user's moderation statistics
   */
  static async getUserModerationStats(userId: string): Promise<{
    votesSubmitted: number;
    reportsSubmitted: number;
    qualityScore: number;
  }> {
    try {
      const { data: votes } = await supabase
        .from('question_votes')
        .select('vote_type')
        .eq('user_id', userId);

      const votesSubmitted = votes?.length || 0;
      const reportsSubmitted = votes?.filter(v => v.vote_type === 'report').length || 0;

      // Calculate user quality contribution score
      const qualityScore = Math.min(100, 
        (votesSubmitted * 1) + 
        (reportsSubmitted * 3)
      );

      return {
        votesSubmitted,
        reportsSubmitted,
        qualityScore
      };
    } catch (error) {
      console.error('❌ Failed to get user moderation stats:', error);
      return { votesSubmitted: 0, reportsSubmitted: 0, qualityScore: 0 };
    }
  }

  /**
   * Get top contributors for quality management
   */
  static async getTopContributors(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          username,
          avatar_url
        `)
        .limit(limit);

      if (error) throw error;

      // Calculate contribution scores for each user
      const contributors = await Promise.all(
        (data || []).map(async (user) => {
          const stats = await this.getUserModerationStats(user.id);
          return {
            ...user,
            ...stats
          };
        })
      );

      // Sort by quality score
      return contributors.sort((a, b) => b.qualityScore - a.qualityScore);
    } catch (error) {
      console.error('❌ Failed to get top contributors:', error);
      return [];
    }
  }

}