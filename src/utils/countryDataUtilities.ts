
import { Country, Question } from "../types/quiz";

/**
 * Creates a base set of generic questions for any country
 * @param country The country object
 * @returns An array of generic questions about the country
 */
export const generateGenericCountryQuestions = (country: Country): Question[] => {
  const continents = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania", "Antarctica"];
  const questions: Question[] = [];
  
  // Question 1: Capital City
  questions.push({
    id: `${country.id}-capital`,
    type: "multiple-choice",
    text: `What is the capital city of ${country.name}?`,
    choices: generateFakeCapitalChoices(country.name),
    category: "Geography",
    explanation: `The capital city of ${country.name} is an important political and cultural center for the country.`,
    difficulty: "medium",
    lastUpdated: new Date().toISOString()
  });

  // Question 2: Continent
  questions.push({
    id: `${country.id}-continent`,
    type: "multiple-choice",
    text: `On which continent is ${country.name} located?`,
    choices: [
      { 
        id: "a", 
        text: country.continent,
        isCorrect: true 
      },
      ...continents
        .filter(c => c !== country.continent)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((text, index) => ({
          id: String.fromCharCode(98 + index),
          text,
          isCorrect: false
        }))
    ],
    category: "Geography",
    explanation: `${country.name} is located on the continent of ${country.continent}.`,
    difficulty: "easy",
    lastUpdated: new Date().toISOString()
  });

  // Question 3: Flag
  if (country.flagImageUrl) {
    questions.push({
      id: `${country.id}-flag`,
      type: "image",
      text: `Which country does this flag belong to?`,
      imageUrl: country.flagImageUrl,
      choices: [
        { id: "a", text: country.name, isCorrect: true },
        { id: "b", text: generateRandomCountryName(country.name, country.continent), isCorrect: false },
        { id: "c", text: generateRandomCountryName(country.name, country.continent), isCorrect: false },
        { id: "d", text: generateRandomCountryName(country.name, country.continent), isCorrect: false }
      ],
      category: "Geography",
      explanation: `This is the flag of ${country.name}.`,
      difficulty: "medium",
      lastUpdated: new Date().toISOString()
    });
  }

  // Question 4: Flag recognition
  questions.push({
    id: `${country.id}-flag-recognition`,
    type: "multiple-choice",
    text: `Which of these colors is NOT found on the flag of ${country.name}?`,
    choices: generateFlagColorChoices(country.name),
    category: "Geography",
    explanation: `The flag of ${country.name} is an important national symbol.`,
    difficulty: "medium",
    lastUpdated: new Date().toISOString()
  });

  // Question 5: Map location
  if (country.mapImageUrl) {
    questions.push({
      id: `${country.id}-map`,
      type: "image",
      text: `Which country is highlighted on this map?`,
      imageUrl: country.mapImageUrl,
      choices: [
        { id: "a", text: country.name, isCorrect: true },
        { id: "b", text: generateRandomCountryName(country.name, country.continent), isCorrect: false },
        { id: "c", text: generateRandomCountryName(country.name, country.continent), isCorrect: false },
        { id: "d", text: generateRandomCountryName(country.name, country.continent), isCorrect: false }
      ],
      category: "Geography",
      explanation: `This map shows the location of ${country.name} in ${country.continent}.`,
      difficulty: "medium",
      lastUpdated: new Date().toISOString()
    });
  }

  // Question 6: Cultural question
  if (country.categories.includes("Culture")) {
    questions.push({
      id: `${country.id}-culture`,
      type: "multiple-choice",
      text: `Which of the following is ${country.name} known for?`,
      choices: generateCulturalChoices(country),
      category: "Culture",
      explanation: `${country.name} has a rich and diverse cultural heritage with many unique aspects.`,
      difficulty: "medium",
      lastUpdated: new Date().toISOString()
    });
  }

  // Question 7: Language question
  questions.push({
    id: `${country.id}-language`,
    type: "multiple-choice",
    text: `Which language is most likely to be spoken in ${country.name}?`,
    choices: generateLanguageChoices(country),
    category: "Language",
    explanation: `Language is an important part of ${country.name}'s cultural identity.`,
    difficulty: "medium",
    lastUpdated: new Date().toISOString()
  });
  
  // Question 8: Neighboring countries
  questions.push({
    id: `${country.id}-neighbors`,
    type: "multiple-choice",
    text: `Which of these countries is most likely to share a border with ${country.name}?`,
    choices: generateNeighborChoices(country),
    category: "Geography",
    explanation: `Understanding the geographical position of ${country.name} and its neighboring countries is important for geopolitical context.`,
    difficulty: "medium",
    lastUpdated: new Date().toISOString()
  });

  // Question 9: Main exports or economic activity
  questions.push({
    id: `${country.id}-economy`,
    type: "multiple-choice",
    text: `Which of the following is likely to be a major economic activity in ${country.name}?`,
    choices: generateEconomicChoices(country),
    category: "Economy",
    explanation: `This economic activity is significant for ${country.name}'s economy based on its geographical location and resources.`,
    difficulty: "medium",
    lastUpdated: new Date().toISOString()
  });
  
  return questions;
};

