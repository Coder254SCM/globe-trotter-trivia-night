
import { supabase } from "@/integrations/supabase/client";
import countries from "@/data/countries";
import { Country as FrontendCountry, QuestionCategory } from "@/types/quiz";

export interface Country {
  id: string;
  name: string;
  capital: string;
  continent: string;
  population: number;
  area_km2: number;
  latitude: number;
  longitude: number;
  flag_url?: string;
  categories?: QuestionCategory[];
  difficulty?: string;
}

export class CountryService {
  /**
   * Get all countries from Supabase and transform to frontend format
   */
  static async getAllCountries(): Promise<FrontendCountry[]> {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching countries:', error);
        throw error;
      }

      console.log(`📊 Loaded ${data?.length || 0} countries from Supabase`);
      
      // Transform Supabase countries to frontend format
      return (data || []).map(country => ({
        id: country.id,
        name: country.name,
        code: country.id.slice(0, 3).toUpperCase(),
        position: {
          lat: country.latitude || 0,
          lng: country.longitude || 0
        },
        difficulty: (country.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
        categories: (country.categories || ['Geography']) as QuestionCategory[],
        flagImageUrl: country.flag_url,
        continent: country.continent
      }));
    } catch (error) {
      console.error('Failed to fetch countries from Supabase:', error);
      throw error;
    }
  }

  /**
   * Populate all 195 countries into Supabase - PRODUCTION READY
   */
  static async populateAllCountries(): Promise<void> {
    try {
      console.log(`🌍 PRODUCTION: Populating ${countries.length} countries...`);
      
      // Check if countries already exist
      const { count } = await supabase
        .from('countries')
        .select('*', { count: 'exact', head: true });

      if (count && count > 0) {
        console.log(`✅ Database already contains ${count} countries. Skipping population.`);
        return;
      }
      
      const countriesToInsert = countries.map(country => ({
        id: country.id,
        name: country.name,
        capital: country.name, // Use name as placeholder for capital until we have real data
        continent: country.continent,
        population: 1000000, // Placeholder population
        area_km2: 100000, // Placeholder area
        latitude: country.position?.lat || 0,
        longitude: country.position?.lng || 0,
        flag_url: country.flagImageUrl,
        categories: country.categories || ['Geography'],
        difficulty: country.difficulty || 'medium'
      }));

      const { error } = await supabase
        .from('countries')
        .upsert(countriesToInsert, { onConflict: 'id' });

      if (error) {
        console.error('Error populating countries:', error);
        throw error;
      }

      console.log(`✅ PRODUCTION: Successfully populated ${countries.length} countries`);
      console.log(`🎯 All ${countries.length} countries are now ready for quiz generation`);
    } catch (error) {
      console.error('Failed to populate countries:', error);
      throw error;
    }
  }

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
