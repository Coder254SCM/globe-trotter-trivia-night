
import { supabase } from "@/integrations/supabase/client";
import { QuestionService } from "./questionService";
import { CountryService } from "./countryService";

export interface QuestionRotation {
  id: string;
  country_id: string;
  rotation_month: string;
  questions_generated: number;
  rotation_completed: boolean;
  created_at: string;
}

export class RotationService {
  /**
   * Check if rotation is needed for current month
   */
  static async checkRotationNeeded(): Promise<string[]> {
    const currentMonth = new Date().toISOString().slice(0, 7) + '-01'; // YYYY-MM-01
    
    const countries = await CountryService.getAllCountries();
    const needsRotation: string[] = [];

    for (const country of countries) {
      const { data: rotation } = await supabase
        .from('question_rotations')
        .select('*')
        .eq('country_id', country.id)
        .eq('rotation_month', currentMonth)
        .single();

      if (!rotation || !rotation.rotation_completed) {
        needsRotation.push(country.id);
      }
    }

    return needsRotation;
  }

  /**
   * Start monthly rotation for a country
   */
  static async startMonthlyRotation(countryId: string): Promise<void> {
    const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
    
    // Create or update rotation record
    const { error: upsertError } = await supabase
      .from('question_rotations')
      .upsert({
        country_id: countryId,
        rotation_month: currentMonth,
        questions_generated: 0,
        rotation_completed: false
      }, { 
        onConflict: 'country_id,rotation_month' 
      });

    if (upsertError) {
      console.error('Error starting rotation:', upsertError);
      throw upsertError;
    }

    // Archive old questions (update month_rotation to mark them as old)
    const lastMonth = this.getLastMonth();
    await supabase
      .from('questions')
      .update({ month_rotation: lastMonth })
      .eq('country_id', countryId)
      .is('month_rotation', null);

    console.log(`✅ Started monthly rotation for country ${countryId}`);
  }

  /**
   * Complete rotation for a country
   */
  static async completeRotation(countryId: string, questionsGenerated: number): Promise<void> {
    const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
    
    const { error } = await supabase
      .from('question_rotations')
      .update({
        questions_generated: questionsGenerated,
        rotation_completed: true
      })
      .eq('country_id', countryId)
      .eq('rotation_month', currentMonth);

    if (error) {
      console.error('Error completing rotation:', error);
      throw error;
    }

    console.log(`✅ Completed rotation for country ${countryId}: ${questionsGenerated} questions`);
  }

  /**
   * Get rotation status for all countries
   */
  static async getRotationStatus(): Promise<Record<string, QuestionRotation>> {
    const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
    
    const { data, error } = await supabase
      .from('question_rotations')
      .select('*')
      .eq('rotation_month', currentMonth);

    if (error) {
      console.error('Error fetching rotation status:', error);
      throw error;
    }

    const status: Record<string, QuestionRotation> = {};
    data?.forEach(rotation => {
      status[rotation.country_id] = rotation;
    });

    return status;
  }

  /**
   * Get questions for current month (prioritizing new ones)
   */
  static async getCurrentMonthQuestions(
    countryId: string, 
    difficulty?: string, 
    limit: number = 10
  ): Promise<any[]> {
    const currentMonth = new Date().getMonth() + 1;
    
    // First try to get questions from current month rotation
    let { data: questions } = await supabase
      .from('questions')
      .select('*')
      .eq('country_id', countryId)
      .eq('month_rotation', currentMonth)
      .order('created_at', { ascending: false })
      .limit(limit);

    // If not enough questions, supplement with approved community questions
    if (!questions || questions.length < limit) {
      const { data: communityQuestions } = await supabase
        .from('community_questions')
        .select('*')
        .eq('country_id', countryId)
        .eq('status', 'approved')
        .order('votes_up', { ascending: false })
        .limit(limit - (questions?.length || 0));

      // Transform community questions to standard format
      const transformedCommunity = communityQuestions?.map(q => ({
        id: q.id,
        country_id: q.country_id,
        text: q.text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_answer: q.correct_answer,
        difficulty: q.difficulty,
        category: q.category,
        explanation: q.explanation,
        month_rotation: currentMonth,
        ai_generated: false
      })) || [];

      questions = [...(questions || []), ...transformedCommunity];
    }

    // If still not enough, fall back to existing questions
    if (questions.length < limit) {
      const { data: fallbackQuestions } = await supabase
        .from('questions')
        .select('*')
        .eq('country_id', countryId)
        .order('created_at', { ascending: false })
        .limit(limit - questions.length);

      questions = [...questions, ...(fallbackQuestions || [])];
    }

    return questions.slice(0, limit);
  }

  /**
   * Helper: Get last month number
   */
  private static getLastMonth(): number {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return lastMonth.getMonth() + 1;
  }
}