/**
 * Generate fake capital choices for a country
 */
function generateFakeCapitalChoices(countryName: string): { id: string, text: string, isCorrect: boolean }[] {
  // This is a simplified implementation - in a real app, we would use actual capital data
  const capitals: Record<string, string> = {
    "United States": "Washington D.C.",
    "United Kingdom": "London",
    "France": "Paris",
    "Germany": "Berlin",
    "Italy": "Rome",
    "Spain": "Madrid",
    "Japan": "Tokyo",
    "China": "Beijing",
    "India": "New Delhi",
    "Brazil": "Brasília",
    "Mexico": "Mexico City",
    "Canada": "Ottawa",
    "Australia": "Canberra",
    "New Zealand": "Wellington",
    "Russia": "Moscow",
    "South Africa": "Pretoria",
    "Egypt": "Cairo",
    "Kenya": "Nairobi",
    "Nigeria": "Abuja",
    "Thailand": "Bangkok",
    "Vietnam": "Hanoi",
    "Argentina": "Buenos Aires",
    "Indonesia": "Jakarta",
    "Malaysia": "Kuala Lumpur",
    "Colombia": "Bogotá",
    "Turkey": "Ankara",
    "Saudi Arabia": "Riyadh",
    "Israel": "Jerusalem",
    "United Arab Emirates": "Abu Dhabi",
    "Iran": "Tehran",
    "Kazakhstan": "Nur-Sultan",
    "Uzbekistan": "Tashkent",
    "Kyrgyzstan": "Bishkek",
    "South Korea": "Seoul",
    "Singapore": "Singapore"
  };
  
  // If we don't have the country in our list, create a fake capital
  const correctCapital = capitals[countryName] || `${countryName} City`;
  
  // Get other random capitals from our list
  const otherCapitals = Object.values(capitals)
    .filter(capital => capital !== correctCapital)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  return [
    { id: "a", text: correctCapital, isCorrect: true },
    { id: "b", text: otherCapitals[0] || "Stockholm", isCorrect: false },
    { id: "c", text: otherCapitals[1] || "Athens", isCorrect: false },
    { id: "d", text: otherCapitals[2] || "Vienna", isCorrect: false }
  ].sort(() => Math.random() - 0.5);
}

/**
 * Generate a random country name that's not the given country
 */
function generateRandomCountryName(countryToAvoid: string, continent: string): string {
  const countriesByContinent: Record<string, string[]> = {
    "Africa": ["Kenya", "South Africa", "Egypt", "Nigeria", "Morocco", "Ethiopia", "Ghana", "Tanzania", "Algeria", "Tunisia"],
    "Europe": ["France", "Germany", "Italy", "Spain", "United Kingdom", "Greece", "Sweden", "Norway", "Netherlands", "Belgium"],
    "Asia": ["Japan", "China", "India", "Thailand", "Vietnam", "South Korea", "Indonesia", "Malaysia", "Philippines", "Singapore"],
    "North America": ["United States", "Canada", "Mexico", "Cuba", "Panama", "Costa Rica", "Jamaica", "Dominican Republic"],
    "South America": ["Brazil", "Argentina", "Colombia", "Peru", "Chile", "Venezuela", "Ecuador", "Uruguay"],
    "Oceania": ["Australia", "New Zealand", "Fiji", "Papua New Guinea", "Solomon Islands", "Vanuatu"],
    "Antarctica": ["French Southern Territories", "Heard Island", "South Georgia"]
  };
  
  const continentCountries = countriesByContinent[continent] || 
                            ["France", "Germany", "United States", "Brazil"];
  
  const availableCountries = continentCountries.filter(c => c !== countryToAvoid);
  
  if (availableCountries.length > 0) {
    return availableCountries[Math.floor(Math.random() * availableCountries.length)];
  }
  
  return "Portugal"; // Fallback
}

