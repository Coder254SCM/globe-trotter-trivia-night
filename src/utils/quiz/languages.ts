
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
];

export const getLanguageName = (code: string): string => {
  const language = supportedLanguages.find(lang => lang.code === code);
  return language ? language.name : 'English';
};

export const getCurrentLanguage = (): string => {
  return localStorage.getItem('quiz_language') || 'en';
};

export const setCurrentLanguage = (code: string): void => {
  localStorage.setItem('quiz_language', code);
};

// Simple translation utility
export const translations: Record<string, Record<string, string>> = {
  en: {
    'quiz.title': 'Quiz',
    'quiz.score': 'Score',
    'quiz.time': 'Time',
    'quiz.next': 'Next Question',
    'quiz.finish': 'Finish Quiz',
    'quiz.results': 'Quiz Results',
    'quiz.restart': 'Restart Quiz',
    'quiz.back': 'Back to Globe',
    'country.select': 'Select a country to start',
    'difficulty.easy': 'Easy',
    'difficulty.medium': 'Medium',
    'difficulty.hard': 'Hard',
    'weekly.challenge': 'Weekly Challenge'
  },
  es: {
    'quiz.title': 'Cuestionario',
    'quiz.score': 'Puntuación',
    'quiz.time': 'Tiempo',
    'quiz.next': 'Siguiente Pregunta',
    'quiz.finish': 'Terminar Cuestionario',
    'quiz.results': 'Resultados del Cuestionario',
    'quiz.restart': 'Reiniciar Cuestionario',
    'quiz.back': 'Volver al Globo',
    'country.select': 'Selecciona un país para empezar',
    'difficulty.easy': 'Fácil',
    'difficulty.medium': 'Medio',
    'difficulty.hard': 'Difícil',
    'weekly.challenge': 'Desafío Semanal'
  },
  fr: {
    'quiz.title': 'Quiz',
    'quiz.score': 'Score',
    'quiz.time': 'Temps',
    'quiz.next': 'Question Suivante',
    'quiz.finish': 'Terminer le Quiz',
    'quiz.results': 'Résultats du Quiz',
    'quiz.restart': 'Recommencer le Quiz',
    'quiz.back': 'Retour au Globe',
    'country.select': 'Sélectionnez un pays pour commencer',
    'difficulty.easy': 'Facile',
    'difficulty.medium': 'Moyen',
    'difficulty.hard': 'Difficile',
    'weekly.challenge': 'Défi Hebdomadaire'
  }
};

export const t = (key: string): string => {
  const language = getCurrentLanguage();
  return translations[language]?.[key] || translations.en[key] || key;
};
