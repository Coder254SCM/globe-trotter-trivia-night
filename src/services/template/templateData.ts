
export const CAPITAL_ALTERNATIVES = [
  "London", "Paris", "Berlin", "Tokyo", "Madrid", "Rome", "Moscow", 
  "Cairo", "Delhi", "Beijing", "Ottawa", "Canberra", "Brasília", 
  "Buenos Aires", "Mexico City"
];

export const CONTINENT_ALTERNATIVES = [
  "Asia", "Africa", "Europe", "North America", "South America", "Oceania"
];

export const LANGUAGE_OPTIONS = [
  "English", "Spanish", "French", "German", "Portuguese", "Arabic", 
  "Mandarin", "Russian", "Hindi", "Japanese"
];

export const CURRENCY_OPTIONS = [
  "Dollar", "Euro", "Pound", "Yen", "Peso", "Franc", "Mark", "Ruble", 
  "Rupee", "Real"
];

export const RELIGION_OPTIONS = [
  "Christianity", "Islam", "Buddhism", "Hinduism", "Judaism", "Traditional beliefs"
];

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getUniqueOptions(correct: string, alternatives: string[]): string[] {
  const options = [correct];
  const filtered = alternatives.filter(alt => alt !== correct);
  
  while (options.length < 4 && filtered.length > 0) {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    options.push(filtered.splice(randomIndex, 1)[0]);
  }
  
  // Fill remaining slots if needed
  while (options.length < 4) {
    options.push(`Alternative option ${options.length}`);
  }
  
  return shuffle(options);
}
