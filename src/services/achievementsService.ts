import { supabase } from "@/integrations/supabase/client";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url?: string;
  requirement_type: string;
  requirement_value: number;
  badge_color: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  progress: number;
  achievement?: Achievement;
}

export class AchievementsService {
  static async getAllAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('requirement_value');

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }

    return data || [];
  }

  static async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements(*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }

    return data || [];
  }

  static async checkAndAwardAchievements(userId: string): Promise<UserAchievement[]> {
    const newAchievements: UserAchievement[] = [];

    // Get user stats
    const { data: userStats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!userStats || !userProfile) return newAchievements;

    // Get all achievements user hasn't earned yet
    const { data: unearned } = await supabase
      .from('achievements')
      .select('*')
      .not('id', 'in', 
        `(SELECT achievement_id FROM user_achievements WHERE user_id = '${userId}')`
      );

    if (!unearned) return newAchievements;

    // Check each achievement
    for (const achievement of unearned) {
      let shouldAward = false;

      switch (achievement.requirement_type) {
        case 'quizzes_completed':
          shouldAward = userProfile.questions_answered >= achievement.requirement_value;
          break;
        case 'perfect_scores':
          // This would need to be tracked separately
          break;
        case 'countries_mastered':
          shouldAward = userProfile.countries_mastered >= achievement.requirement_value;
          break;
        case 'daily_streak':
          shouldAward = userStats.current_streak >= achievement.requirement_value;
          break;
        case 'fast_answers':
          // This would need special tracking
          break;
      }

      if (shouldAward) {
        const { data: newAchievement, error } = await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
            progress: achievement.requirement_value
          })
          .select(`
            *,
            achievements(*)
          `)
          .single();

        if (!error && newAchievement) {
          newAchievements.push(newAchievement);
        }
      }
    }

    return newAchievements;
  }

  static async updateAchievementProgress(
    userId: string, 
    achievementId: string, 
    progress: number
  ): Promise<{ error?: string }> {
    const { error } = await supabase
      .from('user_achievements')
      .upsert({
        user_id: userId,
        achievement_id: achievementId,
        progress
      });

    if (error) {
      console.error('Error updating achievement progress:', error);
      return { error: error.message };
    }

    return {};
  }

  static async getAchievementLeaderboard(achievementId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        user_profiles(username, avatar_url)
      `)
      .eq('achievement_id', achievementId)
      .order('earned_at')
      .limit(100);

    if (error) {
      console.error('Error fetching achievement leaderboard:', error);
      return [];
    }

    return data || [];
  }
}