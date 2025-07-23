import { countryFacts, CountryFacts } from "@/data/factual/countryFacts";
interface QuestionData {
  id?: string;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  category: string;
  difficulty?: string;
  country_id?: string;
  image_url?: string;
}

export class FactualQuestionGenerator {
  /**
   * Generate factually correct questions using real data
   */
  static generateQuestions(countryId: string, difficulty: 'easy' | 'medium' | 'hard', count: number = 10): QuestionData[] {
    const facts = countryFacts[countryId];
    if (!facts) return [];

    const questions: QuestionData[] = [];
    const allCountries = Object.values(countryFacts);
    
    // Template functions for different question types
    const questionTypes = [
      () => this.generateCapitalQuestion(facts, allCountries),
      () => this.generateContinentQuestion(facts),
      () => this.generateLanguageQuestion(facts, allCountries),
      () => this.generateCurrencyQuestion(facts, allCountries),
      () => this.generateIndependenceQuestion(facts),
      () => this.generateNeighborQuestion(facts, allCountries),
      () => this.generatePopulationQuestion(facts),
      () => this.generateLandmarkQuestion(facts, allCountries),
    ];

    // Generate questions based on difficulty
    const typesToUse = difficulty === 'easy' ? questionTypes.slice(0, 4) : 
                     difficulty === 'medium' ? questionTypes.slice(0, 6) : questionTypes;

    for (let i = 0; i < count; i++) {
      const questionType = typesToUse[i % typesToUse.length];
      const question = questionType();
      if (question) {
        questions.push({
          ...question,
          id: `factual-${countryId}-${difficulty}-${i}-${Date.now()}`,
          difficulty,
          country_id: countryId
        });
      }
    }

    return questions;
  }

  private static generateCapitalQuestion(facts: CountryFacts, allCountries: CountryFacts[]): QuestionData | null {
    const otherCapitals = allCountries
      .filter(c => c.id !== facts.id && c.capital !== facts.capital)
      .map(c => c.capital)
      .slice(0, 3);

    if (otherCapitals.length < 3) return null;

    const options = [facts.capital, ...otherCapitals].sort(() => Math.random() - 0.5);

    return {
      text: `What is the capital of ${facts.name}?`,
      option_a: options[0],
      option_b: options[1],
      option_c: options[2],
      option_d: options[3],
      correct_answer: facts.capital,
      explanation: `${facts.capital} is the capital and largest city of ${facts.name}.`,
      category: 'Geography'
    };
  }

  private static generateContinentQuestion(facts: CountryFacts): QuestionData {
    const continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];
    const otherContinents = continents.filter(c => c !== facts.continent).slice(0, 3);
    const options = [facts.continent, ...otherContinents].sort(() => Math.random() - 0.5);

