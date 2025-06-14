
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
    'North America': ['Sports', 'Entertainment', 'Technology', 'Indigenous Culture', 'Industry'],
    'South America': ['Music', 'Dance', 'Environment', 'Indigenous Peoples', 'Natural Wonders'],
    'Oceania': ['Environment', 'Indigenous Culture', 'Wildlife', 'Natural Wonders', 'Sports']
  };

  // Country-specific additional categories
  const countrySpecificCategories: Record<string, QuestionCategory[]> = {
    'United States': ['Space Technology', 'Cinema', 'Innovation'],
    'China': ['Ancient Civilization', 'Martial Arts', 'Tea Culture'],
    'India': ['Spirituality', 'Yoga', 'Spices'],
    'France': ['Wine', 'Fashion', 'Cuisine'],
    'Japan': ['Anime', 'Martial Arts', 'Technology'],
    'Brazil': ['Football', 'Carnival', 'Rainforest'],
    'Egypt': ['Ancient History', 'Archaeology', 'Desert'],
    'Australia': ['Wildlife', 'Surfing', 'Outback'],
    'Russia': ['Space', 'Literature', 'Ballet'],
    'Italy': ['Art', 'Cuisine', 'Fashion'],
    'Germany': ['Engineering', 'Beer', 'Classical Music'],
    'Spain': ['Flamenco', 'Bullfighting', 'Cuisine'],
    'Mexico': ['Ancient Civilizations', 'Day of the Dead', 'Mariachi'],
    'Canada': ['Ice Hockey', 'Maple Syrup', 'Wilderness'],
    'United Kingdom': ['Literature', 'Monarchy', 'Tea'],
    'South Korea': ['K-Pop', 'Technology', 'Martial Arts'],
    'Nigeria': ['Nollywood', 'Oil', 'Diverse Cultures'],
    'Kenya': ['Safari', 'Running', 'Maasai Culture'],
    'Morocco': ['Spices', 'Carpets', 'Architecture'],
    'Thailand': ['Buddhism', 'Cuisine', 'Elephants'],
    'Greece': ['Ancient Philosophy', 'Mythology', 'Islands'],
    'Norway': ['Fjords', 'Vikings', 'Oil'],
    'Switzerland': ['Chocolate', 'Banking', 'Alps'],
    'Netherlands': ['Tulips', 'Windmills', 'Cycling'],
    'Argentina': ['Tango', 'Beef', 'Football'],
    'Peru': ['Inca Heritage', 'Cuisine', 'Llamas'],
    'South Africa': ['Mining', 'Wine', 'Safari']
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
    'Science', 'Education', 'Healthcare', 'Transportation', 'Agriculture',
    'Tourism', 'Festivals', 'Traditions', 'Military History', 'Demographics',
    'Climate', 'Natural Parks', 'Banking', 'Industry', 'Media'
  ];
  
  for (const category of additionalCategories) {
    if (uniqueCategories.length >= 12) break;
    if (!uniqueCategories.includes(category)) {
      uniqueCategories.push(category);
    }
  }

  return uniqueCategories.slice(0, 15); // Return up to 15 categories per country
};
