import { Question } from "@/types/quiz";
import { Country } from "../supabase/country/countryTypes";
import { generateGeographyQuestion } from "./geographyGenerator";
import { generateCultureQuestion } from "./cultureGenerator";
import { isValidQuestion } from "./questionValidation";
import { generateAdvancedQuestion } from "./advancedTemplateGenerator";
import { getCountryInfo } from "../../utils/external/restCountriesApi";

export async function buildValidQuestions(
  country: Country,
  difficulty: 'easy' | 'medium' | 'hard',
  count: number,
  category: string
): Promise<Question[]> {
  const questions: Question[] = [];
  const maxAttempts = count * 3;

  // Try to get external data once (for all generated questions)
  const externalData = await getCountryInfo(country.name);

  for (let attempt = 0; attempt < maxAttempts && questions.length < count; attempt++) {
    let questionData;
    // Use advanced templates for more variation
    if (externalData) {
      questionData = await generateAdvancedQuestion({
        country,
        difficulty,
        seed: attempt,
        extraData: externalData
      });
    } else {
      // Fallback to existing generators for now
      questionData = generateSingleQuestion(country, difficulty, category, attempt);
    }
    if (questionData && isValidQuestion(questionData)) {
      const question: Question = {
        id: `template-${country.id}-${difficulty}-${category.toLowerCase()}-${Date.now()}-${attempt}`,
        type: 'multiple-choice',
        text: questionData.text,
        choices: questionData.options.map((option: string, index: number) => ({
          id: String.fromCharCode(97 + index),
          text: option,
          isCorrect: option === questionData.correct,
        })),
        category: category as any,
        explanation: questionData.explanation,
        difficulty: difficulty as any,
      };
      questions.push(question);
    }
  }

  return questions;
}

function generateSingleQuestion(
  country: Country,
  difficulty: 'easy' | 'medium' | 'hard',
  category: string,
  seed: number
) {
  if (category.toLowerCase() === 'geography') {
    return generateGeographyQuestion(country, difficulty, seed);
  } else if (category.toLowerCase() === 'culture') {
    return generateCultureQuestion(country, difficulty, seed);
  }
  return null;
}
