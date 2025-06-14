
import { supabase } from "@/integrations/supabase/client";

export class CountryStats {
  /**
   * Get database statistics - PRODUCTION READY
   */
  static async getDatabaseStats(): Promise<any> {
    try {
      // Get country count
      const { count: countryCount } = await supabase
        .from('countries')
        .select('*', { count: 'exact', head: true });

      // Get question count
      const { count: questionCount } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

      // Get countries with questions
      const { data: countriesWithQuestions } = await supabase
        .from('questions')
        .select('country_id')
        .neq('country_id', null);

      const uniqueCountriesWithQuestions = new Set(
        countriesWithQuestions?.map(q => q.country_id) || []
      ).size;

      // Get continents
      const { data: continentsData } = await supabase
        .from('countries')
        .select('continent');

      const continents = continentsData?.reduce((acc, item) => {
        acc[item.continent] = true;
        return acc;
      }, {} as Record<string, boolean>) || {};

      const stats = {
        totalCountries: countryCount || 0,
        totalQuestions: questionCount || 0,
        countriesWithQuestions: uniqueCountriesWithQuestions,
        averageQuestionsPerCountry: countryCount ? Math.round((questionCount || 0) / countryCount * 10) / 10 : 0,
        continents
      };

      console.log('📊 PRODUCTION Database Statistics:', stats);
      return stats;
    } catch (error) {
      console.error('Failed to get database stats:', error);
      throw error;
    }
  }
}
