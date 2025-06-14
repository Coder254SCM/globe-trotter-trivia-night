
import { supabase } from "@/integrations/supabase/client";
import { Question as FrontendQuestion } from "@/types/quiz";
import { Question, QuestionFilter } from "./questionTypes";

export class QuestionFetcher {
  /**
   * Enhanced validation patterns to catch bad questions
   */
  private static readonly INVALID_PATTERNS = [
    // Placeholder patterns
    'placeholder',
    '[country]',
    '[capital]',
    'option a for',
    'option b for', 
    'option c for',
    'option d for',
    'correct answer for',
    'incorrect option',
    
    // Generic AI patterns that don't make sense
    'quantum physics',
    'advanced methodology',
    'cutting-edge approach',
    'innovative technique',
    'state-of-the-art method',
    'methodology a',
    'methodology b',
    'methodology c', 
    'methodology d',
    'approach a',
    'approach b',
    'approach c',
    'approach d',
    'technique a',
    'technique b',
    'technique c',
    'technique d',
    'method a',
    'method b',
    'method c',
    'method d',
    
    // Other nonsensical patterns
    'specialized parameters',
    'novel framework',
    'enhanced precision',
    'optimized protocols'
  ];

  /**
   * Geographic context mapping for better validation
   */
  private static readonly GEOGRAPHIC_CONTEXTS = {
    'africa': ['ouagadougou', 'cairo', 'lagos', 'nairobi', 'cape town', 'accra', 'dakar', 'addis ababa', 'khartoum', 'kampala'],
    'asia': ['beijing', 'tokyo', 'delhi', 'bangkok', 'jakarta', 'manila', 'seoul', 'kuala lumpur', 'singapore', 'dhaka'],
    'europe': ['london', 'paris', 'berlin', 'rome', 'madrid', 'warsaw', 'vienna', 'athens', 'oslo', 'stockholm'],
    'north_america': ['washington', 'ottawa', 'mexico city', 'havana', 'guatemala city', 'san jose', 'panama city'],
    'south_america': ['brasilia', 'buenos aires', 'lima', 'santiago', 'bogota', 'caracas', 'quito', 'asuncion'],
    'oceania': ['canberra', 'wellington', 'suva', 'port moresby', 'apia', 'nuku\'alofa']
  };

  /**
   * US cities that shouldn't appear in non-US questions
   */
  private static readonly US_CITIES = [
    'new york', 'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia', 
    'san antonio', 'san diego', 'dallas', 'san jose', 'austin', 'jacksonville',
    'fort worth', 'columbus', 'charlotte', 'san francisco', 'indianapolis', 
    'seattle', 'denver', 'washington dc', 'boston', 'el paso', 'detroit', 
    'nashville', 'portland', 'memphis', 'oklahoma city', 'las vegas', 'louisville',
    'baltimore', 'milwaukee', 'albuquerque', 'tucson', 'fresno', 'mesa', 'sacramento',
    'atlanta', 'kansas city', 'colorado springs', 'omaha', 'raleigh', 'miami', 'oakland',
    'minneapolis', 'tulsa', 'cleveland', 'wichita', 'arlington'
  ];

