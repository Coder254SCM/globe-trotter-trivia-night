
import { ServiceCountry } from "./types";

export class QuestionHelpers {
  static getClimateType(country: ServiceCountry): string {
    // Africa climate patterns
    if (country.continent === 'Africa') {
      if (['Egypt', 'Libya', 'Algeria', 'Morocco', 'Tunisia', 'Sudan'].includes(country.name)) {
        return 'Arid desert climate';
      }
      if (['Nigeria', 'Ghana', 'Ivory Coast', 'Cameroon'].includes(country.name)) {
        return 'Tropical climate';
      }
      if (['Kenya', 'Tanzania', 'Uganda'].includes(country.name)) {
        return 'Tropical savanna climate';
      }
      return 'Tropical climate';
    }
    
    // Europe climate patterns
    if (country.continent === 'Europe') {
      if (['Norway', 'Sweden', 'Finland'].includes(country.name)) {
        return 'Subarctic climate';
      }
      if (['Spain', 'Italy', 'Greece'].includes(country.name)) {
        return 'Mediterranean climate';
      }
      return 'Temperate oceanic climate';
    }
    
    // Asia climate patterns
    if (country.continent === 'Asia') {
      if (['India', 'Bangladesh', 'Myanmar'].includes(country.name)) {
        return 'Monsoon climate';
      }
      if (['Saudi Arabia', 'UAE', 'Qatar'].includes(country.name)) {
        return 'Hot desert climate';
      }
      if (['Russia', 'Mongolia'].includes(country.name)) {
        return 'Continental climate';
      }
      return 'Varied climate zones';
    }
    
    return 'Temperate climate';
  }

  static getIndependenceYear(country: ServiceCountry): string {
    // Real independence years for major countries
    const independenceYears: { [key: string]: string } = {
      'India': '1947',
      'Pakistan': '1947',
      'Indonesia': '1945',
      'Philippines': '1946',
      'Malaysia': '1957',
      'Nigeria': '1960',
      'Kenya': '1963',
      'Ghana': '1957',
      'Algeria': '1962',
      'Morocco': '1956',
      'Tunisia': '1956',
      'Egypt': '1922',
      'South Africa': '1961',
      'Brazil': '1822',
      'Mexico': '1821',
      'Argentina': '1816',
      'Chile': '1818',
      'Colombia': '1810',
      'Venezuela': '1811'
    };
    
    return independenceYears[country.name] || '1960';
  }

  static getColonialPower(country: ServiceCountry): string {
    // Real colonial history
    const colonialPowers: { [key: string]: string } = {
      'India': 'Britain',
      'Pakistan': 'Britain',
      'Bangladesh': 'Britain',
      'Nigeria': 'Britain',
      'Kenya': 'Britain',
      'South Africa': 'Britain',
      'Ghana': 'Britain',
      'Algeria': 'France',
      'Morocco': 'France',
      'Tunisia': 'France',
      'Senegal': 'France',
      'Mali': 'France',
      'Indonesia': 'Netherlands',
      'Philippines': 'Spain',
      'Brazil': 'Portugal',
      'Angola': 'Portugal',
      'Mozambique': 'Portugal'
    };
    
    return colonialPowers[country.name] || 'European powers';
  }

  static getOfficialLanguage(country: ServiceCountry): string {
    // Real official languages
    const languages: { [key: string]: string } = {
      'France': 'French',
      'Germany': 'German',
      'Spain': 'Spanish',
      'Italy': 'Italian',
      'Portugal': 'Portuguese',
      'Brazil': 'Portuguese',
      'Mexico': 'Spanish',
      'Argentina': 'Spanish',
      'China': 'Mandarin Chinese',
      'Japan': 'Japanese',
      'South Korea': 'Korean',
      'India': 'Hindi and English',
      'Pakistan': 'Urdu',
      'Bangladesh': 'Bengali',
      'Indonesia': 'Indonesian',
      'Nigeria': 'English',
      'Kenya': 'Swahili and English',
      'South Africa': 'Multiple official languages',
      'Egypt': 'Arabic',
      'Saudi Arabia': 'Arabic'
    };
    
    return languages[country.name] || 'Local language';
  }

