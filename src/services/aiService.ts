
import { Question } from "@/types/quiz";
import { Country } from "./supabase/quizService";
import { supabase } from "@/integrations/supabase/client";

/**
 * AI Service using OpenRouter for production-ready online LLM access
 * Supports both free and paid models with excellent reliability
 */
export class AIService {
  private static readonly OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
  private static readonly FREE_MODEL = 'meta-llama/llama-3.1-8b-instruct:free'; // Free model
  private static readonly PAID_MODEL = 'meta-llama/llama-3.1-8b-instruct'; // Cheap paid alternative

  /**
   * Get OpenRouter API key from Supabase secrets
   */
  private static async getApiKey(): Promise<string> {
    // In production, this would come from Supabase Edge Function environment
    const apiKey = process.env.OPENROUTER_API_KEY || 'your-openrouter-api-key';
    
    if (!apiKey || apiKey === 'your-openrouter-api-key') {
      throw new Error('OpenRouter API key not configured. Please set OPENROUTER_API_KEY in your environment.');
    }
    
    return apiKey;
  }

  /**
   * Check if OpenRouter is accessible
   */
  static async isOpenRouterAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.OPENROUTER_BASE_URL}/models`, {
        headers: {
          'Authorization': `Bearer ${await this.getApiKey()}`,
        }
      });
      return response.ok;
    } catch (error) {
      console.warn('OpenRouter not available:', error);
      return false;
    }
  }

  /**
   * Generate questions using OpenRouter and save to Supabase
   */
  static async generateQuestions(
    country: Country,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number = 10
  ): Promise<Question[]> {
    const apiKey = await this.getApiKey();
    const prompt = this.buildPrompt(country, difficulty, count);
    
    try {
      const response = await fetch(`${this.OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Global Quiz Game'
        },
        body: JSON.stringify({
          model: this.FREE_MODEL, // Start with free model
          messages: [
            {
              role: 'system',
              content: 'You are an expert quiz question generator. Create accurate, well-researched questions with proper difficulty levels.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenRouter API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const questions = this.parseQuestionsFromResponse(data.choices[0].message.content, country, difficulty);
      
      // Save generated questions to Supabase
      await this.saveQuestionsToSupabase(questions, country, difficulty);
      
      return questions;
    } catch (error) {
      console.error('OpenRouter generation failed:', error);
      const fallbackQuestions = this.generateFallbackQuestions(country, difficulty, count);
      
      // Save fallback questions to Supabase as well
      await this.saveQuestionsToSupabase(fallbackQuestions, country, difficulty);
      
      return fallbackQuestions;
    }
  }

  /**
   * Build the prompt for question generation
   */
  private static buildPrompt(country: Country, difficulty: string, count: number): string {
    const difficultyInstructions = {
      easy: `EASY LEVEL - Basic facts that most people would know:
        - Capital city, continent, major landmarks
        - Famous tourist attractions, basic geography
        - Well-known cultural elements, major languages
        - Simple historical facts taught in elementary school`,
      
      medium: `MEDIUM LEVEL - College-level knowledge requiring specialized study:
        - Specific historical events with dates and key figures
        - Economic indicators, trade relationships, GDP details
        - Political systems, government structure, constitutional details
        - Regional conflicts, diplomatic relations, treaties
        - Detailed cultural practices, religious demographics
        - Geographic features like mountain ranges, river systems
        - Colonial history, independence movements, wars`,
      
      hard: `HARD LEVEL - PhD/Expert-level knowledge requiring deep academic study:
        - Obscure historical events, minor political figures
        - Specific economic data, trade statistics, inflation rates
        - Constitutional amendments, legal system details
        - Linguistic minorities, dialect variations
        - Archaeological findings, ancient civilizations
        - Specific geographic coordinates, elevation data
        - Detailed demographic statistics, census data
        - Academic research findings, scholarly debates
        - Technical government policies, bureaucratic details`
    };

    return `Generate ${count} multiple-choice trivia questions about ${country.name}.

DIFFICULTY: ${difficulty.toUpperCase()}
${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]}

Country Information:
- Capital: ${country.capital}
- Continent: ${country.continent}
- Population: ${country.population.toLocaleString()}
- Area: ${country.area_km2.toLocaleString()} km²

IMPORTANT REQUIREMENTS:
- For EASY: Questions answerable by general knowledge
- For MEDIUM: Questions requiring college-level study of the country
- For HARD: Questions requiring PhD-level expertise or specialized research
- All wrong answers must be plausible and realistic
- Include specific numbers, dates, and technical details for medium/hard
- Avoid questions that can be easily googled in 30 seconds

Format each question as JSON:
{
  "question": "Question text?",
  "options": ["A", "B", "C", "D"],
  "correct": 0,
  "explanation": "Detailed explanation with context",
  "category": "Geography|History|Culture|Economy|Politics|Demographics|Legal"
}

Return only a JSON array of questions. Ensure questions match the specified difficulty level exactly.`;
  }

  /**
   * Parse questions from AI response
   */
  private static parseQuestionsFromResponse(
    response: string,
    country: Country,
    difficulty: string
  ): Question[] {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\[.*\]/s);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const questionsData = JSON.parse(jsonMatch[0]);
      
      return questionsData.map((q: any, index: number) => ({
        id: `openrouter-${country.id}-${difficulty}-${Date.now()}-${index}`,
        type: 'multiple-choice' as const,
        text: q.question,
        choices: q.options.map((option: string, i: number) => ({
          id: String.fromCharCode(97 + i), // a, b, c, d
          text: option,
          isCorrect: i === q.correct
        })),
        category: q.category as any,
        explanation: q.explanation,
        difficulty: difficulty as any,
        imageUrl: undefined
      }));
    } catch (error) {
      console.error('Failed to parse OpenRouter response:', error);
      return this.generateFallbackQuestions(country, difficulty, 5);
    }
  }

  /**
   * Generate fallback questions when AI fails
   */
  private static generateFallbackQuestions(
    country: Country,
    difficulty: string,
    count: number
  ): Question[] {
    const templates = {
      easy: [
        {
          question: `What is the capital of ${country.name}?`,
          correct: country.capital,
          category: 'Geography',
          options: [country.capital, 'London', 'Paris', 'Berlin']
        },
        {
          question: `Which continent is ${country.name} located in?`,
          correct: country.continent,
          category: 'Geography',
          options: [country.continent, 'Asia', 'Europe', 'Africa']
        }
      ],
      medium: [
        {
          question: `What is the approximate population of ${country.name}?`,
          correct: `About ${Math.round(country.population / 1000000)} million`,
          category: 'Demographics',
          options: [
            `About ${Math.round(country.population / 1000000)} million`,
            `About ${Math.round(country.population / 1000000) * 2} million`,
            `About ${Math.round(country.population / 1000000) / 2} million`,
            `About ${Math.round(country.population / 1000000) * 1.5} million`
          ]
        }
      ],
      hard: [
        {
          question: `What is the exact population density of ${country.name} per square kilometer?`,
          correct: `${Math.round(country.population / country.area_km2)} people/km²`,
          category: 'Demographics',
          options: [
            `${Math.round(country.population / country.area_km2)} people/km²`,
            `${Math.round(country.population / country.area_km2 * 1.3)} people/km²`,
            `${Math.round(country.population / country.area_km2 * 0.8)} people/km²`,
            `${Math.round(country.population / country.area_km2 * 1.7)} people/km²`
          ]
        }
      ]
    };

    const selectedTemplates = templates[difficulty as keyof typeof templates] || templates.easy;
    
    return selectedTemplates.slice(0, count).map((template, index) => ({
      id: `fallback-${country.id}-${difficulty}-${Date.now()}-${index}`,
      type: 'multiple-choice' as const,
      text: template.question,
      choices: template.options.map((option, i) => ({
        id: String.fromCharCode(97 + i), // a, b, c, d
        text: option,
        isCorrect: option === template.correct
      })),
      category: template.category as any,
      explanation: `This is a ${difficulty} level question about ${country.name}. The correct answer demonstrates ${difficulty === 'easy' ? 'basic knowledge' : difficulty === 'medium' ? 'college-level understanding' : 'expert-level expertise'} of the country.`,
      difficulty: difficulty as any,
      imageUrl: undefined
    }));
  }

  /**
   * Save generated questions to Supabase database
   */
  private static async saveQuestionsToSupabase(
    questions: Question[],
    country: Country,
    difficulty: string
  ): Promise<void> {
    try {
      const currentMonth = new Date().getMonth() + 1;
      
      const questionsToInsert = questions.map(q => ({
        id: q.id,
        country_id: country.id,
        text: q.text,
        option_a: q.choices[0]?.text || '',
        option_b: q.choices[1]?.text || '',
        option_c: q.choices[2]?.text || '',
        option_d: q.choices[3]?.text || '',
        correct_answer: q.choices.find(choice => choice.isCorrect)?.text || '',
        difficulty: difficulty,
        category: q.category,
        explanation: q.explanation,
        month_rotation: currentMonth,
        ai_generated: true,
        image_url: q.imageUrl
      }));

      const { error } = await supabase
        .from('questions')
        .upsert(questionsToInsert, { onConflict: 'id' });

      if (error) {
        console.error('Failed to save questions to Supabase:', error);
        throw error;
      }

      console.log(`✅ Saved ${questions.length} ${difficulty} questions for ${country.name} to Supabase`);
    } catch (error) {
      console.error('Error saving questions to Supabase:', error);
      // Don't throw here to avoid breaking the generation flow
    }
  }

  /**
   * Generate and save questions for all difficulty levels
   */
  static async generateAllDifficultyQuestions(
    country: Country,
    questionsPerDifficulty: number = 20
  ): Promise<void> {
    console.log(`🤖 Generating questions for ${country.name} using OpenRouter...`);
    
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    
    for (const difficulty of difficulties) {
      try {
        await this.generateQuestions(country, difficulty, questionsPerDifficulty);
        console.log(`✅ Generated ${questionsPerDifficulty} ${difficulty} questions for ${country.name}`);
        
        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to generate ${difficulty} questions for ${country.name}:`, error);
      }
    }
  }

  /**
   * Batch generate questions for multiple countries
   */
  static async batchGenerateQuestions(
    countries: Country[],
    questionsPerDifficulty: number = 20
  ): Promise<void> {
    console.log(`🚀 Starting batch generation for ${countries.length} countries using OpenRouter...`);
    
    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      console.log(`📍 Processing ${country.name} (${i + 1}/${countries.length})...`);
      
      try {
        await this.generateAllDifficultyQuestions(country, questionsPerDifficulty);
        
        // Delay between countries to respect rate limits
        if (i < countries.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`❌ Failed to process ${country.name}:`, error);
      }
    }
    
    console.log(`🎉 Batch generation completed for ${countries.length} countries!`);
  }

  /**
   * Get setup instructions for OpenRouter
   */
  static getSetupInstructions(): string {
    return `
🚀 **OpenRouter Setup Instructions**

1. **Create OpenRouter Account**:
   - Visit: https://openrouter.ai
   - Sign up for free account

2. **Get API Key**:
   - Go to: https://openrouter.ai/keys
   - Create new API key
   - Copy the key

3. **Free Models Available**:
   - meta-llama/llama-3.1-8b-instruct:free
   - microsoft/wizardlm-2-8x22b:free
   - google/gemma-2-9b-it:free

4. **Cheap Paid Models** ($0.001/1K tokens):
   - meta-llama/llama-3.1-8b-instruct
   - anthropic/claude-3-haiku

5. **Set API Key**:
   - Add to your environment: OPENROUTER_API_KEY=your_key_here

This provides production-ready AI with free tier + cheap scaling!
    `;
  }
}

// Export for easy access
export default AIService;
