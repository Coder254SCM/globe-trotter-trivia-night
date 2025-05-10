
import { Country } from "../../../types/quiz";
import eastAfricaCountries from "./eastAfrica";
import northAfricaCountries from "./northAfrica";
import southernAfricaCountries from "./southernAfrica";
import westAfricaCountries from "./westAfrica";
import centralAfricaCountries from "./centralAfrica";

// Combine all region countries into a single array
const africaCountries: Country[] = [
  ...eastAfricaCountries,
  ...northAfricaCountries,
  ...southernAfricaCountries,
  ...westAfricaCountries,
  ...centralAfricaCountries
];

export default africaCountries;
