
import { Question } from "@/types/quiz";
import { Country } from "./supabase/quizService";
import { supabase } from "@/integrations/supabase/client";

/**
 * AI Service using Supabase Edge Function for secure API access
 * This avoids browser environment issues with API keys
 */
export class AIService {
  /**
   * Check if AI service is available by testing the edge function
   */
  static async isOpenRouterAvailable(): Promise<boolean> {
    try {
      // Test the edge function instead of direct API access
      const { data, error } = await supabase.functions.invoke('ai-proxy', {
        body: { 
          prompt: "Test connection",
          model: "meta-llama/llama-3.1-8b-instruct:free"
        }
      });
      
      if (error) {
        console.warn('AI Proxy not available:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.warn('AI service not available:', error);
      return false;
    }
  }

  /**
   * Generate questions using Supabase Edge Function
   */
  static async generateQuestions(
    country: Country,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number = 10
  ): Promise<Question[]> {
    const prompt = this.buildPrompt(country, difficulty, count);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-proxy', {
        body: { 
          prompt,
          model: "meta-llama/llama-3.1-8b-instruct:free"
        }
      });

      if (error) {
        throw new Error(`AI Proxy error: ${error.message}`);
      }

      if (!data || !data.choices || !data.choices[0]) {
        throw new Error('Invalid response from AI service');
      }

      const questions = this.parseQuestionsFromResponse(
        data.choices[0].message.content, 
        country, 
        difficulty
      );
      
      // Save generated questions to Supabase
      await this.saveQuestionsToSupabase(questions, country, difficulty);
      
      return questions;
    } catch (error) {
      console.error('AI generation failed:', error);
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
        id: `ai-${country.id}-${difficulty}-${Date.now()}-${index}`,
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
      console.error('Failed to parse AI response:', error);
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
    console.log(`🤖 Generating questions for ${country.name} using AI Proxy...`);
    
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
    console.log(`🚀 Starting batch generation for ${countries.length} countries using AI Proxy...`);
    
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
   * Get setup instructions for AI service
   */
  static getSetupInstructions(): string {
    return `
🚀 **AI Service Setup Instructions**

The AI service now uses Supabase Edge Functions for secure API access.

1. **Edge Function**: The ai-proxy function handles all AI requests
2. **API Key**: Set OPENROUTER_API_KEY in Supabase Edge Function secrets
3. **Models**: Uses meta-llama/llama-3.1-8b-instruct:free by default

To set up the API key:
1. Go to your Supabase project
2. Navigate to Edge Functions → Settings
3. Add OPENROUTER_API_KEY secret
4. Get your key from https://openrouter.ai

This provides secure AI generation without exposing keys in the browser!
    `;
  }
}

// Export for easy access
export default AIService;