  static getTraditionalDish(country: ServiceCountry): string {
    // Real traditional dishes
    const dishes: { [key: string]: string } = {
      'Italy': 'Pasta and pizza',
      'France': 'Coq au vin',
      'Spain': 'Paella',
      'Mexico': 'Tacos and mole',
      'India': 'Curry and rice',
      'China': 'Fried rice and dumplings',
      'Japan': 'Sushi and ramen',
      'Thailand': 'Pad Thai',
      'Brazil': 'Feijoada',
      'Argentina': 'Asado (barbecue)',
      'Nigeria': 'Jollof rice',
      'Morocco': 'Tagine',
      'Egypt': 'Ful medames',
      'Greece': 'Moussaka',
      'Turkey': 'Kebab'
    };
    
    return dishes[country.name] || `Traditional ${country.name} cuisine`;
  }

  static getCurrency(country: ServiceCountry): string {
    // Real currencies
    const currencies: { [key: string]: string } = {
      'United States': 'US Dollar',
      'United Kingdom': 'British Pound',
      'Japan': 'Japanese Yen',
      'China': 'Chinese Yuan',
      'India': 'Indian Rupee',
      'Brazil': 'Brazilian Real',
      'Russia': 'Russian Ruble',
      'South Korea': 'South Korean Won',
      'Mexico': 'Mexican Peso',
      'Canada': 'Canadian Dollar',
      'Australia': 'Australian Dollar',
      'Switzerland': 'Swiss Franc',
      'Norway': 'Norwegian Krone',
      'Sweden': 'Swedish Krona',
      'Denmark': 'Danish Krone'
    };
    
    // Euro countries
    const euroCountries = ['Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Austria', 'Portugal', 'Ireland', 'Greece', 'Finland'];
    if (euroCountries.includes(country.name)) {
      return 'Euro';
    }
    
    return currencies[country.name] || `${country.name} national currency`;
  }

  static getMainEconomicSector(country: ServiceCountry): string {
    // Real economic sectors
    const sectors: { [key: string]: string } = {
      'United States': 'Services and technology',
      'Germany': 'Manufacturing and automotive',
      'Japan': 'Technology and manufacturing',
      'China': 'Manufacturing and services',
      'India': 'Services and information technology',
      'Brazil': 'Agriculture and mining',
      'Russia': 'Energy and natural resources',
      'Saudi Arabia': 'Oil and petroleum',
      'UAE': 'Oil and financial services',
      'Norway': 'Oil and maritime',
      'Nigeria': 'Oil and agriculture',
      'South Africa': 'Mining and agriculture',
      'Australia': 'Mining and agriculture',
      'Canada': 'Natural resources and services'
    };
    
    return sectors[country.name] || 'Mixed economy';
  }

  static getLandscapeType(country: ServiceCountry): string {
    // Real landscape types
    const landscapes: { [key: string]: string } = {
      'Russia': 'Vast plains and forests',
      'Canada': 'Forests and tundra',
      'Brazil': 'Rainforests and plains',
      'Australia': 'Deserts and coastlines',
      'China': 'Mountains and plains',
      'India': 'Plains and plateaus',
      'United States': 'Diverse terrain',
      'Argentina': 'Pampas grasslands',
      'Kazakhstan': 'Steppes',
      'Mongolia': 'Steppes and desert',
      'Chad': 'Sahara desert',
      'Niger': 'Sahara desert',
      'Norway': 'Fjords and mountains',
      'Switzerland': 'Alpine mountains'
    };
    
    return landscapes[country.name] || 'Varied terrain';
  }

  static getNaturalResource(country: ServiceCountry): string {
    // Real natural resources
    const resources: { [key: string]: string } = {
      'Saudi Arabia': 'Oil reserves',
      'Russia': 'Natural gas and oil',
      'Venezuela': 'Oil reserves',
      'Iran': 'Oil and natural gas',
      'Iraq': 'Oil reserves',
      'Kuwait': 'Oil reserves',
      'Norway': 'Oil and natural gas',
      'Australia': 'Iron ore and coal',
      'Brazil': 'Iron ore and coffee',
      'Chile': 'Copper',
      'Peru': 'Copper and gold',
      'South Africa': 'Gold and diamonds',
      'Botswana': 'Diamonds',
      'Nigeria': 'Oil and natural gas',
      'Ghana': 'Gold and cocoa',
      'Indonesia': 'Palm oil and coal'
    };
    
    return resources[country.name] || 'Natural resources';
  }
}
