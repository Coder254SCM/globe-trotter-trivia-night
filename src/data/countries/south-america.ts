
import { Country } from "../../types/quiz";

const southAmericaCountries: Country[] = [
  {
    id: "brazil",
    name: "Brazil",
    code: "BR",
    position: {
      lat: -14.235,
      lng: -51.9253,
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
      "Wildlife",
      "Environment"
    ],
    flagImageUrl: "https://flagcdn.com/br.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Brazil_relief_location_map.jpg/800px-Brazil_relief_location_map.jpg",
    iconType: "trophy",
    continent: "South America"
  },
  {
    id: "argentina",
    name: "Argentina",
    code: "AR",
    position: {
      lat: -38.4161,
      lng: -63.6167,
    },
    difficulty: "medium",
    categories: [
      "Culture",
      "Food",
      "Sports",
      "Music",
      "Geography",
      "History",
      "Dance"
    ],
    flagImageUrl: "https://flagcdn.com/ar.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Argentina_relief_location_map.jpg/800px-Argentina_relief_location_map.jpg",
    iconType: "culture",
    continent: "South America"
  }
];

export default southAmericaCountries;
