
import { ServiceCountry, QuestionData } from "./types";
import { GeographyQuestions } from "./geographyQuestions";
import { HistoryQuestions } from "./historyQuestions";
import { CultureQuestions } from "./cultureQuestions";
import { EconomyQuestions } from "./economyQuestions";
import { NatureQuestions } from "./natureQuestions";

export class QuestionGenerator {
  static generateCategoryQuestions(country: ServiceCountry, category: string, count: number): any[] {
    const questions: any[] = [];
    
    for (let i = 0; i < count; i++) {
      const monthRotation = (i % 12) + 1;
      const questionData = this.getSpecificQuestion(country, category, i);
      
      const question = {
        id: `${country.id}-medium-${category.toLowerCase()}-${monthRotation}-${i}`,
        country_id: country.id,
        text: questionData.text,
        option_a: questionData.correct,
        option_b: questionData.optionB,
        option_c: questionData.optionC,
        option_d: questionData.optionD,
        correct_answer: questionData.correct,
        difficulty: 'medium',
        category,
        explanation: questionData.explanation,
        month_rotation: monthRotation,
        ai_generated: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        image_url: null
      };
      
      questions.push(question);
    }
    
    return questions;
  }

  private static getSpecificQuestion(country: ServiceCountry, category: string, index: number): QuestionData {
    switch (category) {
      case 'Geography':
        return GeographyQuestions.generate(country, index);
      case 'History':
        return HistoryQuestions.generate(country, index);
      case 'Culture':
        return CultureQuestions.generate(country, index);
      case 'Economy':
        return EconomyQuestions.generate(country, index);
      case 'Nature':
        return NatureQuestions.generate(country, index);
      default:
        return GeographyQuestions.generate(country, index);
    }
  }
}
