
import { Question } from "@/types/quiz";
import { Country } from "./supabase/country/countryTypes";
import { QuestionService } from "./supabase/questionService";

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Comprehensive data for generating real questions
const CAPITAL_ALTERNATIVES = ["London", "Paris", "Berlin", "Tokyo", "Madrid", "Rome", "Moscow", "Cairo", "Delhi", "Beijing"];
const CONTINENT_ALTERNATIVES = ["Asia", "Africa", "Europe", "North America", "South America", "Oceania"];
const LANGUAGE_OPTIONS = ["English", "Spanish", "French", "German", "Portuguese", "Arabic", "Mandarin", "Russian"];
const CURRENCY_OPTIONS = ["Dollar", "Euro", "Pound", "Yen", "Peso", "Franc", "Mark", "Ruble"];
const RELIGION_OPTIONS = ["Christianity", "Islam", "Buddhism", "Hinduism", "Judaism", "Traditional beliefs"];

export class TemplateQuestionService {
  public static async generateQuestions(
    country: Country,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number,
    category: string
  ): Promise<void> {
    console.log(`🔧 Generating ${count} ${difficulty} questions for ${country.name} in category ${category}`);
    
    const questions = this.buildValidQuestions(country, difficulty, count, category);

    if (questions.length > 0) {
      console.log(`👉 Generated ${questions.length} valid questions for ${country.name}:`);
      questions.forEach(q => {
        console.log(`- ${q.text.substring(0, 60)}... [${q.category}, ${q.difficulty}]`);
      });
      await this.saveQuestionsToSupabase(questions, country, difficulty);
    } else {
      console.log(`❌ No valid questions generated for ${country.name} (${difficulty}, ${category})`);
    }
  }

