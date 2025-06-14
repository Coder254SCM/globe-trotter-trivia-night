
import { supabase } from "@/integrations/supabase/client";
import { QuestionStats } from "./questionTypes";

export class QuestionStatsService {
  /**
   * Get question statistics for a country
   */
  static async getCountryStats(countryId: string): Promise<QuestionStats> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('difficulty, category')
        .eq('country_id', countryId);

      if (error) throw error;

      const stats: QuestionStats = {
        total: data?.length || 0,
        byDifficulty: {},
        byCategory: {}
      };

      data?.forEach(q => {
        // Count by difficulty
        stats.byDifficulty[q.difficulty] = (stats.byDifficulty[q.difficulty] || 0) + 1;
        
        // Count by category
        stats.byCategory[q.category] = (stats.byCategory[q.category] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Failed to get country stats:', error);
      return {
        total: 0,
        byDifficulty: {},
        byCategory: {}
      };
    }
  }

  /**
   * Get global question statistics
   */
  static async getGlobalStats(): Promise<QuestionStats> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('difficulty, category');

      if (error) throw error;

      const stats: QuestionStats = {
        total: data?.length || 0,
        byDifficulty: {},
        byCategory: {}
      };

      data?.forEach(q => {
        stats.byDifficulty[q.difficulty] = (stats.byDifficulty[q.difficulty] || 0) + 1;
        stats.byCategory[q.category] = (stats.byCategory[q.category] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Failed to get global stats:', error);
      return {
        total: 0,
        byDifficulty: {},
        byCategory: {}
      };
    }
  }
}