/**
 * Generate cultural choices for a country
 */
function generateCulturalChoices(country: Country): { id: string, text: string, isCorrect: boolean }[] {
  // Cultural traits by continent (simplified)
  const culturalTraitsByContinent: Record<string, string[]> = {
    "Africa": ["Traditional tribal masks", "Colorful wax print fabrics", "Drum-based music", "Safari tourism", "Indigenous dances"],
    "Europe": ["Classical music", "Renaissance art", "Gothic architecture", "Wine production", "Folklore festivals"],
    "Asia": ["Calligraphy", "Buddhist temples", "Martial arts", "Silk textiles", "Tea ceremonies"],
    "North America": ["Jazz music", "Hollywood films", "Fast food", "Baseball", "Skyscrapers"],
    "South America": ["Carnival celebrations", "Soccer culture", "Salsa dancing", "Rainforest eco-tourism", "Indigenous crafts"],
    "Oceania": ["Aboriginal art", "Polynesian tattoos", "Islander ceremonies", "Surfing", "Marine conservation"],
    "Antarctica": ["Scientific research stations", "Penguin conservation", "Extreme weather adaptation", "Ice shelf studies"]
  };
  
  const continentTraits = culturalTraitsByContinent[country.continent] || 
                          ["Traditional cuisine", "Folk music", "Cultural festivals", "Native arts", "Textiles"];
  
  // Pick one trait that would be correct for this country
  const correctTrait = continentTraits[Math.floor(Math.random() * continentTraits.length)];
  
  // Get incorrect traits from other continents
  const otherContinents = Object.keys(culturalTraitsByContinent).filter(c => c !== country.continent);
  const incorrectTraits: string[] = [];
  
  for (let i = 0; incorrectTraits.length < 3 && i < otherContinents.length; i++) {
    const continent = otherContinents[i];
    const traits = culturalTraitsByContinent[continent] || [];
    if (traits.length > 0) {
      incorrectTraits.push(traits[Math.floor(Math.random() * traits.length)]);
    }
  }
  
  // Fill in any remaining needed choices
  while (incorrectTraits.length < 3) {
    incorrectTraits.push(["Alpine skiing", "Bollywood cinema", "Mariachi music"][incorrectTraits.length]);
  }
  
  return [
    { id: "a", text: correctTrait, isCorrect: true },
    { id: "b", text: incorrectTraits[0], isCorrect: false },
    { id: "c", text: incorrectTraits[1], isCorrect: false },
    { id: "d", text: incorrectTraits[2], isCorrect: false }
  ].sort(() => Math.random() - 0.5);
}

/**
 * Generate flag color choices
 */
