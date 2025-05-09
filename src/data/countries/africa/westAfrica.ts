
import { Country } from "../../../types/quiz";

const westAfricaCountries: Country[] = [
  {
    id: "nigeria",
    name: "Nigeria",
    code: "NG",
    position: {
      lat: 9.0820,
      lng: 8.6753,
    },
    difficulty: "hard",
    categories: [
      "Culture", "History", "Music", "Cinema", "Food", "Languages", "Literature"
    ],
    flagImageUrl: "https://flagcdn.com/ng.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Nigeria_relief_location_map.jpg/800px-Nigeria_relief_location_map.jpg",
    iconType: "culture",
    continent: "Africa"
  },
  {
    id: "ghana",
    name: "Ghana",
    code: "GH",
    position: {
      lat: 7.9465,
      lng: -1.0232,
    },
    difficulty: "medium",
    categories: [
      "Culture", "History", "Music", "Food", "Sports", "Geography"
    ],
    flagImageUrl: "https://flagcdn.com/gh.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Ghana_relief_location_map.jpg/800px-Ghana_relief_location_map.jpg",
    iconType: "culture",
    continent: "Africa"
  },
  {
    id: "senegal",
    name: "Senegal",
    code: "SN",
    position: {
      lat: 14.4974,
      lng: -14.4524,
    },
    difficulty: "medium",
    categories: [
      "Culture", "Music", "Food", "History", "Geography", "Sports"
    ],
    flagImageUrl: "https://flagcdn.com/sn.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Senegal_relief_location_map.jpg/800px-Senegal_relief_location_map.jpg",
    iconType: "culture",
    continent: "Africa"
  },
  {
    id: "ivory-coast",
    name: "Ivory Coast",
    code: "CI",
    position: {
      lat: 7.5400,
      lng: -5.5471,
    },
    difficulty: "medium",
    categories: [
      "Culture", "History", "Geography", "Food", "Sports"
    ],
    flagImageUrl: "https://flagcdn.com/ci.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Ivory_Coast_relief_location_map.jpg/800px-Ivory_Coast_relief_location_map.jpg",
    iconType: "culture",
    continent: "Africa"
  },
  {
    id: "mali",
    name: "Mali",
    code: "ML",
    position: {
      lat: 17.5707,
      lng: -3.9962,
    },
    difficulty: "hard",
    categories: [
      "History", "Culture", "Geography", "Music", "Desert"
    ],
    flagImageUrl: "https://flagcdn.com/ml.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Mali_relief_location_map.jpg/800px-Mali_relief_location_map.jpg",
    iconType: "culture",
    continent: "Africa"
  }
];

export default westAfricaCountries;
