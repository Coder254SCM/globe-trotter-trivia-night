
import { Country } from "../../types/quiz";

const asiaCountries: Country[] = [
  {
    id: "japan",
    name: "Japan",
    code: "JP",
    position: {
      lat: 36.2048,
      lng: 138.2529,
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
      "Technology",
      "Art",
      "Traditions"
    ],
    flagImageUrl: "https://flagcdn.com/jp.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Japan_relief_map.png/800px-Japan_relief_map.png",
    iconType: "landmark",
    continent: "Asia"
  },
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
  },
  {
    id: "china",
    name: "China",
    code: "CN",
    position: {
      lat: 35.8617,
      lng: 104.1954,
    },
    difficulty: "hard",
    categories: [
      "History",
      "Culture",
      "Language",
      "Philosophy",
      "Art",
      "Technology",
      "Geography",
      "Traditions"
    ],
    flagImageUrl: "https://flagcdn.com/cn.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/China_relief_location_map.jpg/800px-China_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Asia"
  },
  {
    id: "thailand",
    name: "Thailand",
    code: "TH",
    position: {
      lat: 15.8700,
      lng: 100.9925,
    },
    difficulty: "medium",
    categories: [
      "Culture",
      "Food",
      "Religion",
      "History",
      "Geography",
      "Traditions",
      "Wildlife"
    ],
    flagImageUrl: "https://flagcdn.com/th.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Thailand_relief_location_map.jpg/800px-Thailand_relief_location_map.jpg",
    iconType: "culture",
    continent: "Asia"
  }
];

export default asiaCountries;
