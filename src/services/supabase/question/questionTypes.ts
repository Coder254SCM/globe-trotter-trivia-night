
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

export interface QuestionFilter {
  countryId?: string;
  difficulty?: string;
  category?: string;
  limit?: number;
}

export interface QuestionStats {
  total: number;
  byDifficulty: Record<string, number>;
  byCategory: Record<string, number>;
}
