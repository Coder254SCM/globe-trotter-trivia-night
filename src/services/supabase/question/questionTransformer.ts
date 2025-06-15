
import { Question as FrontendQuestion } from "@/types/quiz";

export class QuestionTransformer {
  /**
   * Transform database question to frontend format
   */
  static transformToFrontendQuestion(dbQuestion: any): FrontendQuestion {
    const choices = [
      { id: 'a', text: dbQuestion.option_a, isCorrect: dbQuestion.correct_answer === dbQuestion.option_a },
      { id: 'b', text: dbQuestion.option_b, isCorrect: dbQuestion.correct_answer === dbQuestion.option_b },
      { id: 'c', text: dbQuestion.option_c, isCorrect: dbQuestion.correct_answer === dbQuestion.option_c },
      { id: 'd', text: dbQuestion.option_d, isCorrect: dbQuestion.correct_answer === dbQuestion.option_d },
    ];

    return {
      id: dbQuestion.id,
      type: 'multiple-choice',
      text: dbQuestion.text,
      choices,
      explanation: dbQuestion.explanation || `The correct answer is ${dbQuestion.correct_answer}.`,
      category: dbQuestion.category,
      difficulty: dbQuestion.difficulty,
      imageUrl: dbQuestion.image_url
    };
  }
}
