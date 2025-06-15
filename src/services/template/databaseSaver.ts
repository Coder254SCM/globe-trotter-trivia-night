
import { Question } from "@/types/quiz";
import { Country } from "../supabase/country/countryTypes";
import { QuestionService } from "../supabase/questionService";

export async function saveQuestionsToSupabase(
  questions: Question[],
  country: Country,
  difficulty: string
): Promise<void> {
  const currentMonth = new Date().getMonth() + 1;
  const questionsToInsert = questions.map(q => ({
    id: q.id,
    country_id: country.id,
    text: q.text,
    option_a: q.choices[0]?.text || '',
    option_b: q.choices[1]?.text || '',
    option_c: q.choices[2]?.text || '',
    option_d: q.choices[3]?.text || '',
    correct_answer: q.choices.find(c => c.isCorrect)?.text || '',
    difficulty: difficulty,
    category: q.category,
    explanation: q.explanation,
    month_rotation: currentMonth,
    ai_generated: false,
    image_url: q.imageUrl
  }));

  try {
    await QuestionService.saveQuestions(questionsToInsert);
    console.log(`✅ Successfully saved ${questions.length} questions for ${country.name} (${difficulty})`);
  } catch (error) {
    console.error(`❌ Failed to save questions for ${country.name}:`, error);
  }
}
