
import { Country } from "../../../types/quiz";
import northAfricaCountries from "./northAfrica";
import eastAfricaCountries from "./eastAfrica";
import westAfricaCountries from "./westAfrica";
import southernAfricaCountries from "./southernAfrica";

// Combine all region countries into a single array
const africaCountries: Country[] = [
  ...northAfricaCountries,
  ...eastAfricaCountries,
  ...westAfricaCountries,
  ...southernAfricaCountries
];

export default africaCountries;
