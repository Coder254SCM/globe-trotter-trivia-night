
import { Country as FrontendCountry } from "@/types/quiz";
import { Country as ServiceCountry } from "@/services/supabase/country/countryTypes";

export class CountryConverter {
  static toServiceCountry(frontendCountry: FrontendCountry): ServiceCountry {
    return {
      id: frontendCountry.id,
      name: frontendCountry.name,
      capital: frontendCountry.name, // Use name as fallback if capital not available
      continent: frontendCountry.continent,
      population: 1000000, // Default value
      area_km2: 100000, // Default value
      latitude: frontendCountry.position.lat,
      longitude: frontendCountry.position.lng,
      flag_url: frontendCountry.flagImageUrl,
      categories: frontendCountry.categories,
      difficulty: frontendCountry.difficulty
    };
  }
}
