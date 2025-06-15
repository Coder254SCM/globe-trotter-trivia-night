
import { Country } from "../supabase/country/countryTypes";
import { CAPITAL_ALTERNATIVES, CONTINENT_ALTERNATIVES, getUniqueOptions, shuffle } from "./templateData";

// Real capital cities for major countries
const REAL_CAPITALS: Record<string, string> = {
  'afghanistan': 'Kabul',
  'albania': 'Tirana',
  'algeria': 'Algiers',
  'andorra': 'Andorra la Vella',
  'angola': 'Luanda',
  'argentina': 'Buenos Aires',
  'armenia': 'Yerevan',
  'australia': 'Canberra',
  'austria': 'Vienna',
  'azerbaijan': 'Baku',
  'bahrain': 'Manama',
  'bangladesh': 'Dhaka',
  'belarus': 'Minsk',
  'belgium': 'Brussels',
  'benin': 'Porto-Novo',
  'bolivia': 'Sucre',
  'brazil': 'Brasília',
  'bulgaria': 'Sofia',
  'cameroon': 'Yaoundé',
  'canada': 'Ottawa',
  'chad': 'N\'Djamena',
  'chile': 'Santiago',
  'china': 'Beijing',
  'colombia': 'Bogotá',
  'croatia': 'Zagreb',
  'cuba': 'Havana',
  'denmark': 'Copenhagen',
  'egypt': 'Cairo',
  'ethiopia': 'Addis Ababa',
  'finland': 'Helsinki',
  'france': 'Paris',
  'germany': 'Berlin',
  'ghana': 'Accra',
  'greece': 'Athens',
  'india': 'New Delhi',
  'indonesia': 'Jakarta',
  'iran': 'Tehran',
  'iraq': 'Baghdad',
  'ireland': 'Dublin',
  'israel': 'Jerusalem',
  'italy': 'Rome',
  'japan': 'Tokyo',
  'jordan': 'Amman',
  'kenya': 'Nairobi',
  'lebanon': 'Beirut',
  'libya': 'Tripoli',
  'malaysia': 'Kuala Lumpur',
  'mexico': 'Mexico City',
  'morocco': 'Rabat',
  'netherlands': 'Amsterdam',
  'nigeria': 'Abuja',
  'norway': 'Oslo',
  'pakistan': 'Islamabad',
  'peru': 'Lima',
  'poland': 'Warsaw',
  'portugal': 'Lisbon',
  'romania': 'Bucharest',
  'russia': 'Moscow',
  'saudi-arabia': 'Riyadh',
  'south-africa': 'Cape Town',
  'spain': 'Madrid',
  'sweden': 'Stockholm',
  'switzerland': 'Bern',
  'thailand': 'Bangkok',
  'turkey': 'Ankara',
  'ukraine': 'Kyiv',
  'united-kingdom': 'London',
  'united-states': 'Washington, D.C.',
  'venezuela': 'Caracas',
  'vietnam': 'Hanoi'
};

export function generateGeographyQuestion(country: Country, difficulty: string, seed: number) {
  const realCapital = REAL_CAPITALS[country.id] || `${country.name} City`;
  
  const questionTypes = [
    // Capital question
    () => ({
      text: `What is the capital city of ${country.name}?`,
      correct: realCapital,
      options: getUniqueOptions(realCapital, [
        'Paris', 'London', 'Berlin', 'Madrid', 'Rome', 'Tokyo', 'Beijing', 'Moscow', 
        'Cairo', 'Delhi', 'Bangkok', 'Jakarta', 'Buenos Aires', 'Mexico City'
      ]),
      explanation: `${realCapital} is the capital city of ${country.name}.`
    }),
    
    // Continent question
    () => ({
      text: `On which continent is ${country.name} located?`,
      correct: country.continent,
      options: shuffle(['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania']).slice(0, 4),
      explanation: `${country.name} is located on the continent of ${country.continent}.`
    }),
    
    // Area question (if we have area data)
    () => {
      const areaOptions = ['50,000', '100,000', '200,000', '500,000'];
      const correctArea = country.area_km2 ? `${Math.round(country.area_km2 / 1000) * 1000}` : '100,000';
      
      return {
        text: `Approximately how large is ${country.name} in square kilometers?`,
        correct: `${correctArea} km²`,
        options: areaOptions.map(area => `${area} km²`),
        explanation: `${country.name} covers approximately ${correctArea} square kilometers.`
      };
    },
    
    // Population question
    () => {
      const popOptions = ['Under 10 million', '10-50 million', '50-100 million', 'Over 100 million'];
      const correctPop = country.population > 100000000 ? 'Over 100 million' :
                        country.population > 50000000 ? '50-100 million' :
                        country.population > 10000000 ? '10-50 million' : 'Under 10 million';
      
      return {
        text: `What is the approximate population of ${country.name}?`,
        correct: correctPop,
        options: shuffle(popOptions),
        explanation: `${country.name} has a population ${correctPop.toLowerCase()}.`
      };
    }
  ];

  // Select question type based on seed and difficulty
  let selectedType;
  if (difficulty === 'easy') {
    selectedType = questionTypes[seed % 2]; // Continent or capital
  } else if (difficulty === 'medium') {
    selectedType = questionTypes[seed % 3]; // Capital, continent, or area
  } else {
    selectedType = questionTypes[seed % questionTypes.length]; // All types
  }
  
  return selectedType();
}
