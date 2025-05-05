
import { Country } from "../../types/quiz";
import africaCountries from "./africa";
import asiaCountries from "./asia";
import europeCountries from "./europe";
import northAmericaCountries from "./north-america";
import southAmericaCountries from "./south-america";
import oceaniaCountries from "./oceania";

// Combine all continent-specific countries into a single array
const countries: Country[] = [
  ...africaCountries,
  ...asiaCountries,
  ...europeCountries,
  ...northAmericaCountries,
  ...southAmericaCountries,
  ...oceaniaCountries
];

export default countries;