function generateFlagColorChoices(countryName: string): { id: string, text: string, isCorrect: boolean }[] {
  // Common flag colors
  const commonColors = ["Red", "Blue", "Green", "Yellow", "White", "Black", "Orange", "Purple"];
  
  // Simplified - we'd use actual flag color data in a real app
  const flagColors: Record<string, string[]> = {
    "United States": ["Red", "White", "Blue"],
    "United Kingdom": ["Red", "White", "Blue"],
    "France": ["Blue", "White", "Red"],
    "Germany": ["Black", "Red", "Yellow"],
    "Japan": ["Red", "White"],
    "Brazil": ["Green", "Yellow", "Blue", "White"],
    "India": ["Orange", "White", "Green", "Blue"],
    "South Africa": ["Red", "Blue", "Green", "Yellow", "Black", "White"],
    "China": ["Red", "Yellow"],
    "Canada": ["Red", "White"],
    "Australia": ["Blue", "Red", "White"],
    "Italy": ["Green", "White", "Red"],
    "Spain": ["Red", "Yellow"],
    "Mexico": ["Green", "White", "Red"],
    "Russia": ["White", "Blue", "Red"],
  };
  
  // If we have the country in our map
  const countryColors = flagColors[countryName] || ["Red", "White", "Blue"];
  
  // Pick a color that is not in the country's flag
  const nonFlagColors = commonColors.filter(color => !countryColors.includes(color));
  const incorrectColor = nonFlagColors.length > 0 
    ? nonFlagColors[Math.floor(Math.random() * nonFlagColors.length)]
    : "Purple"; // Fallback
  
  // Generate choices
  return [
    { id: "a", text: incorrectColor, isCorrect: true },
    { id: "b", text: countryColors[0] || "Red", isCorrect: false },
    { id: "c", text: countryColors[1] || "White", isCorrect: false },
    { id: "d", text: countryColors[2] || "Blue", isCorrect: false }
  ].sort(() => Math.random() - 0.5);
}

/**
 * Generate language choices
 */
function generateLanguageChoices(country: Country): { id: string, text: string, isCorrect: boolean }[] {
  // Simplified language mapping - in a real app, we'd use actual language data
  const languagesByContinent: Record<string, string[]> = {
    "Africa": ["Swahili", "Arabic", "Amharic", "Yoruba", "Zulu", "Hausa"],
    "Europe": ["English", "French", "German", "Spanish", "Italian", "Russian", "Portuguese"],
    "Asia": ["Mandarin", "Hindi", "Japanese", "Korean", "Arabic", "Thai", "Vietnamese"],
    "North America": ["English", "Spanish", "French", "Navajo", "Inuktitut"],
    "South America": ["Spanish", "Portuguese", "Quechua", "Guarani", "Aymara"],
    "Oceania": ["English", "Maori", "Samoan", "Fijian", "Hawaiian"],
    "Antarctica": ["English", "Russian", "Spanish", "French"] // Research base languages
  };
  
  const languagesByCountry: Record<string, string> = {
    "United States": "English",
    "United Kingdom": "English",
    "France": "French",
    "Germany": "German",
    "Spain": "Spanish",
    "China": "Mandarin",
    "Japan": "Japanese",
    "India": "Hindi",
    "Brazil": "Portuguese",
    "Russia": "Russian",
    "Mexico": "Spanish",
    "Italy": "Italian",
    "South Korea": "Korean",
    "Australia": "English",
    "Canada": "English and French",
    "Saudi Arabia": "Arabic",
    "Turkey": "Turkish",
    "Israel": "Hebrew",
    "Indonesia": "Indonesian",
    "Thailand": "Thai",
    "Vietnam": "Vietnamese",
    "Malaysia": "Malay",
    "Singapore": "English",
  };
  
  // Get the correct language
  const correctLanguage = languagesByCountry[country.name] || 
    languagesByContinent[country.continent]?.[0] || "English";
  
  // Get incorrect options from other continents
  const otherLanguages = Object.values(languagesByContinent)
    .flat()
    .filter(lang => lang !== correctLanguage)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  return [
    { id: "a", text: correctLanguage, isCorrect: true },
    { id: "b", text: otherLanguages[0] || "Finnish", isCorrect: false },
    { id: "c", text: otherLanguages[1] || "Tagalog", isCorrect: false },
    { id: "d", text: otherLanguages[2] || "Welsh", isCorrect: false }
  ].sort(() => Math.random() - 0.5);
}

/**
 * Generate neighbor country choices
 */
