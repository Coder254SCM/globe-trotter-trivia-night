import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/types/quiz";
import { Country } from "./supabase/country/countryTypes";
import { EnhancedQuestionGenerator } from "./template/enhancedQuestionGenerator";
import { QuestionQualityService } from "./quality/questionQualityService";

export class TemplateQuestionService {
  static async saveQuestions(
    questions: Question[],
    countryId: string,
    difficulty: string,
    category: string
  ): Promise<boolean> {
    try {
      const questionsToInsert = questions.map(q => ({
        text: q.text,
        option_a: q.choices[0].text,
        option_b: q.choices[1].text,
        option_c: q.choices[2].text,
        option_d: q.choices[3].text,
        correct_answer: q.choices.find(c => c.isCorrect)?.text,
        explanation: q.explanation,
        category: category,
        difficulty: difficulty,
        country_id: countryId,
        image_url: q.imageUrl
      }));

      const { error } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (error) {
        console.error('Failed to save questions to Supabase:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving questions:', error);
      return false;
    }
  }

  static async generateQuestions(
    country: Country,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number = 50,
    category: string = 'Geography'
  ): Promise<boolean> {
    try {
      console.log(`🎯 Generating ${count} enhanced questions for ${country.name}...`);
      
      const questions: Question[] = [];
      const maxAttempts = count * 3;

      for (let attempt = 0; attempt < maxAttempts && questions.length < count; attempt++) {
        // Use enhanced generator for better quality
        const questionData = EnhancedQuestionGenerator.generateGeographyQuestion(
          country,
          difficulty,
          attempt
        );

        if (questionData && questionData.validated) {
          const question: Question = {
            id: `enhanced-${country.id}-${difficulty}-${Date.now()}-${attempt}`,
            type: 'multiple-choice',
            text: questionData.text,
            choices: questionData.options.map((option, index) => ({
              id: String.fromCharCode(97 + index),
              text: option,
              isCorrect: option === questionData.correct,
            })),
            category: questionData.category as any,
            explanation: questionData.explanation,
            difficulty: questionData.difficulty as any,
          };

          // Quality check before adding
          if (questionData.qualityScore >= 80) {
            questions.push(question);
          }
        }
      }

      if (questions.length === 0) {
        console.warn(`❌ No quality questions generated for ${country.name}`);
        return false;
      }

      // Save to database
      await this.saveQuestions(questions, country.id, difficulty, category);
      
      console.log(`✅ Generated and saved ${questions.length} enhanced questions for ${country.name}`);
      return true;

    } catch (error) {
      console.error(`❌ Failed to generate questions for ${country.name}:`, error);
      return false;
    }
  }
}