  private static buildValidQuestions(
    country: Country,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number,
    category: string
  ): Question[] {
    const questions: Question[] = [];
    const maxAttempts = count * 3; // Allow multiple attempts per desired question

    for (let attempt = 0; attempt < maxAttempts && questions.length < count; attempt++) {
      const questionData = this.generateSingleQuestion(country, difficulty, category, attempt);
      
      if (questionData && this.isValidQuestion(questionData)) {
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

  private static generateSingleQuestion(
    country: Country,
    difficulty: 'easy' | 'medium' | 'hard',
    category: string,
    seed: number
  ) {
    if (category.toLowerCase() === 'geography') {
      return this.generateGeographyQuestion(country, difficulty, seed);
    } else if (category.toLowerCase() === 'culture') {
      return this.generateCultureQuestion(country, difficulty, seed);
    }
    return null;
  }

  private static generateGeographyQuestion(country: Country, difficulty: string, seed: number) {
    const questionTypes = [];

    // Capital question - only if country has a capital
    if (country.capital && country.capital.length > 2) {
      questionTypes.push(() => ({
        text: `What is the capital city of ${country.name}?`,
        correct: country.capital,
        options: this.getUniqueOptions(country.capital, CAPITAL_ALTERNATIVES),
        explanation: `${country.capital} is the capital city of ${country.name}.`
      }));
    }

    // Continent question
    if (country.continent && country.continent.length > 3) {
      questionTypes.push(() => ({
        text: `On which continent is ${country.name} located?`,
        correct: country.continent,
        options: this.getUniqueOptions(country.continent, CONTINENT_ALTERNATIVES),
        explanation: `${country.name} is located on the continent of ${country.continent}.`
      }));
    }

    // Population question for medium/hard
    if ((difficulty === 'medium' || difficulty === 'hard') && country.population && country.population > 1000000) {
      const populationMillion = Math.round(country.population / 1000000);
      questionTypes.push(() => ({
        text: `What is the approximate population of ${country.name}?`,
        correct: `${populationMillion} million people`,
        options: [
          `${populationMillion} million people`,
          `${Math.round(populationMillion * 1.5)} million people`,
          `${Math.round(populationMillion * 0.7)} million people`,
          `${Math.round(populationMillion * 2)} million people`
        ],
        explanation: `${country.name} has approximately ${populationMillion} million people.`
      }));
    }

    // Area question for hard difficulty
    if (difficulty === 'hard' && country.area_km2 && country.area_km2 > 1000) {
      const areaThousands = Math.round(country.area_km2 / 1000);
      questionTypes.push(() => ({
        text: `What is the approximate land area of ${country.name}?`,
        correct: `${areaThousands},000 square kilometers`,
        options: [
          `${areaThousands},000 square kilometers`,
          `${Math.round(areaThousands * 1.3)},000 square kilometers`,
          `${Math.round(areaThousands * 0.8)},000 square kilometers`,
          `${Math.round(areaThousands * 1.6)},000 square kilometers`
        ],
        explanation: `${country.name} covers approximately ${areaThousands},000 square kilometers.`
      }));
    }

    if (questionTypes.length === 0) return null;

    const selectedType = questionTypes[seed % questionTypes.length];
    return selectedType();
  }

  private static generateCultureQuestion(country: Country, difficulty: string, seed: number) {
    const questionTypes = [
      () => ({
        text: `Which of these cultural aspects is most commonly associated with ${country.name}?`,
        correct: `Traditional festivals and celebrations`,
        options: [
          `Traditional festivals and celebrations`,
          `Ancient pyramid architecture`,
          `Viking heritage sites`,
          `Samurai warrior traditions`
        ],
        explanation: `Like many countries, ${country.name} has rich cultural traditions including festivals and celebrations.`
      }),
      () => ({
        text: `What type of cultural influence has most shaped ${country.name}?`,
        correct: `Regional neighboring countries`,
        options: [
          `Regional neighboring countries`,
          `Ancient Roman empire`,
          `Medieval Viking raids`,
          `Colonial Portuguese traders`
        ],
        explanation: `${country.name} has been primarily influenced by its regional neighbors and geographic location.`
      }),
      () => ({
        text: `Which statement best describes the cultural diversity of ${country.name}?`,
        correct: `Reflects the geographic region of ${country.continent}`,
        options: [
          `Reflects the geographic region of ${country.continent}`,
          `Exclusively based on ancient Egyptian traditions`,
          `Purely influenced by Nordic customs`,
          `Only follows medieval European practices`
        ],
        explanation: `The culture of ${country.name} reflects its location in ${country.continent}.`
      })
    ];

    const selectedType = questionTypes[seed % questionTypes.length];
    return selectedType();
  }

  private static getUniqueOptions(correct: string, alternatives: string[]): string[] {
    const options = [correct];
    const filtered = alternatives.filter(alt => alt !== correct);
    
    while (options.length < 4 && filtered.length > 0) {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      options.push(filtered.splice(randomIndex, 1)[0]);
    }
    
    // Fill remaining slots if needed
    while (options.length < 4) {
      options.push(`Alternative option ${options.length}`);
    }
    
    return shuffle(options);
  }

  private static isValidQuestion(questionData: any): boolean {
    if (!questionData || !questionData.text || questionData.text.length < 20) return false;
    if (!questionData.options || questionData.options.length !== 4) return false;
    if (!questionData.correct || !questionData.options.includes(questionData.correct)) return false;
    
    // Check for unique options
    const uniqueOptions = new Set(questionData.options);
    if (uniqueOptions.size !== 4) return false;
    
    // Check for placeholder patterns
    const placeholderPatterns = [
      'correct answer for', 'option a for', 'option b for', 'option c for', 'option d for',
      'placeholder', 'methodology', 'approach', 'technique', 'method'
    ];
    
    const allText = [questionData.text, ...questionData.options].join(' ').toLowerCase();
    for (const pattern of placeholderPatterns) {
      if (allText.includes(pattern)) return false;
    }
    
    return true;
  }

  private static async saveQuestionsToSupabase(
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
}
