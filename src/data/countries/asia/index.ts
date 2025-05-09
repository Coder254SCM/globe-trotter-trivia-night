
import { Country } from "../../../types/quiz";
import eastAsiaCountries from "./eastAsia";
import southAsiaCountries from "./southAsia";
import southeastAsiaCountries from "./southeastAsia";
import westAsiaCountries from "./westAsia";
import centralAsiaCountries from "./centralAsia";

// Combine all region countries into a single array
const asiaCountries: Country[] = [
  ...eastAsiaCountries,
  ...southAsiaCountries,
  ...southeastAsiaCountries,
  ...westAsiaCountries,
  ...centralAsiaCountries
];

export default asiaCountries;
