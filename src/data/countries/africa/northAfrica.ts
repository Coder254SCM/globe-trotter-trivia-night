
import { Country } from "../../../types/quiz";

const northAfricaCountries: Country[] = [
  {
    id: "egypt",
    name: "Egypt",
    code: "EG",
    position: {
      lat: 26.8206,
      lng: 30.8025,
    },
    difficulty: "hard",
    categories: [
      "Ancient History", "Archaeology", "Culture", "Religion", "Architecture", "Art", "Geography"
    ],
    flagImageUrl: "https://flagcdn.com/eg.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Egypt_relief_location_map.jpg/800px-Egypt_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Africa"
  },
  {
    id: "morocco",
    name: "Morocco",
    code: "MA",
    position: {
      lat: 31.7917,
      lng: -7.0926,
    },
    difficulty: "medium",
    categories: [
      "Culture", "History", "Food", "Geography", "Architecture", "Traditions", "Art"
    ],
    flagImageUrl: "https://flagcdn.com/ma.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Morocco_relief_location_map.jpg/800px-Morocco_relief_location_map.jpg",
    iconType: "culture",
    continent: "Africa"
  },
  {
    id: "tunisia",
    name: "Tunisia",
    code: "TN",
    position: {
      lat: 33.8869,
      lng: 9.5375,
    },
    difficulty: "medium",
    categories: [
      "History", "Culture", "Geography", "Food", "Tourism"
    ],
    flagImageUrl: "https://flagcdn.com/tn.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Tunisia_relief_location_map.jpg/800px-Tunisia_relief_location_map.jpg",
    iconType: "culture",
    continent: "Africa"
  },
  {
    id: "algeria",
    name: "Algeria",
    code: "DZ",
    position: {
      lat: 28.0339,
      lng: 1.6596,
    },
    difficulty: "medium",
    categories: [
      "History", "Geography", "Culture", "Music", "Food", "Desert"
    ],
    flagImageUrl: "https://flagcdn.com/dz.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Algeria_relief_location_map.jpg/800px-Algeria_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Africa"
  },
  {
    id: "libya",
    name: "Libya",
    code: "LY",
    position: {
      lat: 26.3351,
      lng: 17.2283,
    },
    difficulty: "hard",
    categories: [
      "History", "Geography", "Desert", "Politics"
    ],
    flagImageUrl: "https://flagcdn.com/ly.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Libya_relief_location_map.jpg/800px-Libya_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Africa"
  }
];

export default northAfricaCountries;
