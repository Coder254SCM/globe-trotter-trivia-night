import { supabase } from "@/integrations/supabase/client";
import allCountries from "@/data/countries";
import { Question as FrontendQuestion } from "@/types/quiz";

export interface Country {
  id: string;
  name: string;
  capital: string;
  continent: string;
  population: number;
  area_km2: number;
  latitude: number;
  longitude: number;
  flag_url?: string;
  categories?: string[];
  difficulty?: string;
}

export interface Question {
  id: string;
  country_id: string;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  explanation?: string;
  month_rotation?: number;
  ai_generated?: boolean;
  image_url?: string;
}

export class QuizService {
  /**
   * Get all countries from Supabase
   */
  static async getAllCountries(): Promise<Country[]> {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching countries:', error);
        throw error;
      }

      console.log(`📊 Loaded ${data?.length || 0} countries from Supabase`);
      return data || [];
    } catch (error) {
      console.error('Failed to fetch countries from Supabase:', error);
      throw error;
    }
  }

  /**
   * Populate all 195 countries into Supabase
   */
  static async populateAllCountries(): Promise<void> {
    try {
      console.log(`🌍 Populating ${allCountries.length} countries...`);
      
      const countriesToInsert = allCountries.map(country => ({
        id: country.id,
        name: country.name,
        capital: country.capital,
        continent: country.continent,
        population: country.population,
        area_km2: country.area_km2,
        latitude: country.latitude,
        longitude: country.longitude,
        flag_url: country.flag_url,
        categories: country.categories || [],
        difficulty: country.difficulty || 'medium'
      }));

      const { error } = await supabase
        .from('countries')
        .upsert(countriesToInsert, { onConflict: 'id' });

      if (error) {
        console.error('Error populating countries:', error);
        throw error;
      }

      console.log(`✅ Successfully populated ${allCountries.length} countries`);
    } catch (error) {
      console.error('Failed to populate countries:', error);
      throw error;
    }
  }

  /**
   * Get questions for a specific country and difficulty
   */
  static async getQuestions(
    countryId: string, 
    difficulty?: string, 
    limit: number = 10
  ): Promise<FrontendQuestion[]> {
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('country_id', countryId);

      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }

      const { data, error } = await query
        .order('month_rotation')
        .limit(limit);

      if (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }

      // Transform Supabase questions to frontend format
      return (data || []).map(q => this.transformToFrontendQuestion(q));
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      throw error;
    }
  }

  /**
   * Transform Supabase question to frontend format
   */
  private static transformToFrontendQuestion(supabaseQuestion: any): FrontendQuestion {
    return {
      id: supabaseQuestion.id,
      type: 'multiple-choice',
      text: supabaseQuestion.text,
      imageUrl: supabaseQuestion.image_url,
      choices: [
        { id: 'a', text: supabaseQuestion.option_a, isCorrect: supabaseQuestion.correct_answer === supabaseQuestion.option_a },
        { id: 'b', text: supabaseQuestion.option_b, isCorrect: supabaseQuestion.correct_answer === supabaseQuestion.option_b },
        { id: 'c', text: supabaseQuestion.option_c, isCorrect: supabaseQuestion.correct_answer === supabaseQuestion.option_c },
        { id: 'd', text: supabaseQuestion.option_d, isCorrect: supabaseQuestion.correct_answer === supabaseQuestion.option_d }
      ],
      category: supabaseQuestion.category,
      explanation: supabaseQuestion.explanation || '',
      difficulty: supabaseQuestion.difficulty as 'easy' | 'medium' | 'hard'
    };
  }

  /**
   * Save questions to Supabase
   */
  static async saveQuestions(questions: any[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('questions')
        .upsert(questions, { onConflict: 'id' });

      if (error) {
        console.error('Error saving questions:', error);
        throw error;
      }

      console.log(`✅ Saved ${questions.length} questions to Supabase`);
    } catch (error) {
      console.error('Failed to save questions:', error);
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  static async getDatabaseStats(): Promise<any> {
    try {
      // Get country count
      const { count: countryCount } = await supabase
        .from('countries')
        .select('*', { count: 'exact', head: true });

      // Get question count
      const { count: questionCount } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

      // Get countries with questions
      const { data: countriesWithQuestions } = await supabase
        .from('questions')
        .select('country_id');

      // Get continents
      const { data: continentsData } = await supabase
        .from('countries')
        .select('continent');

      const continents = continentsData?.reduce((acc, item) => {
        acc[item.continent] = true;
        return acc;
      }, {} as Record<string, boolean>) || {};

      const stats = {
        totalCountries: countryCount || 0,
        totalQuestions: questionCount || 0,
        countriesWithQuestions: countriesWithQuestions?.length || 0,
        averageQuestionsPerCountry: countryCount ? Math.round((questionCount || 0) / countryCount * 10) / 10 : 0,
        continents
      };

      console.log('📊 Database Statistics:', stats);
      return stats;
    } catch (error) {
      console.error('Failed to get database stats:', error);
      throw error;
    }
  }

  /**
   * Get leaderboard data
   */
  static async getLeaderboard(period: string = 'all-time'): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('leaderboards')
        .select(`
          *,
          user_profiles (username)
        `)
        .eq('period', period)
        .order('rank')
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      return [];
    }
  }

  /**
   * Get failed questions for Ultimate Quiz
   */
  static async getFailedQuestions(userId: string): Promise<FrontendQuestion[]> {
    try {
      const { data, error } = await supabase
        .from('failed_questions')
        .select(`
          questions (*)
        `)
        .eq('user_id', userId)
        .eq('mastered', false);

      if (error) {
        console.error('Error fetching failed questions:', error);
        throw error;
      }

      // Transform to frontend format
      return (data || []).map((item: any) => this.transformToFrontendQuestion(item.questions));
    } catch (error) {
      console.error('Failed to fetch failed questions:', error);
      return [];
    }
  }

  /**
   * Generate questions for all countries using templates
   */
  static async generateQuestionsForAllCountries(questionsPerDifficulty: number = 20): Promise<void> {
    try {
      const countries = await this.getAllCountries();
      console.log(`🚀 Generating questions for ${countries.length} countries...`);

      for (const country of countries) {
        await this.generateQuestionsForCountry(country, questionsPerDifficulty);
      }

      console.log('✅ Question generation completed for all countries');
    } catch (error) {
      console.error('Failed to generate questions for all countries:', error);
      throw error;
    }
  }

  /**
   * Generate questions for a specific country
   */
  static async generateQuestionsForCountry(
    country: Country, 
    questionsPerDifficulty: number = 20
  ): Promise<void> {
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    
    for (const difficulty of difficulties) {
      const questions: any[] = [];
      
      for (let i = 0; i < questionsPerDifficulty; i++) {
        const monthRotation = (i % 12) + 1;
        
        const question = {
          id: `${country.id}-${difficulty}-${monthRotation}-${i}`,
          country_id: country.id,
          text: this.getQuestionTemplate(country, difficulty, i),
          option_a: this.getCorrectAnswer(country, difficulty, i),
          option_b: `Option B for ${country.name}`,
          option_c: `Option C for ${country.name}`,
          option_d: `Option D for ${country.name}`,
          correct_answer: this.getCorrectAnswer(country, difficulty, i),
          difficulty,
          category: this.getCategory(i),
          explanation: `This is a ${difficulty} level question about ${country.name}.`,
          month_rotation: monthRotation,
          ai_generated: false
        };
        
        questions.push(question);
      }
      
      await this.saveQuestions(questions);
    }
  }

  private static getQuestionTemplate(country: Country, difficulty: string, index: number): string {
    const templates = {
      easy: [
        `What is the capital of ${country.name}?`,
        `Which continent is ${country.name} located in?`,
        `What is the approximate population of ${country.name}?`,
        `What is the total area of ${country.name}?`,
        `What flag represents ${country.name}?`
      ],
      medium: [
        `What is the main language spoken in ${country.name}?`,
        `What is ${country.name} famous for producing?`,
        `What is the climate like in ${country.name}?`,
        `What is the government type of ${country.name}?`,
        `What currency is used in ${country.name}?`
      ],
      hard: [
        `What is the GDP per capita of ${country.name}?`,
        `When did ${country.name} gain independence?`,
        `What is the literacy rate in ${country.name}?`,
        `What are the major exports of ${country.name}?`,
        `What is the life expectancy in ${country.name}?`
      ]
    };
    
    const categoryTemplates = templates[difficulty as keyof typeof templates] || templates.easy;
    return categoryTemplates[index % categoryTemplates.length];
  }

  private static getCorrectAnswer(country: Country, difficulty: string, index: number): string {
    if (difficulty === 'easy') {
      const answers = [
        country.capital,
        country.continent,
        `About ${Math.round(country.population / 1000000)} million`,
        `${country.area_km2.toLocaleString()} km²`,
        `Flag of ${country.name}`
      ];
      return answers[index % answers.length];
    }
    
    return `Correct answer for ${country.name}`;
  }

  private static getCategory(index: number): string {
    const categories = ['Geography', 'History', 'Culture', 'Economy', 'Nature'];
    return categories[index % categories.length];
  }
}
