
import { Question } from "@/types/quiz";
import { Country } from "./supabase/country/countryTypes";
import { buildValidQuestions } from "./template/questionBuilder";
import { saveQuestionsToSupabase } from "./template/databaseSaver";

export class TemplateQuestionService {
  public static async generateQuestions(
    country: Country,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number,
    category: string
  ): Promise<void> {
    console.log(`🔧 Generating ${count} ${difficulty} questions for ${country.name} in category ${category}`);
    
    const questions = buildValidQuestions(country, difficulty, count, category);

    if (questions.length > 0) {
      console.log(`👉 Generated ${questions.length} valid questions for ${country.name}:`);
      questions.forEach(q => {
        console.log(`- ${q.text.substring(0, 60)}... [${q.category}, ${q.difficulty}]`);
      });
      await saveQuestionsToSupabase(questions, country, difficulty);
    } else {
      console.log(`❌ No valid questions generated for ${country.name} (${difficulty}, ${category})`);
    }
  }
}
