export type QuestionType = 'multiple-choice' | 'image' | 'true-false' | 'fill-blank' | 'audio';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  position: {
    lat: number;
    lng: number;
  };
  difficulty: DifficultyLevel;
  categories: string[];
  flagImageUrl?: string;
  mapImageUrl?: string;
  iconType?: 'landmark' | 'trophy' | 'globe';
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  choices: Choice[];
  category: string;
  explanation: string;
  difficulty: DifficultyLevel;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeTaken: number;
}
