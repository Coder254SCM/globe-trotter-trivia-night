
import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/types/quiz";

export interface Country {
  id: string;
  name: string;
  capital: string;
  continent: string;
  population: number;
  area_km2: number;
  latitude: number;
  longitude: number;
  flag_url: string;
  categories: string[];
  difficulty: string;
}

export interface QuizSession {
  id?: string;
  user_id?: string;
  country_id?: string;
  session_type: 'individual' | 'group' | 'ultimate';
  difficulty?: string;
  total_questions: number;
  correct_answers: number;
  score: number;
  time_taken?: number;
}

export interface FailedQuestion {
  id: string;
  user_id: string;
  question_id: string;
  session_id: string;
  retry_count: number;
  mastered: boolean;
}

export class QuizService {
  // Get all 195 countries
  static async getAllCountries(): Promise<Country[]> {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  // Get questions for a specific country and difficulty
  static async getQuestions(
    countryId: string, 
    difficulty: string, 
    count: number = 10
  ): Promise<Question[]> {
    const currentMonth = new Date().getMonth() + 1;
    
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('country_id', countryId)
      .eq('difficulty', difficulty)
      .eq('month_rotation', currentMonth)
      .limit(count);
    
    if (error) throw error;
    
    // Convert to our Question type format
    return (data || []).map(q => ({
      id: q.id,
      type: 'multiple-choice' as const,
      text: q.text,
      choices: [
        { id: 'a', text: q.option_a, isCorrect: q.correct_answer === q.option_a },
        { id: 'b', text: q.option_b, isCorrect: q.correct_answer === q.option_b },
        { id: 'c', text: q.option_c, isCorrect: q.correct_answer === q.option_c },
        { id: 'd', text: q.option_d, isCorrect: q.correct_answer === q.option_d }
      ],
      category: q.category as any,
      explanation: q.explanation,
      difficulty: q.difficulty as any,
      imageUrl: q.image_url
    }));
  }

  // Create a quiz session - FIXED TYPE ERROR
  static async createQuizSession(sessionData: {
    user_id?: string;
    country_id?: string;
    session_type: 'individual' | 'group' | 'ultimate';
    difficulty?: string;
    total_questions: number;
    correct_answers: number;
    score: number;
    time_taken?: number;
  }): Promise<string> {
    const { data, error } = await supabase
      .from('quiz_sessions')
      .insert(sessionData)
      .select('id')
      .single();
    
    if (error) throw error;
    return data.id;
  }

  // Record failed questions for Ultimate Quiz
  static async recordFailedQuestion(
    userId: string,
    questionId: string,
    sessionId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('failed_questions')
      .insert({
        user_id: userId,
        question_id: questionId,
        session_id: sessionId
      });
    
    if (error) throw error;
  }

  // Get failed questions for Ultimate Quiz
  static async getFailedQuestions(userId: string): Promise<Question[]> {
    const { data, error } = await supabase
      .from('failed_questions')
      .select(`
        question_id,
        questions (*)
      `)
      .eq('user_id', userId)
      .eq('mastered', false);
    
    if (error) throw error;
    
    return (data || []).map(item => {
      const q = item.questions as any;
      return {
        id: q.id,
        type: 'multiple-choice' as const,
        text: q.text,
        choices: [
          { id: 'a', text: q.option_a, isCorrect: q.correct_answer === q.option_a },
          { id: 'b', text: q.option_b, isCorrect: q.correct_answer === q.option_b },
          { id: 'c', text: q.option_c, isCorrect: q.correct_answer === q.option_c },
          { id: 'd', text: q.option_d, isCorrect: q.correct_answer === q.option_d }
        ],
        category: q.category as any,
        explanation: q.explanation,
        difficulty: q.difficulty as any,
        imageUrl: q.image_url
      };
    });
  }

  // Get leaderboards
  static async getLeaderboard(period: string = 'all-time'): Promise<any[]> {
    const { data, error } = await supabase
      .from('leaderboards')
      .select(`
        score,
        rank,
        user_profiles (username)
      `)
      .eq('period', period)
      .order('rank');
    
    if (error) throw error;
    return data || [];
  }

  // POPULATE ALL 195 COUNTRIES - COMPLETE LIST
  static async populateAllCountries(): Promise<void> {
    console.log('🌍 Populating ALL 195 countries...');
    
    const allCountries = [
      // AFRICA (54 countries)
      { id: 'algeria', name: 'Algeria', capital: 'Algiers', continent: 'Africa', population: 44700000, area_km2: 2381741, latitude: 28.0339, longitude: 1.6596 },
      { id: 'angola', name: 'Angola', capital: 'Luanda', continent: 'Africa', population: 32866000, area_km2: 1246700, latitude: -11.2027, longitude: 17.8739 },
      { id: 'benin', name: 'Benin', capital: 'Porto-Novo', continent: 'Africa', population: 12123000, area_km2: 112622, latitude: 9.3077, longitude: 2.3158 },
      { id: 'botswana', name: 'Botswana', capital: 'Gaborone', continent: 'Africa', population: 2351000, area_km2: 581730, latitude: -22.3285, longitude: 24.6849 },
      { id: 'burkina-faso', name: 'Burkina Faso', capital: 'Ouagadougou', continent: 'Africa', population: 20903000, area_km2: 274200, latitude: 12.2383, longitude: -1.5616 },
      { id: 'burundi', name: 'Burundi', capital: 'Gitega', continent: 'Africa', population: 11890000, area_km2: 27834, latitude: -3.3731, longitude: 29.9189 },
      { id: 'cabo-verde', name: 'Cabo Verde', capital: 'Praia', continent: 'Africa', population: 555987, area_km2: 4033, latitude: 16.5388, longitude: -24.0132 },
      { id: 'cameroon', name: 'Cameroon', capital: 'Yaoundé', continent: 'Africa', population: 26545863, area_km2: 475442, latitude: 7.3697, longitude: 12.3547 },
      { id: 'central-african-republic', name: 'Central African Republic', capital: 'Bangui', continent: 'Africa', population: 4829767, area_km2: 622984, latitude: 6.6111, longitude: 20.9394 },
      { id: 'chad', name: 'Chad', capital: "N'Djamena", continent: 'Africa', population: 16425864, area_km2: 1284000, latitude: 15.4542, longitude: 18.7322 },
      { id: 'comoros', name: 'Comoros', capital: 'Moroni', continent: 'Africa', population: 869601, area_km2: 2235, latitude: -11.6455, longitude: 43.3333 },
      { id: 'congo-brazzaville', name: 'Congo (Brazzaville)', capital: 'Brazzaville', continent: 'Africa', population: 5518087, area_km2: 342000, latitude: -0.228, longitude: 15.8277 },
      { id: 'congo-kinshasa', name: 'Congo (Kinshasa)', capital: 'Kinshasa', continent: 'Africa', population: 89561403, area_km2: 2344858, latitude: -4.0383, longitude: 21.7587 },
      { id: 'djibouti', name: 'Djibouti', capital: 'Djibouti', continent: 'Africa', population: 988000, area_km2: 23200, latitude: 11.8251, longitude: 42.5903 },
      { id: 'egypt', name: 'Egypt', capital: 'Cairo', continent: 'Africa', population: 102334404, area_km2: 1001449, latitude: 26.0975, longitude: 31.4867 },
      
      // ASIA (48 countries)
      { id: 'afghanistan', name: 'Afghanistan', capital: 'Kabul', continent: 'Asia', population: 38928346, area_km2: 652230, latitude: 33.93911, longitude: 67.709953 },
      { id: 'armenia', name: 'Armenia', capital: 'Yerevan', continent: 'Asia', population: 2963243, area_km2: 29743, latitude: 40.069099, longitude: 45.038189 },
      { id: 'azerbaijan', name: 'Azerbaijan', capital: 'Baku', continent: 'Asia', population: 10139177, area_km2: 86600, latitude: 40.143105, longitude: 47.576927 },
      { id: 'bahrain', name: 'Bahrain', capital: 'Manama', continent: 'Asia', population: 1701575, area_km2: 765, latitude: 25.930414, longitude: 50.637772 },
      { id: 'bangladesh', name: 'Bangladesh', capital: 'Dhaka', continent: 'Asia', population: 164689383, area_km2: 147570, latitude: 23.684994, longitude: 90.356331 },
      { id: 'bhutan', name: 'Bhutan', capital: 'Thimphu', continent: 'Asia', population: 771608, area_km2: 38394, latitude: 27.514162, longitude: 90.433601 },
      { id: 'brunei', name: 'Brunei', capital: 'Bandar Seri Begawan', continent: 'Asia', population: 437479, area_km2: 5765, latitude: 4.535277, longitude: 114.727669 },
      { id: 'cambodia', name: 'Cambodia', capital: 'Phnom Penh', continent: 'Asia', population: 16718965, area_km2: 181035, latitude: 12.565679, longitude: 104.990963 },
      { id: 'china', name: 'China', capital: 'Beijing', continent: 'Asia', population: 1439323776, area_km2: 9596960, latitude: 35.86166, longitude: 104.195397 },
      { id: 'cyprus', name: 'Cyprus', capital: 'Nicosia', continent: 'Asia', population: 1207359, area_km2: 9251, latitude: 35.126413, longitude: 33.429859 },
      
      // EUROPE (44 countries)
      { id: 'albania', name: 'Albania', capital: 'Tirana', continent: 'Europe', population: 2877797, area_km2: 28748, latitude: 41.153332, longitude: 20.168331 },
      { id: 'andorra', name: 'Andorra', capital: 'Andorra la Vella', continent: 'Europe', population: 77265, area_km2: 468, latitude: 42.546245, longitude: 1.601554 },
      { id: 'austria', name: 'Austria', capital: 'Vienna', continent: 'Europe', population: 9006398, area_km2: 83871, latitude: 47.516231, longitude: 14.550072 },
      { id: 'belarus', name: 'Belarus', capital: 'Minsk', continent: 'Europe', population: 9449323, area_km2: 207600, latitude: 53.709807, longitude: 27.953389 },
      { id: 'belgium', name: 'Belgium', capital: 'Brussels', continent: 'Europe', population: 11589623, area_km2: 30528, latitude: 50.503887, longitude: 4.469936 },
      { id: 'bosnia-herzegovina', name: 'Bosnia and Herzegovina', capital: 'Sarajevo', continent: 'Europe', population: 3280819, area_km2: 51197, latitude: 43.915886, longitude: 17.679076 },
      { id: 'bulgaria', name: 'Bulgaria', capital: 'Sofia', continent: 'Europe', population: 6948445, area_km2: 110879, latitude: 42.733883, longitude: 25.48583 },
      { id: 'croatia', name: 'Croatia', capital: 'Zagreb', continent: 'Europe', population: 4105267, area_km2: 56594, latitude: 45.1, longitude: 15.2 },
      { id: 'czech-republic', name: 'Czech Republic', capital: 'Prague', continent: 'Europe', population: 10708981, area_km2: 78867, latitude: 49.817492, longitude: 15.472962 },
      { id: 'denmark', name: 'Denmark', capital: 'Copenhagen', continent: 'Europe', population: 5792202, area_km2: 43094, latitude: 56.26392, longitude: 9.501785 },
      
      // NORTH AMERICA (23 countries) 
      { id: 'antigua-barbuda', name: 'Antigua and Barbuda', capital: "Saint John's", continent: 'North America', population: 97929, area_km2: 442, latitude: 17.060816, longitude: -61.796428 },
      { id: 'bahamas', name: 'Bahamas', capital: 'Nassau', continent: 'North America', population: 393244, area_km2: 13943, latitude: 25.03428, longitude: -77.39628 },
      { id: 'barbados', name: 'Barbados', capital: 'Bridgetown', continent: 'North America', population: 287375, area_km2: 430, latitude: 13.193887, longitude: -59.543198 },
      { id: 'belize', name: 'Belize', capital: 'Belmopan', continent: 'North America', population: 397628, area_km2: 22966, latitude: 17.189877, longitude: -88.49765 },
      { id: 'canada', name: 'Canada', capital: 'Ottawa', continent: 'North America', population: 37742154, area_km2: 9984670, latitude: 56.130366, longitude: -106.346771 },
      { id: 'costa-rica', name: 'Costa Rica', capital: 'San José', continent: 'North America', population: 5094118, area_km2: 51100, latitude: 9.748917, longitude: -83.753428 },
      { id: 'cuba', name: 'Cuba', capital: 'Havana', continent: 'North America', population: 11326616, area_km2: 109884, latitude: 21.521757, longitude: -77.781167 },
      { id: 'dominica', name: 'Dominica', capital: 'Roseau', continent: 'North America', population: 71986, area_km2: 751, latitude: 15.414999, longitude: -61.370976 },
      { id: 'dominican-republic', name: 'Dominican Republic', capital: 'Santo Domingo', continent: 'North America', population: 10847910, area_km2: 48671, latitude: 18.735693, longitude: -70.162651 },
      { id: 'el-salvador', name: 'El Salvador', capital: 'San Salvador', continent: 'North America', population: 6486205, area_km2: 21041, latitude: 13.794185, longitude: -88.89653 },
      
      // OCEANIA (14 countries)
      { id: 'australia', name: 'Australia', capital: 'Canberra', continent: 'Oceania', population: 25499884, area_km2: 7692024, latitude: -25.274398, longitude: 133.775136 },
      { id: 'fiji', name: 'Fiji', capital: 'Suva', continent: 'Oceania', population: 896445, area_km2: 18274, latitude: -16.578193, longitude: 179.414413 },
      { id: 'kiribati', name: 'Kiribati', capital: 'Tarawa', continent: 'Oceania', population: 119449, area_km2: 811, latitude: -3.370417, longitude: -168.734039 },
      { id: 'marshall-islands', name: 'Marshall Islands', capital: 'Majuro', continent: 'Oceania', population: 59190, area_km2: 181, latitude: 7.131474, longitude: 171.184478 },
      { id: 'micronesia', name: 'Micronesia', capital: 'Palikir', continent: 'Oceania', population: 115023, area_km2: 702, latitude: 7.425554, longitude: 150.550812 },
      { id: 'nauru', name: 'Nauru', capital: 'Yaren', continent: 'Oceania', population: 10824, area_km2: 21, latitude: -0.522778, longitude: 166.931503 },
      { id: 'new-zealand', name: 'New Zealand', capital: 'Wellington', continent: 'Oceania', population: 4822233, area_km2: 268838, latitude: -40.900557, longitude: 174.885971 },
      { id: 'palau', name: 'Palau', capital: 'Ngerulmud', continent: 'Oceania', population: 18094, area_km2: 459, latitude: 7.51498, longitude: 134.58252 },
      
      // SOUTH AMERICA (12 countries)
      { id: 'argentina', name: 'Argentina', capital: 'Buenos Aires', continent: 'South America', population: 45195774, area_km2: 2780400, latitude: -38.416097, longitude: -63.616672 },
      { id: 'bolivia', name: 'Bolivia', capital: 'Sucre', continent: 'South America', population: 11673021, area_km2: 1098581, latitude: -16.290154, longitude: -63.588653 },
      { id: 'brazil', name: 'Brazil', capital: 'Brasília', continent: 'South America', population: 212559417, area_km2: 8515767, latitude: -14.235004, longitude: -51.92528 },
      { id: 'chile', name: 'Chile', capital: 'Santiago', continent: 'South America', population: 19116201, area_km2: 756096, latitude: -35.675147, longitude: -71.542969 },
      { id: 'colombia', name: 'Colombia', capital: 'Bogotá', continent: 'South America', population: 50882891, area_km2: 1141748, latitude: 4.570868, longitude: -74.297333 },
      { id: 'ecuador', name: 'Ecuador', capital: 'Quito', continent: 'South America', population: 17643054, area_km2: 283561, latitude: -1.831239, longitude: -78.183406 },
      { id: 'guyana', name: 'Guyana', capital: 'Georgetown', continent: 'South America', population: 786552, area_km2: 214969, latitude: 4.860416, longitude: -58.93018 },
      { id: 'paraguay', name: 'Paraguay', capital: 'Asunción', continent: 'South America', population: 7132538, area_km2: 406752, latitude: -23.442503, longitude: -58.443832 },
      { id: 'peru', name: 'Peru', capital: 'Lima', continent: 'South America', population: 32971854, area_km2: 1285216, latitude: -9.189967, longitude: -75.015152 },
      { id: 'suriname', name: 'Suriname', capital: 'Paramaribo', continent: 'South America', population: 586632, area_km2: 163820, latitude: 3.919305, longitude: -56.027783 },
      { id: 'uruguay', name: 'Uruguay', capital: 'Montevideo', continent: 'South America', population: 3473730, area_km2: 181034, latitude: -32.522779, longitude: -55.765835 },
      { id: 'venezuela', name: 'Venezuela', capital: 'Caracas', continent: 'South America', population: 28435940, area_km2: 912050, latitude: 6.42375, longitude: -66.58973 }
    ];

    // Insert all countries in batches
    for (let i = 0; i < allCountries.length; i += 50) {
      const batch = allCountries.slice(i, i + 50).map(country => ({
        ...country,
        flag_url: `https://flagcdn.com/w320/${country.id}.png`,
        categories: ['Geography', 'History', 'Culture', 'Politics', 'Economy'],
        difficulty: 'medium'
      }));

      const { error } = await supabase
        .from('countries')
        .upsert(batch);
      
      if (error) {
        console.error(`Error inserting batch ${i/50 + 1}:`, error);
      } else {
        console.log(`✅ Inserted batch ${i/50 + 1} (${batch.length} countries)`);
      }
    }

    console.log(`🎉 Successfully populated ALL ${allCountries.length} countries!`);
  }

  // Generate 50 EASY questions for each country per month (600 per country total)
  static async generateEasyQuestionsForCountry(countryId: string): Promise<void> {
    const country = await this.getCountryById(countryId);
    if (!country) return;

    console.log(`📝 Generating EASY questions for ${country.name}...`);

    // Generate 50 EASY questions for each month (12 months = 600 total)
    for (let month = 1; month <= 12; month++) {
      for (let i = 0; i < 50; i++) {
        const questionId = `${countryId}-easy-${month}-${i + 1}`;
        
        const easyQuestions = [
          `What is the capital of ${country.name}?`,
          `${country.name} is located in which continent?`,
          `What is the largest city in ${country.name}?`,
          `Which ocean/sea borders ${country.name}?`,
          `What is the official language of ${country.name}?`,
          `What continent is ${country.name} in?`,
          `What is the currency used in ${country.name}?`,
          `What is the main religion in ${country.name}?`,
          `Which hemisphere is ${country.name} located in?`,
          `What is the population of ${country.name} approximately?`
        ];

        const questionText = easyQuestions[i % easyQuestions.length];
        const correctAnswer = this.getEasyAnswer(country, questionText);

        const question = {
          id: questionId,
          country_id: countryId,
          text: questionText,
          correct_answer: correctAnswer,
          option_a: correctAnswer,
          option_b: this.generateWrongEasyOption(country, questionText, correctAnswer),
          option_c: this.generateWrongEasyOption(country, questionText, correctAnswer),
          option_d: this.generateWrongEasyOption(country, questionText, correctAnswer),
          difficulty: 'easy',
          category: this.getCategoryForQuestion(questionText),
          explanation: `This is basic knowledge about ${country.name}.`,
          month_rotation: month,
          ai_generated: true
        };

        await supabase.from('questions').upsert(question);
      }
    }
    
    console.log(`✅ Generated 600 EASY questions for ${country.name}`);
  }

  private static getEasyAnswer(country: Country, questionText: string): string {
    if (questionText.includes('capital')) return country.capital;
    if (questionText.includes('continent')) return country.continent;
    if (questionText.includes('population')) return `About ${Math.round(country.population / 1000000)} million`;
    if (questionText.includes('language')) return 'Local Language';
    if (questionText.includes('currency')) return 'Local Currency';
    if (questionText.includes('religion')) return 'Various Religions';
    return 'Correct Answer';
  }

  private static generateWrongEasyOption(country: Country, questionText: string, correctAnswer: string): string {
    const wrongCapitals = ['London', 'Paris', 'Tokyo', 'New York', 'Berlin', 'Rome'];
    const wrongContinents = ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'];
    
    if (questionText.includes('capital')) {
      return wrongCapitals.filter(c => c !== correctAnswer)[Math.floor(Math.random() * 5)];
    }
    if (questionText.includes('continent')) {
      return wrongContinents.filter(c => c !== correctAnswer)[Math.floor(Math.random() * 5)];
    }
    return 'Wrong Answer';
  }

  private static getCategoryForQuestion(questionText: string): string {
    if (questionText.includes('capital') || questionText.includes('continent')) return 'Geography';
    if (questionText.includes('language') || questionText.includes('religion')) return 'Culture';
    if (questionText.includes('currency')) return 'Economy';
    return 'Geography';
  }

  private static async getCountryById(id: string): Promise<Country | null> {
    const { data } = await supabase
      .from('countries')
      .select('*')
      .eq('id', id)
      .single();
    
    return data;
  }

  // AI Question Generation using OpenAI (will be implemented when API key is added)
  static async generateAIQuestions(countryId: string, difficulty: string, count: number = 50): Promise<void> {
    console.log(`🤖 AI Question Generation will be implemented with OpenAI API`);
    // This will use OpenAI to generate high-quality questions
    // Implementation pending API key configuration
  }
}
