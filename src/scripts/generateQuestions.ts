
import { QuizService } from '../services/supabase/quizService';
import { QuestionService } from '../services/supabase/questionService';

interface GenerationOptions {
  mediumOnly?: boolean;
  hardOnly?: boolean;
  questionsPerDifficulty?: number;
}

class QuestionGenerator {
  /**
   * Generate questions for all countries with MANDATORY validation
   */
  static async generateAllQuestions(options: GenerationOptions = {}): Promise<void> {
    const {
      mediumOnly = false,
      hardOnly = false,
      questionsPerDifficulty = 20
    } = options;
    
    console.log('🚀 Starting VALIDATED question generation for all countries...');
    
    try {
      // Get all countries from database
      const countries = await QuizService.getAllCountries();
      
      if (countries.length === 0) {
        console.log('❌ No countries found in database. Please populate countries first.');
        return;
      }
      
      console.log(`📊 Found ${countries.length} countries in database`);
      
      // Determine which difficulties to generate
      const difficulties: ('medium' | 'hard')[] = [];
      if (mediumOnly) difficulties.push('medium');
      if (hardOnly) difficulties.push('hard');
      if (!mediumOnly && !hardOnly) difficulties.push('medium', 'hard');
      
      console.log(`🎯 Generating VALIDATED ${difficulties.join(' and ')} questions...`);
      
      // Generate questions for each country and difficulty
      for (const country of countries) {
        for (const difficulty of difficulties) {
          console.log(`📝 Generating VALIDATED ${difficulty} questions for ${country.name}...`);
          
          const questions: any[] = [];
          
          for (let i = 0; i < questionsPerDifficulty; i++) {
            const monthRotation = (i % 12) + 1;
            
            const question = {
              id: `${country.id}-${difficulty}-${monthRotation}-${i}`,
              country_id: country.id,
              text: this.getQuestionTemplate(country.name, difficulty, i),
              option_a: this.getCorrectAnswer(country.name, difficulty, i),
              option_b: `Alternative answer for ${country.name} - ${difficulty}`,
              option_c: `Different option for ${country.name} - ${difficulty}`,
              option_d: `Another choice for ${country.name} - ${difficulty}`,
              correct_answer: this.getCorrectAnswer(country.name, difficulty, i),
              difficulty,
              category: this.getCategory(i),
              explanation: `This is a ${difficulty} level question about ${country.name}.`,
              month_rotation: monthRotation,
              ai_generated: false
            };
            
            questions.push(question);
          }
          
          // MANDATORY VALIDATION: Use QuestionService.saveQuestions which enforces validation
          console.log(`🔍 MANDATORY VALIDATION: Validating ${questions.length} ${difficulty} questions for ${country.name}...`);
          await QuestionService.saveQuestions(questions);
          console.log(`✅ Generated and VALIDATED ${questions.length} ${difficulty} questions for ${country.name}`);
        }
      }
      
      console.log('🎉 VALIDATED question generation completed successfully!');
      
    } catch (error) {
      console.error('❌ VALIDATED question generation failed:', error);
      throw error;
    }
  }
  
  private static getQuestionTemplate(countryName: string, difficulty: string, index: number): string {
    const templates = {
      medium: [
        `What is the main language spoken in ${countryName}?`,
        `What is ${countryName} famous for producing?`,
        `What is the climate like in ${countryName}?`,
        `What is the government type of ${countryName}?`,
        `What currency is used in ${countryName}?`
      ],
      hard: [
        `What is the GDP per capita of ${countryName}?`,
        `When did ${countryName} gain independence?`,
        `What is the literacy rate in ${countryName}?`,
        `What are the major exports of ${countryName}?`,
        `What is the life expectancy in ${countryName}?`
      ]
    };
    
    const categoryTemplates = templates[difficulty as keyof typeof templates] || templates.medium;
    return categoryTemplates[index % categoryTemplates.length];
  }

  private static getCorrectAnswer(countryName: string, difficulty: string, index: number): string {
    return `Correct answer for ${countryName} - ${difficulty} question ${index + 1}`;
  }

  private static getCategory(index: number): string {
    const categories = ['Geography', 'History', 'Culture', 'Economy', 'Nature'];
    return categories[index % categories.length];
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options: GenerationOptions = {};
  
  if (args.includes('--medium-only')) {
    options.mediumOnly = true;
  }
  
  if (args.includes('--hard-only')) {
    options.hardOnly = true;
  }
  
  const questionsArg = args.find(arg => arg.startsWith('--questions='));
  if (questionsArg) {
    options.questionsPerDifficulty = parseInt(questionsArg.split('=')[1]) || 20;
  }
  
  console.log('🌍 Globe Trotter Trivia - VALIDATED Question Generator');
  console.log('Options:', options);
  
  QuestionGenerator.generateAllQuestions(options)
    .then(() => {
      console.log('✅ VALIDATED generation complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ VALIDATED generation failed:', error);
      process.exit(1);
    });
}

export { QuestionGenerator };
