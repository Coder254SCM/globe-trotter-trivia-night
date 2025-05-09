
import { Country } from "../../../types/quiz";

const centralAsiaCountries: Country[] = [
  {
    id: "kazakhstan",
    name: "Kazakhstan",
    code: "KZ",
    position: {
      lat: 48.0196,
      lng: 66.9237,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "History",
      "Culture",
      "Economy",
      "Wildlife"
    ],
    flagImageUrl: "https://flagcdn.com/kz.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Kazakhstan_relief_location_map.jpg/800px-Kazakhstan_relief_location_map.jpg",
    iconType: "nature",
    continent: "Asia"
  },
  {
    id: "uzbekistan",
    name: "Uzbekistan",
    code: "UZ",
    position: {
      lat: 41.3775,
      lng: 64.5853,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Geography",
      "Architecture",
      "Culture",
      "Silk Road"
    ],
    flagImageUrl: "https://flagcdn.com/uz.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/thumb/f/f5/Uzbekistan_relief_location_map.jpg/800px-Uzbekistan_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Asia"
  },
  {
    id: "kyrgyzstan",
    name: "Kyrgyzstan",
    code: "KG",
    position: {
      lat: 41.2044,
      lng: 74.7661,
    },
    difficulty: "hard",
    categories: [
      "Geography",
      "History",
      "Culture",
      "Mountains",
      "Traditions"
    ],
    flagImageUrl: "https://flagcdn.com/kg.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Kyrgyzstan_location_map.svg/800px-Kyrgyzstan_location_map.svg.png",
    iconType: "nature",
    continent: "Asia"
  }
];

export default centralAsiaCountries;
