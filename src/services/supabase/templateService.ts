
import { Country as FrontendCountry } from "@/types/quiz";
import { QuestionService } from "./questionService";

export class TemplateService {
  /**
   * Generate template questions for a country - EASY LEVEL ONLY
   */
  static async generateEasyQuestionsForCountry(
    country: FrontendCountry, 
    questionsPerCategory: number = 10
  ): Promise<void> {
    const categories = ['Geography', 'History', 'Culture', 'Economy', 'Nature'];
    const questions: any[] = [];
    
    for (const category of categories) {
      for (let i = 0; i < questionsPerCategory; i++) {
        const monthRotation = (i % 12) + 1;
        
        const question = {
          id: `${country.id}-easy-${category.toLowerCase()}-${monthRotation}-${i}`,
          country_id: country.id,
          text: this.getEasyQuestionTemplate(country, category, i),
          option_a: this.getEasyCorrectAnswer(country, category, i),
          option_b: `Option B for ${country.name}`,
          option_c: `Option C for ${country.name}`,
          option_d: `Option D for ${country.name}`,
          correct_answer: this.getEasyCorrectAnswer(country, category, i),
          difficulty: 'easy',
          category,
          explanation: `This is an easy level ${category} question about ${country.name}.`,
          month_rotation: monthRotation,
          ai_generated: false
        };
        
        questions.push(question);
      }
    }
    
    await QuestionService.saveQuestions(questions);
    console.log(`✅ Generated ${questions.length} easy questions for ${country.name} across all categories`);
  }

  private static getEasyQuestionTemplate(country: FrontendCountry, category: string, index: number): string {
    const templates = {
      Geography: [
        `What continent is ${country.name} located in?`,
        `What is the capital of ${country.name}?`,
        `Is ${country.name} a landlocked country?`,
        `What ocean/sea borders ${country.name}?`,
        `What is the approximate size of ${country.name}?`
      ],
      History: [
        `When did ${country.name} gain independence?`,
        `What was ${country.name} formerly known as?`,
        `Who was the first leader of ${country.name}?`,
        `What empire once controlled ${country.name}?`,
        `When was ${country.name} founded?`
      ],
      Culture: [
        `What is the main language spoken in ${country.name}?`,
        `What is the dominant religion in ${country.name}?`,
        `What is a traditional dish from ${country.name}?`,
        `What is ${country.name}'s national sport?`,
        `What festival is celebrated in ${country.name}?`
      ],
      Economy: [
        `What is the currency of ${country.name}?`,
        `What is ${country.name}'s main export?`,
        `What industry is important in ${country.name}?`,
        `What natural resource is found in ${country.name}?`,
        `What is ${country.name} known for producing?`
      ],
      Nature: [
        `What type of climate does ${country.name} have?`,
        `What animal is native to ${country.name}?`,
        `What is a famous landmark in ${country.name}?`,
        `What natural feature is ${country.name} known for?`,
        `What plant/tree is common in ${country.name}?`
      ]
    };
    
    const categoryTemplates = templates[category as keyof typeof templates] || templates.Geography;
    return categoryTemplates[index % categoryTemplates.length];
  }

  private static getEasyCorrectAnswer(country: FrontendCountry, category: string, index: number): string {
    if (category === 'Geography' && index % 5 === 0) return country.continent;
    if (category === 'Geography' && index % 5 === 1) return country.name; // Placeholder for capital
    
    return `Correct answer for ${country.name} - ${category}`;
  }
}
