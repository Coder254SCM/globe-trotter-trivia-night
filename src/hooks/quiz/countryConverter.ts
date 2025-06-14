
import { Country, QuestionCategory } from "@/types/quiz";
import { Country as SupabaseCountry } from "@/services/supabase/quizService";
import countries from "@/data/countries";

// Valid QuestionCategory values for filtering
const VALID_CATEGORIES: QuestionCategory[] = [
  'History', 'Culture', 'Geography', 'Economy', 'Politics', 'Demographics', 
  'Science', 'Sports', 'Food', 'Art', 'Traditions', 'Religion', 'Language',
  'Wildlife', 'Environment', 'Climate', 'Natural Wonders', 'Music', 'Dance',
  'Cinema', 'Literature', 'Theater', 'Architecture', 'Famous People', 'Technology'
];

// Helper function to convert Supabase countries to our Country type
export const convertToCountryType = (supabaseCountries: any[]): Country[] => {
  return supabaseCountries.map(country => {
    // Find matching country in static data for position and code
    const staticCountry = countries.find(c => c.name === country.name);

    // Correct parentheses and chaining to avoid TS1005 error!
    const validCategories = (country.categories || [])
      .filter((cat: any): cat is string => typeof cat === "string")
      .filter((cat: string): cat is QuestionCategory =>
        VALID_CATEGORIES.includes(cat as QuestionCategory)
      )
      .map(cat => cat as QuestionCategory);

    return {
      id: country.id,
      name: country.name,
      code: staticCountry?.code || country.name.substring(0, 3).toUpperCase(),
      position: staticCountry?.position || { lat: country.latitude || 0, lng: country.longitude || 0 },
      difficulty: (country.difficulty || 'medium') as any,
      categories: validCategories, // Now properly typed as QuestionCategory[]
      flagImageUrl: country.flag_url,
      continent: country.continent
    };
  });
};

// Helper function to convert Country to SupabaseCountry for AI service
export const convertToSupabaseCountry = (country: Country): SupabaseCountry => {
  return {
    id: country.id,
    name: country.name,
    capital: country.name, // Use name as fallback for capital
    continent: country.continent,
    population: 1000000, // Default population
    area_km2: 100000, // Default area
    latitude: country.position.lat,
    longitude: country.position.lng,
    flag_url: country.flagImageUrl || '',
    categories: country.categories.map(cat => String(cat)), // Convert QuestionCategory[] to string[]
    difficulty: country.difficulty
  };
};

// Convert raw Supabase data to SupabaseCountry format with proper typing
export const convertRawToSupabaseCountry = (countryData: any): SupabaseCountry => {
  // Fix parentheses and chaining here as well!
  const validCategories = (countryData.categories || [])
    .filter((cat: any): cat is string => typeof cat === "string")
    .filter((cat: string): cat is QuestionCategory =>
      VALID_CATEGORIES.includes(cat as QuestionCategory)
    )
    .map(cat => cat as QuestionCategory);

  return {
    id: countryData.id,
    name: countryData.name,
    capital: countryData.capital || countryData.name,
    continent: countryData.continent,
    population: countryData.population || 1000000,
    area_km2: countryData.area_km2 || 100000,
    latitude: countryData.latitude || 0,
    longitude: countryData.longitude || 0,
    flag_url: countryData.flag_url,
    categories: validCategories,
    difficulty: countryData.difficulty
  };
};
