
import { Country } from "../../../types/quiz";
import northernEuropeCountries from "./northernEurope";
import westernEuropeCountries from "./westernEurope";
import southernEuropeCountries from "./southernEurope";
import easternEuropeCountries from "./easternEurope";
import centralEuropeCountries from "./centralEurope";

// Combine all region countries into a single array
const europeCountries: Country[] = [
  ...northernEuropeCountries,
  ...westernEuropeCountries,
  ...southernEuropeCountries,
  ...easternEuropeCountries,
  ...centralEuropeCountries
];

export default europeCountries;
