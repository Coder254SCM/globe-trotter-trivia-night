/**
 * Community-driven question validation system
 * Provides non-AI quality management through user voting and moderation
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

export interface QualityReport {
  id: string;
  questionId: string;
  reportedBy: string;
  issueType: 'duplicate' | 'irrelevant' | 'incorrect' | 'inappropriate' | 'poor_quality';
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: Date;
}

export interface ModerationAction {
  id: string;
  questionId: string;
  moderatorId: string;
  action: 'approve' | 'reject' | 'edit' | 'flag';
  reason: string;
  createdAt: Date;
}

export class CommunityValidationService {
  
  /**
   * Submit a user vote for a question
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
        .single();

      if (existingVote) {
        // Update existing vote
        const { error } = await supabase
          .from('question_votes')
          .update({ 
            vote_type: voteType,
            created_at: new Date().toISOString()
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

      // Update question vote counts
      await this.updateQuestionVoteCounts(questionId);
      
      console.log(`✅ Vote recorded: ${voteType} for question ${questionId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to vote on question:', error);
      return false;
    }
  }

  /**
   * Report a question for quality issues
   */
  static async reportQuestion(
    questionId: string,
    issueType: 'duplicate' | 'irrelevant' | 'incorrect' | 'inappropriate' | 'poor_quality',
    description: string
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create quality report
      const { error } = await supabase
        .from('quality_reports')
        .insert({
          question_id: questionId,
          reported_by: user.id,
          issue_type: issueType,
          description: description,
          status: 'pending'
        });

      if (error) throw error;

      // Auto-vote as report
      await this.voteOnQuestion(questionId, 'report', description);
      
      console.log(`✅ Question reported: ${questionId} for ${issueType}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to report question:', error);
      return false;
    }
  }

  /**
   * Get questions pending moderation
   */
  static async getPendingModerationQuestions(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('quality_reports')
        .select(`
          *,
          questions (
            id,
            text,
            correct_answer,
            option_a,
            option_b,
            option_c,
            option_d,
            country_id,
            category,
            difficulty
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Failed to fetch pending questions:', error);
      return [];
    }
  }

  /**
   * Moderate a reported question (admin/moderator only)
   */
  static async moderateQuestion(
    reportId: string,
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
        .single();

      if (!userRole || !['admin', 'moderator'].includes(userRole.role)) {
        throw new Error('Insufficient permissions');
      }

      // Update report status
      const { error: reportError } = await supabase
        .from('quality_reports')
        .update({
          status: action === 'approve' ? 'resolved' : 'reviewed',
          moderated_by: user.id,
          moderated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (reportError) throw reportError;

      // Record moderation action
      const { data: report } = await supabase
        .from('quality_reports')
        .select('question_id')
        .eq('id', reportId)
        .single();

      if (report) {
        const { error: actionError } = await supabase
          .from('moderation_actions')
          .insert({
            question_id: report.question_id,
            moderator_id: user.id,
            action: action,
            reason: reason
          });

        if (actionError) throw actionError;

        // If rejecting, remove the question
        if (action === 'reject') {
          await supabase
            .from('questions')
            .delete()
            .eq('id', report.question_id);
        }
      }

      console.log(`✅ Question moderated: ${action} for report ${reportId}`);
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
    moderationActions: number;
    qualityScore: number;
  }> {
    try {
      const [votes, reports, actions] = await Promise.all([
        supabase
          .from('question_votes')
          .select('id')
          .eq('user_id', userId),
        supabase
          .from('quality_reports')
          .select('id')
          .eq('reported_by', userId),
        supabase
          .from('moderation_actions')
          .select('id')
          .eq('moderator_id', userId)
      ]);

      const votesSubmitted = votes.data?.length || 0;
      const reportsSubmitted = reports.data?.length || 0;
      const moderationActions = actions.data?.length || 0;

      // Calculate user quality contribution score
      const qualityScore = Math.min(100, 
        (votesSubmitted * 1) + 
        (reportsSubmitted * 3) + 
        (moderationActions * 5)
      );

      return {
        votesSubmitted,
        reportsSubmitted,
        moderationActions,
        qualityScore
      };
    } catch (error) {
      console.error('❌ Failed to get user moderation stats:', error);
      return { votesSubmitted: 0, reportsSubmitted: 0, moderationActions: 0, qualityScore: 0 };
    }
  }

  /**
   * Update question vote counts (internal helper)
   */
  private static async updateQuestionVoteCounts(questionId: string): Promise<void> {
    try {
      const { data: votes } = await supabase
        .from('question_votes')
        .select('vote_type')
        .eq('question_id', questionId);

      if (!votes) return;

      const upvotes = votes.filter(v => v.vote_type === 'upvote').length;
      const downvotes = votes.filter(v => v.vote_type === 'downvote').length;

      // Update community_questions table if it exists
      await supabase
        .from('community_questions')
        .update({
          votes_up: upvotes,
          votes_down: downvotes
        })
        .eq('id', questionId);

    } catch (error) {
      console.error('❌ Failed to update vote counts:', error);
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
          avatar_url,
          user_roles (role)
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