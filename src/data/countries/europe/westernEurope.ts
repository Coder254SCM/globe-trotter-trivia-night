
import { Country } from "../../../types/quiz";

const westernEuropeCountries: Country[] = [
  {
    id: "france",
    name: "France",
    code: "FR",
    position: {
      lat: 46.2276,
      lng: 2.2137,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Culture",
      "Food",
      "Art",
      "Architecture",
      "Fashion",
      "Literature",
      "Music"
    ],
    flagImageUrl: "https://flagcdn.com/fr.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/France_relief_location_map.jpg/800px-France_relief_location_map.jpg",
    iconType: "culture",
    continent: "Europe"
  },
  {
    id: "united-kingdom",
    name: "United Kingdom",
    code: "GB",
    position: {
      lat: 55.3781,
      lng: -3.4360,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Literature",
      "Politics",
      "Music",
      "Sports",
      "Culture",
      "Art"
    ],
    flagImageUrl: "https://flagcdn.com/gb.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/United_Kingdom_relief_location_map.jpg/800px-United_Kingdom_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Europe"
  }
];

export default westernEuropeCountries;
