
import { Country } from "@/services/supabase/country/countryTypes";
import { AutomaticAnswerValidator } from "@/services/quality/automaticAnswerValidator";
import { QuestionQualityService } from "@/services/quality/questionQualityService";
import { isValidQuestion } from "./questionValidation";
import countries from "@/data/countries";

export interface EnhancedQuestionData {
  text: string;
  options: string[];
  correct: string;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  qualityScore: number;
  validated: boolean;
}

export class EnhancedQuestionGenerator {
  /**
   * Generate high-quality geography questions with validation
   */
  static generateGeographyQuestion(
    country: Country,
    difficulty: 'easy' | 'medium' | 'hard',
    seed: number = 0
  ): EnhancedQuestionData | null {
    const countryData = countries.find(c => c.id === country.id);
    if (!countryData) return null;

    const templates = this.getGeographyTemplates(difficulty);
    const template = templates[seed % templates.length];
    
    const questionData = template.generate(countryData, difficulty);
    if (!questionData) return null;

    // Validate and fix answers
    const validation = AutomaticAnswerValidator.validateAndFix(
      questionData.text,
      questionData.options,
      questionData.correct,
      country.id
    );

    // If validation failed and we have fixes, use them
    if (!validation.isValid && validation.fixedOptions.length === 4) {
      questionData.options = validation.fixedOptions;
      questionData.correct = validation.fixedCorrectAnswer;
    }

    // Final validation check
    if (!isValidQuestion(questionData)) {
      return null;
    }

    return {
      ...questionData,
      qualityScore: validation.isValid ? 100 : 70,
      validated: true
    };
  }

  /**
   * Geography question templates with better answer generation
   */
  private static getGeographyTemplates(difficulty: 'easy' | 'medium' | 'hard') {
    const templates = [
      {
        generate: (country: any, diff: string) => {
          if (!country.capital) return null;
          
          // Get other capitals for wrong answers
          const otherCapitals = countries
            .filter(c => c.capital && c.capital !== country.capital && c.continent === country.continent)
            .map(c => c.capital)
            .slice(0, 3);

          if (otherCapitals.length < 3) {
            // Get from other continents if needed
            const moreCapitals = countries
              .filter(c => c.capital && c.capital !== country.capital && c.continent !== country.continent)
              .map(c => c.capital)
              .slice(0, 3 - otherCapitals.length);
            
            otherCapitals.push(...moreCapitals);
          }

          if (otherCapitals.length < 3) return null;

          const options = [country.capital, ...otherCapitals].sort(() => 0.5 - Math.random());

          return {
            text: `What is the capital city of ${country.name}?`,
            options,
            correct: country.capital,
            explanation: `${country.capital} is the capital and largest city of ${country.name}.`,
            category: 'Geography'
          };
        }
      },
      {
        generate: (country: any, diff: string) => {
          const otherContinents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania']
            .filter(c => c !== country.continent)
            .slice(0, 3);

          if (otherContinents.length < 3) return null;

          const options = [country.continent, ...otherContinents].sort(() => 0.5 - Math.random());

          return {
            text: `On which continent is ${country.name} located?`,
            options,
            correct: country.continent,
            explanation: `${country.name} is located on the continent of ${country.continent}.`,
            category: 'Geography'
          };
        }
      },
      {
        generate: (country: any, diff: string) => {
          if (!country.population) return null;

          const ranges = this.getPopulationRanges(country.population);
          if (ranges.length < 4) return null;

          const correctRange = ranges.find(r => r.isCorrect);
          if (!correctRange) return null;

          return {
            text: `What is the approximate population of ${country.name}?`,
            options: ranges.map(r => r.text),
            correct: correctRange.text,
            explanation: `${country.name} has a population of approximately ${this.formatPopulation(country.population)}.`,
            category: 'Geography'
          };
        }
      }
    ];

    return templates;
  }

  private static getPopulationRanges(population: number): Array<{text: string, isCorrect: boolean}> {
    const ranges = [
      { min: 0, max: 1000000, text: "Less than 1 million" },
      { min: 1000000, max: 10000000, text: "1-10 million" },
      { min: 10000000, max: 50000000, text: "10-50 million" },
      { min: 50000000, max: 100000000, text: "50-100 million" },
      { min: 100000000, max: 500000000, text: "100-500 million" },
      { min: 500000000, max: 1500000000, text: "500 million - 1.5 billion" },
      { min: 1500000000, max: Infinity, text: "Over 1.5 billion" }
    ];

    const correctRange = ranges.find(r => population >= r.min && population < r.max);
    if (!correctRange) return [];

    const otherRanges = ranges.filter(r => r !== correctRange).slice(0, 3);
    
    return [
      { text: correctRange.text, isCorrect: true },
      ...otherRanges.map(r => ({ text: r.text, isCorrect: false }))
    ];
  }

  private static formatPopulation(population: number): string {
    if (population >= 1000000000) {
      return `${(population / 1000000000).toFixed(1)} billion`;
    } else if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)} million`;
    } else {
      return population.toLocaleString();
    }
  }
}
