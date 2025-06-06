
import { Question } from "../../types/quiz";
import countries from "../../data/countries";

// Dynamic question storage interface
interface QuestionStorage {
  getQuestions(countryId: string): Promise<Question[]>;
  addQuestion(countryId: string, question: Question): Promise<void>;
  updateQuestion(countryId: string, questionId: string, question: Question): Promise<void>;
  deleteQuestion(countryId: string, questionId: string): Promise<void>;
  getAllCountriesWithQuestions(): Promise<string[]>;
  getTotalQuestionCount(): Promise<number>;
}

// LocalStorage implementation for now (can be replaced with Supabase)
class LocalStorageQuestionStorage implements QuestionStorage {
  private storageKey = 'quiz_questions_v1';

  private getStorage(): Record<string, Question[]> {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private setStorage(data: Record<string, Question[]>): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  async getQuestions(countryId: string): Promise<Question[]> {
    const storage = this.getStorage();
    return storage[countryId] || [];
  }

  async addQuestion(countryId: string, question: Question): Promise<void> {
    const storage = this.getStorage();
    if (!storage[countryId]) {
      storage[countryId] = [];
    }
    storage[countryId].push(question);
    this.setStorage(storage);
  }

  async updateQuestion(countryId: string, questionId: string, question: Question): Promise<void> {
    const storage = this.getStorage();
    if (storage[countryId]) {
      const index = storage[countryId].findIndex(q => q.id === questionId);
      if (index !== -1) {
        storage[countryId][index] = question;
        this.setStorage(storage);
      }
    }
  }

  async deleteQuestion(countryId: string, questionId: string): Promise<void> {
    const storage = this.getStorage();
    if (storage[countryId]) {
      storage[countryId] = storage[countryId].filter(q => q.id !== questionId);
      this.setStorage(storage);
    }
  }

  async getAllCountriesWithQuestions(): Promise<string[]> {
    const storage = this.getStorage();
    return Object.keys(storage).filter(countryId => storage[countryId].length > 0);
  }

  async getTotalQuestionCount(): Promise<number> {
    const storage = this.getStorage();
    return Object.values(storage).reduce((total, questions) => total + questions.length, 0);
  }

  // Initialize with basic questions for all 195 countries
  async initializeAllCountries(): Promise<void> {
    const storage = this.getStorage();
    let addedCount = 0;

    for (const country of countries) {
      if (!storage[country.id] || storage[country.id].length === 0) {
        storage[country.id] = this.generateBasicQuestions(country);
        addedCount++;
      }
    }

    if (addedCount > 0) {
      this.setStorage(storage);
      console.log(`✅ Initialized questions for ${addedCount} countries`);
    }
  }

  private generateBasicQuestions(country: any): Question[] {
    return [
      {
        id: `${country.id}-capital`,
        type: "multiple-choice" as const,
        text: `What is the capital of ${country.name}?`,
        choices: [
          { id: "a", text: country.capital || "Unknown", isCorrect: true },
          { id: "b", text: "Option B", isCorrect: false },
          { id: "c", text: "Option C", isCorrect: false },
          { id: "d", text: "Option D", isCorrect: false }
        ],
        category: "Geography" as const,
        explanation: `The capital of ${country.name} is ${country.capital || "not well documented"}.`,
        difficulty: "easy" as const
      },
      {
        id: `${country.id}-continent`,
        type: "multiple-choice" as const,
        text: `${country.name} is located in which continent?`,
        choices: [
          { id: "a", text: country.continent, isCorrect: true },
          { id: "b", text: "Europe", isCorrect: false },
          { id: "c", text: "Asia", isCorrect: false },
          { id: "d", text: "Africa", isCorrect: false }
        ],
        category: "Geography" as const,
        explanation: `${country.name} is located in ${country.continent}.`,
        difficulty: "easy" as const
      },
      {
        id: `${country.id}-population`,
        type: "multiple-choice" as const,
        text: `Approximately what is the population of ${country.name}?`,
        choices: [
          { id: "a", text: country.population ? `${Math.round(country.population / 1000000)}M` : "Unknown", isCorrect: true },
          { id: "b", text: "50M", isCorrect: false },
          { id: "c", text: "100M", isCorrect: false },
          { id: "d", text: "200M", isCorrect: false }
        ],
        category: "Geography" as const,
        explanation: `${country.name} has a population of approximately ${country.population ? Math.round(country.population / 1000000) + ' million' : 'unknown size'}.`,
        difficulty: "medium" as const
      }
    ];
  }
}

// Singleton instance
export const questionStorage = new LocalStorageQuestionStorage();

// Initialize on first load
questionStorage.initializeAllCountries();