  /**
   * Get questions for a specific country with filtering and validation
   */
  static async getQuestions(
    countryId: string, 
    difficulty?: string, 
    limit: number = 10
  ): Promise<FrontendQuestion[]> {
    try {
      console.log(`🔍 Fetching questions for country: ${countryId}, difficulty: ${difficulty}, limit: ${limit}`);
      
      let query = supabase
        .from('questions')
        .select('*')
        .eq('country_id', countryId);

      // Apply difficulty filter if specified
      if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
        query = query.eq('difficulty', difficulty);
        console.log(`🎯 Filtering by difficulty: ${difficulty}`);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit * 5); // Get more questions to filter out bad ones

      if (error) {
        console.error('❌ Error fetching questions:', error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} raw questions`);
      
      if (!data || data.length === 0) {
        console.warn(`⚠️ No questions found for country ${countryId} with difficulty ${difficulty}`);
        return [];
      }

      // Transform and validate all questions with enhanced filtering
      const transformedQuestions = data
        .map(q => this.transformToFrontendQuestion(q))
        .filter(q => this.validateQuestion(q, countryId))
        .slice(0, limit); // Take only the requested number after filtering
      
      console.log(`✅ Successfully transformed and validated ${transformedQuestions.length} questions out of ${data.length} raw questions`);
      
      return transformedQuestions;
    } catch (error) {
      console.error('💥 Failed to fetch questions:', error);
      throw error;
    }
  }

  /**
   * Enhanced validation with stricter quality checks and geographic context
   */
  static validateQuestion(question: FrontendQuestion, countryId?: string): boolean {
    // Check for invalid patterns in question text
    const questionText = question.text.toLowerCase();
    for (const pattern of this.INVALID_PATTERNS) {
      if (questionText.includes(pattern.toLowerCase())) {
        console.warn('❌ Question contains invalid pattern:', pattern, 'in:', question.text.substring(0, 50));
        return false;
      }
    }

    // Check for invalid patterns in choices
    for (const choice of question.choices) {
      const choiceText = choice.text.toLowerCase();
      for (const pattern of this.INVALID_PATTERNS) {
        if (choiceText.includes(pattern.toLowerCase())) {
          console.warn('❌ Choice contains invalid pattern:', pattern, 'in:', choice.text);
          return false;
        }
      }
    }

    // Check that we have exactly 4 choices
    if (question.choices.length !== 4) {
      console.warn('❌ Question does not have exactly 4 choices:', question.choices.length);
      return false;
    }

    // Check that exactly one choice is correct
    const correctChoices = question.choices.filter(c => c.isCorrect);
    if (correctChoices.length !== 1) {
      console.warn('❌ Question does not have exactly 1 correct choice:', correctChoices.length);
      return false;
    }

    // Check for duplicate choices
    const choiceTexts = question.choices.map(c => c.text.toLowerCase());
    const uniqueChoices = new Set(choiceTexts);
    if (uniqueChoices.size !== 4) {
      console.warn('❌ Question has duplicate choices');
      return false;
    }

    // Check minimum question length
    if (question.text.length < 20) {
      console.warn('❌ Question text too short:', question.text.length);
      return false;
    }

    // Enhanced geographic context validation
    if (countryId && !this.validateGeographicContext(question, countryId)) {
      console.warn('❌ Question has incorrect geographic context for country:', countryId);
      return false;
    }

    // Check for sensible country-specific content
    const hasCountryContext = this.hasRelevantContent(question, questionText);
    if (!hasCountryContext) {
      console.warn('❌ Question lacks country-specific context:', question.text.substring(0, 50));
      return false;
    }

    return true;
  }

  /**
   * Validate geographic context of question choices
   */
  private static validateGeographicContext(question: FrontendQuestion, countryId: string): boolean {
    const questionText = question.text.toLowerCase();
    const choiceTexts = question.choices.map(c => c.text.toLowerCase());
    
    // If it's a capital city question, check geographic appropriateness
    if (questionText.includes('capital')) {
      // Check if any US cities appear in non-US questions
      const hasUSCities = choiceTexts.some(choice => 
        this.US_CITIES.some(usCity => choice.includes(usCity))
      );
      
      if (hasUSCities && !countryId.toLowerCase().includes('usa') && !countryId.toLowerCase().includes('united states')) {
        console.warn('❌ Non-US question contains US cities:', choiceTexts);
        return false;
      }
      
      // For African countries, ensure we don't have random US/European cities
      if (this.isAfricanCountry(countryId)) {
        const hasNonAfricanCities = choiceTexts.some(choice => 
          this.US_CITIES.some(usCity => choice.includes(usCity)) ||
          ['london', 'paris', 'berlin', 'rome', 'madrid'].some(euroCity => choice.includes(euroCity))
        );
        
        if (hasNonAfricanCities) {
          console.warn('❌ African country question contains non-African cities:', choiceTexts);
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Check if country is African (simple heuristic)
   */
  private static isAfricanCountry(countryId: string): boolean {
    const africanCountryPatterns = [
      'burkina', 'faso', 'nigeria', 'ghana', 'kenya', 'egypt', 'south africa', 
      'morocco', 'algeria', 'tunisia', 'libya', 'sudan', 'ethiopia', 'uganda',
      'tanzania', 'angola', 'mozambique', 'madagascar', 'cameroon', 'ivory coast',
      'mali', 'niger', 'chad', 'congo', 'zambia', 'zimbabwe', 'botswana', 'namibia'
    ];
    
    return africanCountryPatterns.some(pattern => 
      countryId.toLowerCase().includes(pattern)
    );
  }

  /**
   * Check if question has relevant, country-specific content
   */
  private static hasRelevantContent(question: FrontendQuestion, questionText: string): boolean {
    // Questions should be about real, tangible things related to countries
    const validTopics = [
      'capital', 'city', 'population', 'language', 'currency', 'border',
      'geography', 'history', 'culture', 'religion', 'government', 'economy',
      'landmark', 'mountain', 'river', 'ocean', 'continent', 'flag',
      'independence', 'president', 'prime minister', 'parliament'
    ];

    // Check if question mentions any valid topics
    return validTopics.some(topic => questionText.includes(topic));
  }

  /**
   * Get questions by multiple filters
   */
  static async getFilteredQuestions(filters: QuestionFilter): Promise<FrontendQuestion[]> {
    try {
      console.log('🔍 Fetching filtered questions:', filters);
      
      let query = supabase.from('questions').select('*');

      if (filters.countryId) {
        query = query.eq('country_id', filters.countryId);
      }

      if (filters.difficulty && ['easy', 'medium', 'hard'].includes(filters.difficulty)) {
        query = query.eq('difficulty', filters.difficulty);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(filters.limit || 50);

      if (error) throw error;

      console.log(`✅ Found ${data?.length || 0} filtered questions`);
      const validQuestions = (data || []).map(q => this.transformToFrontendQuestion(q)).filter(q => this.validateQuestion(q, filters.countryId));
      console.log(`✅ ${validQuestions.length} questions passed validation`);
      
      return validQuestions;
    } catch (error) {
      console.error('💥 Failed to fetch filtered questions:', error);
      throw error;
    }
  }

  /**
   * Transform Supabase question to frontend format with proper validation
   */
  static transformToFrontendQuestion(supabaseQuestion: any): FrontendQuestion {
    // Ensure all required fields exist
    if (!supabaseQuestion.text || !supabaseQuestion.correct_answer) {
      console.warn('⚠️ Invalid question data:', supabaseQuestion);
    }

    // Clean and validate options
    const options = [
      supabaseQuestion.option_a,
      supabaseQuestion.option_b, 
      supabaseQuestion.option_c,
      supabaseQuestion.option_d
    ].filter(Boolean); // Remove any null/undefined options

    if (options.length < 4) {
      console.warn('⚠️ Question has missing options:', supabaseQuestion.id);
    }

    // Create choices with proper validation
    const choices = [
      { 
        id: 'a', 
        text: supabaseQuestion.option_a || 'Option A missing', 
        isCorrect: supabaseQuestion.correct_answer === supabaseQuestion.option_a 
      },
      { 
        id: 'b', 
        text: supabaseQuestion.option_b || 'Option B missing', 
        isCorrect: supabaseQuestion.correct_answer === supabaseQuestion.option_b 
      },
      { 
        id: 'c', 
        text: supabaseQuestion.option_c || 'Option C missing', 
        isCorrect: supabaseQuestion.correct_answer === supabaseQuestion.option_c 
      },
      { 
        id: 'd', 
        text: supabaseQuestion.option_d || 'Option D missing', 
        isCorrect: supabaseQuestion.correct_answer === supabaseQuestion.option_d 
      }
    ];

    // Log the transformation for debugging
    console.log('🔄 Transforming question:', {
      id: supabaseQuestion.id,
      text: supabaseQuestion.text?.substring(0, 50) + '...',
      correctAnswer: supabaseQuestion.correct_answer,
      choices: choices.map(c => ({ id: c.id, text: c.text.substring(0, 20) + '...', isCorrect: c.isCorrect }))
    });

    return {
      id: supabaseQuestion.id,
      type: 'multiple-choice',
      text: supabaseQuestion.text || 'Question text missing',
      imageUrl: supabaseQuestion.image_url,
      choices,
      category: supabaseQuestion.category || 'General',
      explanation: supabaseQuestion.explanation || 'No explanation available',
      difficulty: (supabaseQuestion.difficulty as 'easy' | 'medium' | 'hard') || 'medium'
    };
  }
}
