
import { Question as FrontendQuestion } from "@/types/quiz";

export class QuestionValidator {
  /**
   * Validate question content for quality
   */
  static validateQuestionContent(questions: FrontendQuestion[]): FrontendQuestion[] {
    const placeholderPatterns = [
      /placeholder/i,
      /methodology [a-d]/i,
      /approach [a-d]/i,
      /technique [a-d]/i,
      /method [a-d]/i,
      /option [a-d] for/i,
      /correct answer for/i,
      /incorrect option/i,
      /cutting-edge/i,
      /state-of-the-art/i,
      /innovative/i,
      /advanced/i
    ];

    return questions.filter(question => {
      const textToCheck = [
        question.text,
        ...question.choices.map(c => c.text)
      ].join(' ');

      const hasPlaceholders = placeholderPatterns.some(pattern => 
        pattern.test(textToCheck)
      );

      if (hasPlaceholders) {
        console.warn('❌ [QuestionValidator] Filtered out question with placeholder content:', question.text.substring(0, 50));
        return false;
      }

      return true;
    });
  }

  /**
   * Remove duplicate questions based on text content
   */
  static deduplicateQuestions(questions: FrontendQuestion[]): FrontendQuestion[] {
    const seen = new Set<string>();
    const uniqueQuestions: FrontendQuestion[] = [];

    questions.forEach(question => {
      const questionFingerprint = question.text.toLowerCase().trim();
      
      if (!seen.has(questionFingerprint)) {
        seen.add(questionFingerprint);
        uniqueQuestions.push(question);
      } else {
        console.warn('🔄 [QuestionValidator] Removed duplicate question:', question.text.substring(0, 50));
      }
    });

    return uniqueQuestions;
  }
}
