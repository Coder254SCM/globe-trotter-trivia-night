
import { supabase } from "@/integrations/supabase/client";
import countries from "@/data/countries";

export interface GenerationRequest {
  countryId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  count: number;
}

export interface GeneratedQuestion {
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  country_id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export class QuestionGeneratorService {
  private static readonly QUALITY_THRESHOLD = 0.95;
  
  /**
   * Generate high-quality questions for a specific country and difficulty
   */
  static async generateQuestions(request: GenerationRequest): Promise<GeneratedQuestion[]> {
    console.log(`🤖 Starting AI generation for ${request.countryId} - ${request.difficulty} - ${request.category}`);
    
    const country = countries.find(c => c.id === request.countryId);
    if (!country) {
      throw new Error(`Country not found: ${request.countryId}`);
    }

    const questions: GeneratedQuestion[] = [];
    const maxAttempts = request.count * 3; // Generate extra to ensure quality
    
    for (let i = 0; i < maxAttempts && questions.length < request.count; i++) {
      try {
        const prompt = this.buildPrompt(country, request.difficulty, request.category);
        const generatedQuestion = await this.callAIService(prompt, request);
        
        // Strict quality validation
        if (await this.validateQuestionQuality(generatedQuestion)) {
          questions.push(generatedQuestion);
          console.log(`✅ Generated quality question ${questions.length}/${request.count}`);
        } else {
          console.log(`❌ Rejected low-quality question attempt ${i + 1}`);
        }
      } catch (error) {
        console.error(`Failed to generate question attempt ${i + 1}:`, error);
      }
    }

    if (questions.length < request.count) {
      throw new Error(`Could not generate enough quality questions: ${questions.length}/${request.count}`);
    }

    return questions.slice(0, request.count);
  }

  /**
   * Build context-aware prompt for AI generation
   */
  private static buildPrompt(country: any, difficulty: string, category: string): string {
    const difficultyGuides = {
      easy: "Basic, well-known facts that most people would know",
      medium: "Moderately challenging facts requiring some knowledge",
      hard: "Advanced, specialized knowledge requiring deep understanding"
    };

    return `Generate a ${difficulty} difficulty ${category} question about ${country.name}.

STRICT REQUIREMENTS:
- Question must be SPECIFICALLY about ${country.name}
- Must mention "${country.name}" in the question text
- ${difficultyGuides[difficulty]}
- NO generic templates or buzzwords
- NO "methodology A/B/C" patterns
- Factually accurate and verifiable
- Clear, unambiguous language
- Four distinct answer options
- One clearly correct answer
- Detailed explanation

Country Context:
- Name: ${country.name}
- Capital: ${country.capital}
- Continent: ${country.continent}
- Population: ${country.population?.toLocaleString() || 'Unknown'}

Format: Return ONLY a JSON object with: text, option_a, option_b, option_c, option_d, correct_answer, explanation`;
  }

  /**
   * Call AI service (placeholder - implement with your preferred AI service)
   */
  private static async callAIService(prompt: string, request: GenerationRequest): Promise<GeneratedQuestion> {
    // This would call your AI service (OpenAI, Claude, etc.)
    // For now, return a structured example
    const country = countries.find(c => c.id === request.countryId)!;
    
    // Mock generation - replace with actual AI call
    const mockQuestion: GeneratedQuestion = {
      text: `What is the capital city of ${country.name}?`,
      option_a: country.capital || "Unknown",
      option_b: "Paris",
      option_c: "London", 
      option_d: "Rome",
      correct_answer: country.capital || "Unknown",
      explanation: `${country.capital} is the capital and largest city of ${country.name}.`,
      country_id: request.countryId,
      category: request.category,
      difficulty: request.difficulty
    };

    return mockQuestion;
  }

  /**
   * Strict quality validation
   */
  private static async validateQuestionQuality(question: GeneratedQuestion): Promise<boolean> {
    const country = countries.find(c => c.id === question.country_id);
    if (!country) return false;

    // Check 1: Country mention requirement
    if (!question.text.toLowerCase().includes(country.name.toLowerCase())) {
      console.log(`❌ Question doesn't mention ${country.name}`);
      return false;
    }

    // Check 2: No placeholder patterns
    const placeholderPatterns = [
      /methodology [a-d]/i,
      /approach [a-d]/i,
      /technique [a-d]/i,
      /method [a-d]/i,
      /option [a-d] for/i,
      /correct answer for/i,
      /placeholder/i
    ];

    const allText = [
      question.text,
      question.option_a,
      question.option_b,
      question.option_c,
      question.option_d,
      question.explanation
    ].join(' ');

    for (const pattern of placeholderPatterns) {
      if (pattern.test(allText)) {
        console.log(`❌ Contains placeholder pattern: ${pattern}`);
        return false;
      }
    }

    // Check 3: Correct answer validation
    const options = [question.option_a, question.option_b, question.option_c, question.option_d];
    if (!options.includes(question.correct_answer)) {
      console.log(`❌ Correct answer not in options`);
      return false;
    }

    // Check 4: Unique options
    const uniqueOptions = new Set(options.map(opt => opt.toLowerCase().trim()));
    if (uniqueOptions.size < 4) {
      console.log(`❌ Duplicate options detected`);
      return false;
    }

    // Check 5: Minimum length requirements
    if (question.text.length < 20 || question.explanation.length < 30) {
      console.log(`❌ Text too short`);
      return false;
    }

    return true;
  }

  /**
   * Batch generate questions for multiple countries
   */
  static async batchGenerate(requests: GenerationRequest[]): Promise<Map<string, GeneratedQuestion[]>> {
    const results = new Map<string, GeneratedQuestion[]>();
    
    for (const request of requests) {
      try {
        const questions = await this.generateQuestions(request);
        const key = `${request.countryId}-${request.difficulty}-${request.category}`;
        results.set(key, questions);
      } catch (error) {
        console.error(`Failed to generate for ${request.countryId}:`, error);
        results.set(`${request.countryId}-${request.difficulty}-${request.category}`, []);
      }
    }

    return results;
  }
}
