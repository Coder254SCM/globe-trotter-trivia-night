// Factual data for all countries - no AI needed, just facts
export interface CountryFacts {
  id: string;
  name: string;
  capital: string;
  continent: string;
  population: number;
  area: number;
  languages: string[];
  currency: string;
  independence: number | null;
  government: string;
  majorCities: string[];
  landmarks: string[];
  neighbors: string[];
  climate: string;
  religion: string;
  economy: string[];
}

export const countryFacts: Record<string, CountryFacts> = {
  afghanistan: {
    id: 'afghanistan',
    name: 'Afghanistan',
    capital: 'Kabul',
    continent: 'Asia',
    population: 38928346,
    area: 652230,
    languages: ['Pashto', 'Dari'],
    currency: 'Afghan Afghani',
    independence: 1919,
    government: 'Islamic Republic',
    majorCities: ['Kabul', 'Kandahar', 'Herat', 'Mazar-i-Sharif'],
    landmarks: ['Band-e-Amir National Park', 'Bamiyan Buddhas', 'Blue Mosque'],
    neighbors: ['Pakistan', 'Iran', 'Turkmenistan', 'Uzbekistan', 'Tajikistan', 'China'],
    climate: 'Arid continental',
    religion: 'Islam',
    economy: ['Agriculture', 'Mining', 'Textiles']
  },
  albania: {
    id: 'albania',
    name: 'Albania',
    capital: 'Tirana',
    continent: 'Europe',
    population: 2877797,
    area: 28748,
    languages: ['Albanian'],
    currency: 'Albanian Lek',
    independence: 1912,
    government: 'Parliamentary Republic',
    majorCities: ['Tirana', 'Durrës', 'Vlorë', 'Shkodër'],
    landmarks: ['Butrint', 'Gjirokastër', 'Berat'],
    neighbors: ['Montenegro', 'Kosovo', 'North Macedonia', 'Greece'],
    climate: 'Mediterranean',
    religion: 'Islam',
    economy: ['Tourism', 'Agriculture', 'Mining']
  },
  algeria: {
    id: 'algeria',
    name: 'Algeria',
    capital: 'Algiers',
    continent: 'Africa',
    population: 43851044,
    area: 2381741,
    languages: ['Arabic', 'Berber'],
    currency: 'Algerian Dinar',
    independence: 1962,
    government: 'Presidential Republic',
    majorCities: ['Algiers', 'Oran', 'Constantine', 'Annaba'],
    landmarks: ['Sahara Desert', 'Kasbah of Algiers', 'Tassili n\'Ajjer'],
    neighbors: ['Morocco', 'Tunisia', 'Libya', 'Niger', 'Mali', 'Mauritania'],
    climate: 'Mediterranean and arid',
    religion: 'Islam',
    economy: ['Oil', 'Natural Gas', 'Mining']
  }
  // Add more countries as needed
};

export const getCountryFact = (countryId: string): CountryFacts | null => {
  return countryFacts[countryId] || null;
};

export const getAllCountryIds = (): string[] => {
  return Object.keys(countryFacts);
};