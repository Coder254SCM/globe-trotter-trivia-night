
import { Country } from "../../../types/quiz";

const westAsiaCountries: Country[] = [
  {
    id: "saudi-arabia",
    name: "Saudi Arabia",
    code: "SA",
    position: {
      lat: 23.8859,
      lng: 45.0792,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Geography",
      "Religion",
      "Culture",
      "Economy"
    ],
    flagImageUrl: "https://flagcdn.com/sa.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Saudi_Arabia_location_map.svg/800px-Saudi_Arabia_location_map.svg.png",
    iconType: "landmark",
    continent: "Asia"
  },
  {
    id: "turkey",
    name: "Turkey",
    code: "TR",
    position: {
      lat: 38.9637,
      lng: 35.2433,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Culture",
      "Geography",
      "Food",
      "Architecture",
      "Art"
    ],
    flagImageUrl: "https://flagcdn.com/tr.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Turkey_location_map.svg/800px-Turkey_location_map.svg.png",
    iconType: "landmark",
    continent: "Asia"
  },
  {
    id: "israel",
    name: "Israel",
    code: "IL",
    position: {
      lat: 31.0461,
      lng: 34.8516,
    },
    difficulty: "hard",
    categories: [
      "History",
      "Geography",
      "Religion",
      "Politics",
      "Technology"
    ],
    flagImageUrl: "https://flagcdn.com/il.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Israel_relief_location_map.jpg/800px-Israel_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Asia"
  },
  {
    id: "uae",
    name: "United Arab Emirates",
    code: "AE",
    position: {
      lat: 23.4241,
      lng: 53.8478,
    },
    difficulty: "medium",
    categories: [
      "Architecture",
      "Economy",
      "Culture",
      "Geography",
      "Technology"
    ],
    flagImageUrl: "https://flagcdn.com/ae.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/United_Arab_Emirates_location_map.svg/800px-United_Arab_Emirates_location_map.svg.png",
    iconType: "landmark",
    continent: "Asia"
  },
  {
    id: "iran",
    name: "Iran",
    code: "IR",
    position: {
      lat: 32.4279,
      lng: 53.6880,
    },
    difficulty: "hard",
    categories: [
      "History",
      "Geography",
      "Culture",
      "Art",
      "Religion"
    ],
    flagImageUrl: "https://flagcdn.com/ir.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Iran_relief_location_map.jpg/800px-Iran_relief_location_map.jpg",
    iconType: "culture",
    continent: "Asia"
  }
];

export default westAsiaCountries;
