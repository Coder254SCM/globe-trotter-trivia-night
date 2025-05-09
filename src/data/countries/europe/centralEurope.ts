
import { Country } from "../../../types/quiz";

const centralEuropeCountries: Country[] = [
  {
    id: "germany",
    name: "Germany",
    code: "DE",
    position: {
      lat: 51.1657,
      lng: 10.4515,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Music",
      "Science",
      "Technology",
      "Philosophy",
      "Culture",
      "Food",
      "Industry"
    ],
    flagImageUrl: "https://flagcdn.com/de.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Germany_relief_location_map.jpg/800px-Germany_relief_location_map.jpg",
    iconType: "trophy",
    continent: "Europe"
  },
  {
    id: "switzerland",
    name: "Switzerland",
    code: "CH",
    position: {
      lat: 46.8182,
      lng: 8.2275,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Culture",
      "History",
      "Banking",
      "Sports",
      "Tourism"
    ],
    flagImageUrl: "https://flagcdn.com/ch.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Switzerland_relief_location_map.jpg/800px-Switzerland_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Europe"
  }
];

export default centralEuropeCountries;
