
export type QuestionType = 'multiple-choice' | 'image' | 'true-false' | 'fill-blank' | 'audio';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type QuestionCategory = 
  // Culture & Society
  'History' | 'Culture' | 'Traditions' | 'Religion' | 'Language' | 'Fashion' |
  'Festivals' | 'Customs' | 'Mythology' | 'Social Norms' | 'Languages' | 
  'Indigenous Culture' | 'Indigenous Peoples' | 'TV Shows' | 'War' | 'Ancient Civilization' | 
  'Ancient Civilizations' | 'Viking Era' | 'World War II' |
  
  // Geography & Nature
  'Geography' | 'Wildlife' | 'Environment' | 'Climate' | 'Natural Wonders' |
  'Ecosystems' | 'Conservation' | 'Natural Resources' | 'Nature' | 'Islands' |
  'Desert' | 'Rainforests' | 'National Parks' | 'Canal' | 'Ecology' |
  
  // Arts & Entertainment
  'Art' | 'Music' | 'Dance' | 'Cinema' | 'Literature' | 'Theater' |
  'Architecture' | 'Crafts' | 'Photography' | 'Media' |
  
  // People & Society
  'Famous People' | 'Tribes' | 'Demographics' | 'Social Movements' |
  'Women Achievements' | 'Youth Culture' | 'Migration' |
  
  // Modern Life
  'Technology' | 'Economy' | 'Urban Life' | 'Transportation' |
  'Education' | 'Healthcare' | 'Innovation' | 'Science' | 'Business' | 'Banking' |
  'Maritime Exploration' |
  
  // Lifestyle
  'Food' | 'Sports' | 'Fashion' | 'Lifestyle' | 'Recreation' | 'Coffee' | 'Wine' | 'Tourism' |
  
  // Government & Heritage
  'Politics' | 'Landmarks' | 'Military History' | 'Achievements' |
  'International Relations' | 'Heritage Sites' | 'Ancient History' | 'Archaeology' | 
  'Philosophy' | 'Industry';

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
  iconType?: 'landmark' | 'trophy' | 'globe' | 'culture' | 'nature';
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
