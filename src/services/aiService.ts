import { Question } from "@/types/quiz";
import { Country } from "./supabase/quizService";
import { supabase } from "@/integrations/supabase/client";

/**
 * AI Service using Ollama for free local LLM deployment
 * This replaces the need for paid OpenAI API with a completely free solution
 */
export class AIService {
  private static readonly OLLAMA_BASE_URL = 'http://localhost:11434';
  private static readonly MODEL_NAME = 'llama3.2:3b'; // Lightweight model for production

  /**
   * Check if Ollama is running and accessible
   */
  static async isOllamaAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.OLLAMA_BASE_URL}/api/tags`);
      return response.ok;
    } catch (error) {
      console.warn('Ollama not available:', error);
      return false;
    }
  }

  /**
   * Ensure the required model is available
   */
  static async ensureModel(): Promise<boolean> {
    try {
      const response = await fetch(`${this.OLLAMA_BASE_URL}/api/tags`);
      const data = await response.json();
      const hasModel = data.models?.some((model: any) => model.name.includes(this.MODEL_NAME));
      
      if (!hasModel) {
        console.log(`📥 Pulling ${this.MODEL_NAME} model...`);
        await this.pullModel();
      }
      
      return true;
    } catch (error) {
      console.error('Failed to ensure model:', error);
      return false;
    }
  }

  /**
   * Pull the required model
   */
  private static async pullModel(): Promise<void> {
    const response = await fetch(`${this.OLLAMA_BASE_URL}/api/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: this.MODEL_NAME })
    });

    if (!response.ok) {
      throw new Error('Failed to pull model');
    }
  }

  /**
   * Generate questions using Ollama and save to Supabase
   */
  static async generateQuestions(
    country: Country,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number = 10
  ): Promise<Question[]> {
    if (!(await this.isOllamaAvailable())) {
      throw new Error('Ollama is not available. Please install and start Ollama.');
    }

    await this.ensureModel();

    const prompt = this.buildPrompt(country, difficulty, count);
    
    try {
      const response = await fetch(`${this.OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.MODEL_NAME,
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 2000
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      const questions = this.parseQuestionsFromResponse(data.response, country, difficulty);
      
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
      easy: 'basic facts like capital, continent, major landmarks',
      medium: 'cultural aspects, history, economy, and regional knowledge',
      hard: 'detailed historical events, specific statistics, complex cultural nuances'
    };

    return `Generate ${count} multiple-choice trivia questions about ${country.name}.

Difficulty: ${difficulty} - Focus on ${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]}

Country Information:
- Capital: ${country.capital}
- Continent: ${country.continent}
- Population: ${country.population.toLocaleString()}
- Area: ${country.area_km2.toLocaleString()} km²

Format each question as JSON:
{
  "question": "Question text?",
  "options": ["A", "B", "C", "D"],
  "correct": 0,
  "explanation": "Brief explanation",
  "category": "Geography|History|Culture|Economy|Nature"
}

Return only a JSON array of questions. Ensure questions are factually accurate and appropriate for ${difficulty} difficulty.`;
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
          category: 'Geography'
        },
        {
          question: `Which continent is ${country.name} located in?`,
          correct: country.continent,
          category: 'Geography'
        }
      ],
      medium: [
        {
          question: `What is the approximate population of ${country.name}?`,
          correct: `About ${Math.round(country.population / 1000000)} million`,
          category: 'Geography'
        }
      ],
      hard: [
        {
          question: `What is the total area of ${country.name} in square kilometers?`,
          correct: `${country.area_km2.toLocaleString()} km²`,
          category: 'Geography'
        }
      ]
    };

    const selectedTemplates = templates[difficulty as keyof typeof templates] || templates.easy;
    
    return selectedTemplates.slice(0, count).map((template, index) => ({
      id: `fallback-${country.id}-${difficulty}-${Date.now()}-${index}`,
      type: 'multiple-choice' as const,
      text: template.question,
      choices: [
        { id: 'a', text: template.correct, isCorrect: true },
        { id: 'b', text: 'Option B', isCorrect: false },
        { id: 'c', text: 'Option C', isCorrect: false },
        { id: 'd', text: 'Option D', isCorrect: false }
      ],
      category: template.category as any,
      explanation: `This is a ${difficulty} level question about ${country.name}.`,
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
    console.log(`🤖 Generating questions for ${country.name}...`);
    
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    
    for (const difficulty of difficulties) {
      try {
        await this.generateQuestions(country, difficulty, questionsPerDifficulty);
        console.log(`✅ Generated ${questionsPerDifficulty} ${difficulty} questions for ${country.name}`);
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
    console.log(`🚀 Starting batch generation for ${countries.length} countries...`);
    
    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      console.log(`📍 Processing ${country.name} (${i + 1}/${countries.length})...`);
      
      try {
        await this.generateAllDifficultyQuestions(country, questionsPerDifficulty);
        
        // Add a small delay to avoid overwhelming the local Ollama instance
        if (i < countries.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`❌ Failed to process ${country.name}:`, error);
      }
    }
    
    console.log(`🎉 Batch generation completed for ${countries.length} countries!`);
  }

  /**
   * Get installation instructions for Ollama
   */
  static getInstallationInstructions(): string {
    return `
🤖 **Free AI Setup Instructions**

1. **Install Ollama** (completely free):
   - Windows: Download from https://ollama.ai
   - macOS: brew install ollama
   - Linux: curl -fsSL https://ollama.ai/install.sh | sh

2. **Start Ollama**:
   - Run: ollama serve

3. **Pull the model** (one-time setup):
   - Run: ollama pull llama3.2:3b

4. **Verify installation**:
   - Visit: http://localhost:11434

This provides a completely free, local AI solution that works offline!
    `;
  }
}

// Export for easy access
export default AIService;