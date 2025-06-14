
import { Country as FrontendCountry } from "@/types/quiz";
import { CountryFetcher } from "./country/countryFetcher";
import { CountryPopulator } from "./country/countryPopulator";
import { CountryStats } from "./country/countryStats";

// Re-export types for backward compatibility
export type { Country } from "./country/countryTypes";

export class CountryService {
  // Delegate to specialized classes
  static getAllCountries = CountryFetcher.getAllCountries;
  static populateAllCountries = CountryPopulator.populateAllCountries;
  static getDatabaseStats = CountryStats.getDatabaseStats;
}
