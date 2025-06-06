
import countries from "../../data/countries";

// Fix the actual country count and data issues
export const getActualCountryStats = () => {
  console.log("🌍 CHECKING ACTUAL COUNTRY DATA...");
  
  const stats = {
    totalCountries: countries.length,
    continentBreakdown: {} as Record<string, number>,
    missingData: [] as string[],
    duplicates: [] as string[]
  };

  // Count by continent
  countries.forEach(country => {
    const continent = country.continent || 'Unknown';
    stats.continentBreakdown[continent] = (stats.continentBreakdown[continent] || 0) + 1;
    
    // Check for missing essential data - removed latitude/longitude check
    if (!country.name) {
      stats.missingData.push(country.id);
    }
  });

  // Check for duplicates
  const names = new Set<string>();
  countries.forEach(country => {
    if (names.has(country.name)) {
      stats.duplicates.push(country.name);
    }
    names.add(country.name);
  });

  console.log("📊 ACTUAL COUNTRY STATS:");
  console.log(`Total Countries: ${stats.totalCountries}`);
  console.log("Continent Breakdown:", stats.continentBreakdown);
  console.log(`Missing Data: ${stats.missingData.length}`);
  console.log(`Duplicates: ${stats.duplicates.length}`);
  
  // The knowledge base says we should have 195 countries
  if (stats.totalCountries < 195) {
    console.error(`🚨 MISSING COUNTRIES: We only have ${stats.totalCountries} out of 195 expected countries!`);
  }

  return stats;
};

// Generate placeholder questions for countries without proper question sets
export const generatePlaceholderQuestions = (countryId: string) => {
  const country = countries.find(c => c.id === countryId);
  if (!country) return [];

  return [
    {
      id: `${countryId}-capital-basic`,
      type: "multiple-choice" as const,
      text: `What is the capital of ${country.name}?`,
      choices: [
        { id: "a", text: "[Needs Research]", isCorrect: true },
        { id: "b", text: "Option B", isCorrect: false },
        { id: "c", text: "Option C", isCorrect: false },
        { id: "d", text: "Option D", isCorrect: false }
      ],
      category: "Geography" as const,
      explanation: `This question needs proper research for ${country.name}.`,
      difficulty: "easy" as const
    },
    {
      id: `${countryId}-location-basic`,
      type: "multiple-choice" as const,
      text: `${country.name} is located in which continent?`,
      choices: [
        { id: "a", text: country.continent, isCorrect: true },
        { id: "b", text: "Different Continent", isCorrect: false },
        { id: "c", text: "Another Continent", isCorrect: false },
        { id: "d", text: "Wrong Continent", isCorrect: false }
      ],
      category: "Geography" as const,
      explanation: `${country.name} is in ${country.continent}.`,
      difficulty: "easy" as const
    }
  ];
};
