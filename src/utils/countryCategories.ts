
import { QuestionCategory } from "@/types/quiz";

// Enhanced category assignments - each country gets 12+ categories
export const getCategoriesForCountry = (countryName: string, continent: string): QuestionCategory[] => {
  // Base categories that every country should have
  const baseCategories: QuestionCategory[] = [
    'Geography',
    'History', 
    'Culture',
    'Politics',
    'Economy',
    'Famous People',
    'Food',
    'Language'
  ];

  // Additional categories based on continent
  const continentCategories: Record<string, QuestionCategory[]> = {
    'Africa': ['Wildlife', 'Ancient Civilizations', 'Music', 'Art', 'Natural Resources'],
    'Asia': ['Technology', 'Religion', 'Architecture', 'Philosophy', 'Ancient History'],
    'Europe': ['Art', 'Literature', 'Architecture', 'Music', 'Science'],
    'North America': ['Sports', 'Technology', 'Culture', 'Industry'],
    'South America': ['Music', 'Culture', 'Environment', 'Culture', 'Natural Wonders'],
    'Oceania': ['Environment', 'Culture', 'Wildlife', 'Natural Wonders', 'Sports']
  };

  // Country-specific additional categories using only valid QuestionCategory types
  const countrySpecificCategories: Record<string, QuestionCategory[]> = {
    'United States': ['Technology', 'Sports', 'Culture'],
    'China': ['Ancient Civilizations', 'Philosophy', 'Technology'],
    'India': ['Religion', 'Philosophy', 'Ancient History'],
    'France': ['Food', 'Fashion', 'Food'],
    'Japan': ['Technology', 'Art', 'Philosophy'],
    'Brazil': ['Sports', 'Music', 'Environment'],
    'Egypt': ['Ancient History', 'History', 'Geography'],
    'Australia': ['Wildlife', 'Sports', 'Environment'],
    'Russia': ['Science', 'Literature', 'Art'],
    'Italy': ['Art', 'Food', 'Fashion'],
    'Germany': ['Science', 'Technology', 'Music'],
    'Spain': ['Music', 'Art', 'Food'],
    'Mexico': ['Ancient Civilizations', 'Culture', 'Music'],
    'Canada': ['Sports', 'Natural Resources', 'Environment'],
    'United Kingdom': ['Literature', 'Politics', 'Culture'],
    'South Korea': ['Technology', 'Music', 'Culture'],
    'Nigeria': ['Culture', 'Natural Resources', 'Culture'],
    'Kenya': ['Wildlife', 'Sports', 'Culture'],
    'Morocco': ['Culture', 'Art', 'Architecture'],
    'Thailand': ['Religion', 'Food', 'Wildlife'],
    'Greece': ['Ancient History', 'History', 'Natural Wonders'],
    'Norway': ['Environment', 'History', 'Natural Resources'],
    'Switzerland': ['Food', 'Economy', 'Geography'],
    'Netherlands': ['Culture', 'Environment', 'Geography'],
    'Argentina': ['Music', 'Food', 'Sports'],
    'Peru': ['Ancient History', 'Food', 'Wildlife'],
    'South Africa': ['Natural Resources', 'Food', 'Wildlife']
  };

  // Combine all categories
  let allCategories = [...baseCategories];
  
  // Add continent-specific categories
  if (continentCategories[continent]) {
    allCategories = [...allCategories, ...continentCategories[continent]];
  }
  
  // Add country-specific categories
  if (countrySpecificCategories[countryName]) {
    allCategories = [...allCategories, ...countrySpecificCategories[countryName]];
  }

  // Remove duplicates and ensure we have at least 12 categories
  const uniqueCategories = Array.from(new Set(allCategories));
  
  // If we still don't have enough, add more general categories
  const additionalCategories: QuestionCategory[] = [
    'Science', 'Education', 'Healthcare', 'Geography',
    'Tourism', 'Culture', 'Culture', 'History', 'Demographics',
    'Geography', 'Natural Parks', 'Economy', 'Industry', 'Culture'
  ];
  
  for (const category of additionalCategories) {
    if (uniqueCategories.length >= 12) break;
    if (!uniqueCategories.includes(category)) {
      uniqueCategories.push(category);
    }
  }

  return uniqueCategories.slice(0, 15); // Return up to 15 categories per country
};
