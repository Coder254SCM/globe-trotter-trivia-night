
import { supabase } from "../../integrations/supabase/client";
import { ManualQuestion } from "./questionTypes";

export class ManualQuestionService {
  static async saveQuestions(questions: ManualQuestion[]): Promise<void> {
    const { error } = await supabase
      .from('questions')
      .upsert(questions, { onConflict: 'id' });

    if (error) {
      console.error('Error saving questions:', error);
      throw error;
    }

    console.log(`✅ Saved ${questions.length} questions to Supabase`);
  }

  static async getCountryByName(countryName: string) {
    const { data: countryData, error } = await supabase
      .from('countries')
      .select('*')
      .eq('name', countryName)
      .single();

    if (error || !countryData) {
      throw new Error(`Country ${countryName} not found`);
    }

    return countryData;
  }

  static async getAllCountries() {
    const { data: countriesRaw, error } = await supabase
      .from('countries')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    return countriesRaw || [];
  }

  static async getHardQuestionStats() {
    const { data: stats } = await supabase
      .from('questions')
      .select('country_id, difficulty')
      .eq('difficulty', 'hard');
    
    const hardQuestionCount = stats?.length || 0;
    const countriesWithHard = new Set(stats?.map(q => q.country_id)).size;
    
    return {
      hardQuestionCount,
      countriesWithHard,
      avgPerCountry: Math.round(hardQuestionCount / (countriesWithHard || 1))
    };
  }
}
