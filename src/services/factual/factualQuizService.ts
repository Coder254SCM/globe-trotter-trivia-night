import { FactualQuestionGenerator } from "./factualQuestionGenerator";
import { supabase } from "@/integrations/supabase/client";

export class FactualQuizService {
  /**
   * Clean up wrong questions and generate new factual ones
   */
  static async cleanAndGenerateQuestions(countryId: string, difficulty: 'easy' | 'medium' | 'hard', count: number = 10) {
    console.log(`🧹 Cleaning and generating factual questions for ${countryId}`);
    
    try {
      // Delete existing wrong questions for this country
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .eq('country_id', countryId);

      if (deleteError) {
        console.warn('Failed to delete old questions:', deleteError);
      }

      // Generate new factual questions
      const questions = FactualQuestionGenerator.generateQuestions(countryId, difficulty, count);
      
      if (questions.length === 0) {
        console.warn(`⚠️ No factual data available for ${countryId}`);
        return [];
      }

      // Save to database
      const questionsToSave = questions.map(q => ({
        id: q.id,
        text: q.text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        category: q.category,
        difficulty: q.difficulty,
        country_id: q.country_id,
        image_url: q.image_url || '',
        ai_generated: false,
        month_rotation: 1
      }));

      const { error } = await supabase
        .from('questions')
        .insert(questionsToSave);

      if (error) {
        console.error('❌ Database insert error:', error);
        return questions; // Return questions even if save fails
      }

      console.log(`✅ Generated and saved ${questions.length} factual questions for ${countryId}`);
      return questions;
    } catch (error) {
      console.error(`❌ Error generating factual questions:`, error);
      return [];
    }
  }
}