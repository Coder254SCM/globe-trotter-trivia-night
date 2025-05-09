
import { Country } from "../../types/quiz";

// While Antarctica is not a country, we include it for completeness
const antarcticaCountries: Country[] = [
  {
    id: "antarctica",
    name: "Antarctica",
    code: "AQ",
    position: {
      lat: -82.8628,
      lng: 135.0000,
    },
    difficulty: "hard",
    categories: [
      "Geography",
      "Science",
      "Environment",
      "Climate",
      "Exploration",
      "Research"
    ],
    flagImageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f8/True_South_Antarctic_Flag.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Antarctica_relief_location_map.jpg/800px-Antarctica_relief_location_map.jpg",
    iconType: "nature",
    continent: "Antarctica"
  }
];

export default antarcticaCountries;
