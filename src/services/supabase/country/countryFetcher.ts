
import { supabase } from "@/integrations/supabase/client";
import { Country as FrontendCountry } from "@/types/quiz";
import { Country as ServiceCountry } from "./countryTypes";

export class CountryFetcher {
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
        categories: (country.categories || ['Geography']) as any[],
        flagImageUrl: country.flag_url,
        continent: country.continent
      }));
    } catch (error) {
      console.error('Failed to fetch countries from Supabase:', error);
      throw error;
    }
  }

  /**
   * Get all countries from Supabase in service format
   */
  static async getAllServiceCountries(): Promise<ServiceCountry[]> {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('id, name, capital, continent, population, area_km2, latitude, longitude, flag_url, categories, difficulty')
        .order('name');

      if (error) {
        console.error('Error fetching service countries:', error);
        throw error;
      }

      console.log(`📊 Loaded ${data?.length || 0} service countries from Supabase`);
      
      return (data || []) as ServiceCountry[];
    } catch (error) {
      console.error('Failed to fetch service countries from Supabase:', error);
      throw error;
    }
  }
}