function generateNeighborChoices(country: Country): { id: string, text: string, isCorrect: boolean }[] {
  // For simplicity, we'll use geographical proximity by continent
  // In a real app, we'd have actual border data
  
  const regionByContinent: Record<string, Record<string, string[]>> = {
    "Europe": {
      "Western Europe": ["France", "Germany", "Netherlands", "Belgium", "Luxembourg"],
      "Eastern Europe": ["Poland", "Ukraine", "Romania", "Hungary", "Czech Republic"],
      "Southern Europe": ["Spain", "Italy", "Greece", "Portugal", "Croatia"],
      "Northern Europe": ["United Kingdom", "Sweden", "Norway", "Denmark", "Finland"]
    },
    "Asia": {
      "East Asia": ["China", "Japan", "South Korea", "North Korea", "Mongolia"],
      "South Asia": ["India", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal"],
      "Southeast Asia": ["Thailand", "Vietnam", "Malaysia", "Indonesia", "Philippines"],
      "West Asia": ["Saudi Arabia", "Turkey", "Iran", "Israel", "United Arab Emirates"],
      "Central Asia": ["Kazakhstan", "Uzbekistan", "Kyrgyzstan", "Tajikistan", "Turkmenistan"]
    },
    "Africa": {
      "North Africa": ["Morocco", "Algeria", "Tunisia", "Libya", "Egypt"],
      "East Africa": ["Kenya", "Ethiopia", "Tanzania", "Uganda", "Somalia"],
      "West Africa": ["Nigeria", "Ghana", "Senegal", "Ivory Coast", "Mali"],
      "Southern Africa": ["South Africa", "Namibia", "Botswana", "Zimbabwe", "Mozambique"]
    },
    "North America": {
      "Northern": ["Canada", "United States"],
      "Central": ["Mexico", "Guatemala", "Honduras", "El Salvador", "Nicaragua"],
      "Caribbean": ["Cuba", "Jamaica", "Haiti", "Dominican Republic", "Puerto Rico"]
    },
    "South America": {
      "Northern": ["Colombia", "Venezuela", "Guyana", "Suriname"],
      "Western": ["Peru", "Ecuador", "Bolivia"],
      "Eastern": ["Brazil", "Uruguay", "Paraguay"],
      "Southern": ["Argentina", "Chile"]
    },
    "Oceania": {
      "Australasia": ["Australia", "New Zealand"],
      "Melanesia": ["Papua New Guinea", "Fiji", "Solomon Islands", "Vanuatu"],
      "Polynesia": ["Samoa", "Tonga", "Cook Islands", "French Polynesia"]
    }
  };
  
  // Find the region of the country
  let countryRegion = "";
  let regionCountries: string[] = [];
  
  for (const [continent, regions] of Object.entries(regionByContinent)) {
    if (continent === country.continent) {
      for (const [region, countries] of Object.entries(regions)) {
        if (countries.includes(country.name)) {
          countryRegion = region;
          regionCountries = countries;
          break;
        }
      }
    }
  }
  
  // If we couldn't find the country in any region, use the continent
  if (!countryRegion) {
    regionCountries = Object.values(regionByContinent[country.continent] || {}).flat();
  }
  
  // Remove the country itself from the list
  regionCountries = regionCountries.filter(c => c !== country.name);
  
  // Pick a likely neighbor
  const correctNeighbor = regionCountries.length > 0
    ? regionCountries[Math.floor(Math.random() * regionCountries.length)]
    : "Other country";
  
  // Get countries from other continents as incorrect choices
  const otherContinents = Object.keys(regionByContinent).filter(c => c !== country.continent);
  const farCountries: string[] = [];
  
  for (const continent of otherContinents) {
    const continentCountries = Object.values(regionByContinent[continent] || {}).flat();
    if (continentCountries.length > 0) {
      farCountries.push(continentCountries[Math.floor(Math.random() * continentCountries.length)]);
      if (farCountries.length === 3) break;
    }
  }
  
  // Fill in any remaining choices
  while (farCountries.length < 3) {
    farCountries.push(["Iceland", "New Zealand", "Madagascar"][farCountries.length]);
  }
  
  return [
    { id: "a", text: correctNeighbor, isCorrect: true },
    { id: "b", text: farCountries[0], isCorrect: false },
    { id: "c", text: farCountries[1], isCorrect: false },
    { id: "d", text: farCountries[2], isCorrect: false }
  ].sort(() => Math.random() - 0.5);
}

/**
 * Generate economic activity choices
 */
function generateEconomicChoices(country: Country): { id: string, text: string, isCorrect: boolean }[] {
  // Simplified economic activities by geography
  const economicActivities: Record<string, Record<string, string[]>> = {
    "Africa": {
      "North Africa": ["Oil and gas production", "Tourism", "Agriculture", "Textiles"],
      "East Africa": ["Coffee production", "Tourism", "Tea cultivation", "Wildlife conservation"],
      "West Africa": ["Cocoa farming", "Oil production", "Mining", "Textiles"],
      "Southern Africa": ["Mining", "Vineyards", "Tourism", "Manufacturing"]
    },
    "Asia": {
      "East Asia": ["Electronics manufacturing", "Automotive industry", "Shipbuilding", "Technology"],
      "South Asia": ["Textile production", "IT services", "Agriculture", "Pharmaceuticals"],
      "Southeast Asia": ["Tourism", "Rice cultivation", "Electronics manufacturing", "Rubber production"],
      "West Asia": ["Oil and gas production", "Finance", "Tourism", "Construction"],
      "Central Asia": ["Mining", "Oil and gas", "Cotton production", "Animal husbandry"]
    },
    "Europe": {
      "Western Europe": ["Automotive industry", "Banking", "Tourism", "Technology"],
      "Eastern Europe": ["Manufacturing", "Agriculture", "Tourism", "IT outsourcing"],
      "Southern Europe": ["Tourism", "Wine production", "Olive oil", "Shipping"],
      "Northern Europe": ["Renewable energy", "IT services", "Fishing", "Design"]
    },
    "North America": {
      "Northern": ["Technology", "Finance", "Automotive", "Agriculture"],
      "Central": ["Tourism", "Agriculture", "Manufacturing", "Mining"],
      "Caribbean": ["Tourism", "Offshore banking", "Agriculture", "Fishing"]
    },
    "South America": {
      "Northern": ["Oil production", "Mining", "Coffee growing", "Tourism"],
      "Western": ["Mining", "Agriculture", "Fishing", "Tourism"],
      "Eastern": ["Agriculture", "Manufacturing", "Tourism", "Animal husbandry"],
      "Southern": ["Wine production", "Agriculture", "Tourism", "Mining"]
    },
    "Oceania": {
      "Australasia": ["Mining", "Agriculture", "Tourism", "Education"],
      "Melanesia": ["Mining", "Forestry", "Fishing", "Tourism"],
      "Polynesia": ["Tourism", "Fishing", "Agriculture", "Handicrafts"]
    },
    "Antarctica": {
      "General": ["Scientific research", "Tourism", "Fishing", "Conservation"]
    }
  };
  
  // Find economic activities for the country's region
  let correctActivities: string[] = [];
  
  for (const [continent, regions] of Object.entries(economicActivities)) {
    if (continent === country.continent) {
      for (const [region, activities] of Object.entries(regions)) {
        // Use general continent activities if we can't find the specific region
        correctActivities = activities;
        break;
      }
    }
  }
  
  if (correctActivities.length === 0) {
    correctActivities = ["Agriculture", "Manufacturing", "Tourism", "Finance"];
  }
  
  // Pick a likely economic activity
  const correctActivity = correctActivities[Math.floor(Math.random() * correctActivities.length)];
  
  // Get activities from other continents as incorrect choices
  const otherContinents = Object.keys(economicActivities).filter(c => c !== country.continent);
  const otherActivities: string[] = [];
  
  for (const continent of otherContinents) {
    const continentActivities = Object.values(economicActivities[continent] || {})
      .flat()
      .filter(activity => !correctActivities.includes(activity));
    
    if (continentActivities.length > 0) {
      otherActivities.push(continentActivities[Math.floor(Math.random() * continentActivities.length)]);
      if (otherActivities.length === 3) break;
    }
  }
  
  // Fill in any remaining choices
  while (otherActivities.length < 3) {
    const fillers = ["Diamond mining", "Spacecraft manufacturing", "Penguin research"];
    const filler = fillers[otherActivities.length];
    if (!correctActivities.includes(filler) && !otherActivities.includes(filler)) {
      otherActivities.push(filler);
    }
  }
  
  return [
    { id: "a", text: correctActivity, isCorrect: true },
    { id: "b", text: otherActivities[0], isCorrect: false },
    { id: "c", text: otherActivities[1], isCorrect: false },
    { id: "d", text: otherActivities[2], isCorrect: false }
  ].sort(() => Math.random() - 0.5);
}
