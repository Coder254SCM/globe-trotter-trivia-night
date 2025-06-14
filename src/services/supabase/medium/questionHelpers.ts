
import { ServiceCountry } from "./types";

export class QuestionHelpers {
  static getClimateType(country: ServiceCountry): string {
    if (country.continent === 'Africa') return 'Tropical';
    if (country.continent === 'Europe') return 'Temperate';
    if (country.continent === 'Asia') return 'Continental';
    return 'Varied climate zones';
  }

  static getIndependenceYear(country: ServiceCountry): string {
    // Most African countries: 1960s, Most Asian: 1940s-1960s, etc.
    if (country.continent === 'Africa') return '1960';
    if (country.continent === 'Asia') return '1947';
    return '1950';
  }

  static getColonialPower(country: ServiceCountry): string {
    if (country.continent === 'Africa') return 'France';
    if (country.continent === 'Asia') return 'Britain';
    if (country.continent === 'South America') return 'Spain';
    return 'European powers';
  }

  static getOfficialLanguage(country: ServiceCountry): string {
    if (country.continent === 'Africa') return 'French';
    if (country.continent === 'South America') return 'Spanish';
    if (country.continent === 'Asia') return 'Local language';
    return 'National language';
  }

  static getTraditionalDish(country: ServiceCountry): string {
    return `Traditional ${country.name} cuisine`;
  }

  static getCurrency(country: ServiceCountry): string {
    if (country.continent === 'Europe') return 'Euro';
    return `${country.name} currency`;
  }

  static getMainEconomicSector(country: ServiceCountry): string {
    if (country.continent === 'Africa') return 'Agriculture';
    if (country.continent === 'Asia') return 'Services';
    return 'Mixed economy';
  }

  static getLandscapeType(country: ServiceCountry): string {
    if (country.continent === 'Africa') return 'Savanna';
    if (country.continent === 'Asia') return 'Plains';
    return 'Varied terrain';
  }

  static getNaturalResource(country: ServiceCountry): string {
    if (country.continent === 'Africa') return 'Minerals';
    if (country.continent === 'Asia') return 'Agricultural products';
    return 'Natural resources';
  }
}
