
export type QuestionType = 'multiple-choice' | 'image' | 'true-false' | 'fill-blank' | 'audio';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type QuestionCategory = 'History' | 'Culture' | 'Geography' | 'Food' | 'Music' | 'Sports' | 
  'Language' | 'Politics' | 'Science' | 'Art' | 'Literature' | 'Technology' | 'Economy' | 'Wildlife' | 'Environment' | 
  'Tribes' | 'Landmarks' | 'Famous People' | 'Traditions' | 'Achievements' | 'Religion';

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
  categories: QuestionCategory[];
  flagImageUrl?: string;
  mapImageUrl?: string;
  iconType?: 'landmark' | 'trophy' | 'globe';
  continent: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  choices: Choice[];
  category: QuestionCategory;
  explanation: string;
  difficulty: DifficultyLevel;
  lastUpdated?: string; // Track when questions were last updated
  failureRate?: number; // Track how often this question is failed
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeTaken: number;
  failedQuestionIds?: string[]; // Track which questions the user failed
  correctQuestions?: number[]; // Track which questions were answered correctly
}

export interface QuestionSet {
  country?: string;
  continent?: string;
  isGlobal?: boolean;
  questions: Question[];
  lastUpdated: string;
}
