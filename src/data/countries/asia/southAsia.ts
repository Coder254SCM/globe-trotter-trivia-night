
import { Country } from "../../../types/quiz";

const southAsiaCountries: Country[] = [
  {
    id: "india",
    name: "India",
    code: "IN",
    position: {
      lat: 20.5937,
      lng: 78.9629,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Culture",
      "Geography",
      "Food",
      "Music",
      "Sports",
      "Language",
      "Religion",
      "Art"
    ],
    flagImageUrl: "https://flagcdn.com/in.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/India_relief_location_map.jpg/800px-India_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Asia"
  }
];

export default southAsiaCountries;
