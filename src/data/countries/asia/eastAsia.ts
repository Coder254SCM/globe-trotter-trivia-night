
import { Country } from "../../../types/quiz";

const eastAsiaCountries: Country[] = [
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
    id: "south-korea",
    name: "South Korea",
    code: "KR",
    position: {
      lat: 35.9078,
      lng: 127.7669,
    },
    difficulty: "medium",
    categories: [
      "Culture",
      "Technology",
      "Music",
      "Food",
      "History",
      "TV Shows",
      "Language"
    ],
    flagImageUrl: "https://flagcdn.com/kr.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/South_Korea_relief_location_map.jpg/800px-South_Korea_relief_location_map.jpg",
    iconType: "culture",
    continent: "Asia"
  }
];

export default eastAsiaCountries;
