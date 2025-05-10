
import { Country } from "../../../types/quiz";
import caribbeanCountries from "./caribbean";
import centralAmericaCountries from "./central-america";
import northernAmericaCountries from "./northern-america";

// Combine all region countries into a single array
const northAmericaCountries: Country[] = [
  ...caribbeanCountries,
  ...centralAmericaCountries,
  ...northernAmericaCountries
];

export default northAmericaCountries;