    return {
      text: `On which continent is ${facts.name} located?`,
      option_a: options[0],
      option_b: options[1],
      option_c: options[2],
      option_d: options[3],
      correct_answer: facts.continent,
      explanation: `${facts.name} is located in ${facts.continent}.`,
      category: 'Geography'
    };
  }

  private static generateLanguageQuestion(facts: CountryFacts, allCountries: CountryFacts[]): QuestionData | null {
    const primaryLanguage = facts.languages[0];
    const otherLanguages = allCountries
      .filter(c => c.id !== facts.id)
      .flatMap(c => c.languages)
      .filter(lang => !facts.languages.includes(lang))
      .slice(0, 3);

    if (otherLanguages.length < 3) return null;

    const options = [primaryLanguage, ...otherLanguages].sort(() => Math.random() - 0.5);

    return {
      text: `What is the official language of ${facts.name}?`,
      option_a: options[0],
      option_b: options[1],
      option_c: options[2],
      option_d: options[3],
      correct_answer: primaryLanguage,
      explanation: `${primaryLanguage} is the official language of ${facts.name}.`,
      category: 'Language'
    };
  }

  private static generateCurrencyQuestion(facts: CountryFacts, allCountries: CountryFacts[]): QuestionData | null {
    const otherCurrencies = allCountries
      .filter(c => c.id !== facts.id && c.currency !== facts.currency)
      .map(c => c.currency)
      .slice(0, 3);

    if (otherCurrencies.length < 3) return null;

    const options = [facts.currency, ...otherCurrencies].sort(() => Math.random() - 0.5);

    return {
      text: `What is the currency of ${facts.name}?`,
      option_a: options[0],
      option_b: options[1],
      option_c: options[2],
      option_d: options[3],
      correct_answer: facts.currency,
      explanation: `The ${facts.currency} is the official currency of ${facts.name}.`,
      category: 'Economy'
    };
  }

  private static generateIndependenceQuestion(facts: CountryFacts): QuestionData | null {
    if (!facts.independence) return null;

    const otherYears = [
      facts.independence - 50,
      facts.independence + 30,
      facts.independence - 25
    ].filter(year => year > 1700 && year < 2030);

    const options = [facts.independence, ...otherYears].map(String).sort(() => Math.random() - 0.5);

    return {
      text: `When did ${facts.name} gain independence?`,
      option_a: options[0],
      option_b: options[1],
      option_c: options[2],
      option_d: options[3],
      correct_answer: String(facts.independence),
      explanation: `${facts.name} gained independence in ${facts.independence}.`,
      category: 'History'
    };
  }

  private static generateNeighborQuestion(facts: CountryFacts, allCountries: CountryFacts[]): QuestionData | null {
    if (facts.neighbors.length === 0) return null;

    const correctNeighbor = facts.neighbors[0];
    const nonNeighbors = allCountries
      .filter(c => c.id !== facts.id && !facts.neighbors.includes(c.name))
      .map(c => c.name)
      .slice(0, 3);

    if (nonNeighbors.length < 3) return null;

    const options = [correctNeighbor, ...nonNeighbors].sort(() => Math.random() - 0.5);

    return {
      text: `Which country shares a border with ${facts.name}?`,
      option_a: options[0],
      option_b: options[1],
      option_c: options[2],
      option_d: options[3],
      correct_answer: correctNeighbor,
      explanation: `${correctNeighbor} shares a border with ${facts.name}.`,
      category: 'Geography'
    };
  }

  private static generatePopulationQuestion(facts: CountryFacts): QuestionData {
    const population = facts.population;
    const ranges = this.getPopulationRanges(population);
    
    return {
      text: `What is the approximate population of ${facts.name}?`,
      option_a: ranges[0],
      option_b: ranges[1],
      option_c: ranges[2],
      option_d: ranges[3],
      correct_answer: ranges.find(r => this.isCorrectPopulationRange(population, r)) || ranges[0],
      explanation: `${facts.name} has a population of approximately ${this.formatPopulation(population)}.`,
      category: 'Demographics'
    };
  }

  private static generateLandmarkQuestion(facts: CountryFacts, allCountries: CountryFacts[]): QuestionData | null {
    if (facts.landmarks.length === 0) return null;

    const correctLandmark = facts.landmarks[0];
    const otherLandmarks = allCountries
      .filter(c => c.id !== facts.id)
      .flatMap(c => c.landmarks)
      .filter(landmark => !facts.landmarks.includes(landmark))
      .slice(0, 3);

    if (otherLandmarks.length < 3) return null;

    const options = [correctLandmark, ...otherLandmarks].sort(() => Math.random() - 0.5);

    return {
      text: `Which landmark is located in ${facts.name}?`,
      option_a: options[0],
      option_b: options[1],
      option_c: options[2],
      option_d: options[3],
      correct_answer: correctLandmark,
      explanation: `${correctLandmark} is a famous landmark in ${facts.name}.`,
      category: 'Culture'
    };
  }

  private static getPopulationRanges(population: number): string[] {
    const ranges = [
      { min: 0, max: 1000000, text: "Under 1 million" },
      { min: 1000000, max: 10000000, text: "1-10 million" },
      { min: 10000000, max: 50000000, text: "10-50 million" },
      { min: 50000000, max: 100000000, text: "50-100 million" },
      { min: 100000000, max: 500000000, text: "100-500 million" },
      { min: 500000000, max: Infinity, text: "Over 500 million" }
    ];

    const correctRange = ranges.find(r => population >= r.min && population < r.max);
    const otherRanges = ranges.filter(r => r !== correctRange).slice(0, 3);
    
    return [correctRange?.text || ranges[0].text, ...otherRanges.map(r => r.text)];
  }

  private static isCorrectPopulationRange(population: number, range: string): boolean {
    if (range === "Under 1 million") return population < 1000000;
    if (range === "1-10 million") return population >= 1000000 && population < 10000000;
    if (range === "10-50 million") return population >= 10000000 && population < 50000000;
    if (range === "50-100 million") return population >= 50000000 && population < 100000000;
    if (range === "100-500 million") return population >= 100000000 && population < 500000000;
    if (range === "Over 500 million") return population >= 500000000;
    return false;
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