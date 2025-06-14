
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
    'North America': ['Sports', 'Technology', 'Indigenous Culture', 'Industry'],
    'South America': ['Music', 'Dance', 'Environment', 'Indigenous Peoples', 'Natural Wonders'],
    'Oceania': ['Environment', 'Indigenous Culture', 'Wildlife', 'Natural Wonders', 'Sports']
  };

  // Country-specific additional categories using only valid QuestionCategory types
  const countrySpecificCategories: Record<string, QuestionCategory[]> = {
    'United States': ['Technology', 'Cinema', 'Innovation'],
    'China': ['Ancient Civilizations', 'Philosophy', 'Technology'],
    'India': ['Religion', 'Philosophy', 'Ancient History'],
    'France': ['Wine', 'Fashion', 'Food'],
    'Japan': ['Technology', 'Art', 'Philosophy'],
    'Brazil': ['Sports', 'Music', 'Environment'],
    'Egypt': ['Ancient History', 'Archaeology', 'Climate'],
    'Australia': ['Wildlife', 'Sports', 'Environment'],
    'Russia': ['Science', 'Literature', 'Art'],
    'Italy': ['Art', 'Food', 'Fashion'],
    'Germany': ['Science', 'Technology', 'Music'],
    'Spain': ['Music', 'Art', 'Food'],
    'Mexico': ['Ancient Civilizations', 'Traditions', 'Music'],
    'Canada': ['Sports', 'Natural Resources', 'Environment'],
    'United Kingdom': ['Literature', 'Politics', 'Traditions'],
    'South Korea': ['Technology', 'Music', 'Media'],
    'Nigeria': ['Media', 'Natural Resources', 'Culture'],
    'Kenya': ['Wildlife', 'Sports', 'Culture'],
    'Morocco': ['Traditions', 'Art', 'Architecture'],
    'Thailand': ['Religion', 'Food', 'Wildlife'],
    'Greece': ['Ancient History', 'Mythology', 'Natural Wonders'],
    'Norway': ['Environment', 'History', 'Natural Resources'],
    'Switzerland': ['Food', 'Economy', 'Geography'],
    'Netherlands': ['Traditions', 'Environment', 'Transportation'],
    'Argentina': ['Music', 'Food', 'Sports'],
    'Peru': ['Ancient History', 'Food', 'Wildlife'],
    'South Africa': ['Natural Resources', 'Wine', 'Wildlife']
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
    'Science', 'Education', 'Healthcare', 'Transportation',
    'Tourism', 'Festivals', 'Traditions', 'Military History', 'Demographics',
    'Climate', 'National Parks', 'Banking', 'Industry', 'Media'
  ];
  
  for (const category of additionalCategories) {
    if (uniqueCategories.length >= 12) break;
    if (!uniqueCategories.includes(category)) {
      uniqueCategories.push(category);
    }
  }

  return uniqueCategories.slice(0, 15); // Return up to 15 categories per country
};
