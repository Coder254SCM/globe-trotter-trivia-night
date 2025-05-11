
import { Country } from "../../../types/quiz";

const southernEuropeCountries: Country[] = [
  {
    id: "italy",
    name: "Italy",
    code: "IT",
    position: {
      lat: 41.8719,
      lng: 12.5674,
    },
    difficulty: "easy",
    categories: [
      "History",
      "Culture",
      "Geography",
      "Food",
      "Music",
      "Sports",
      "Language",
      "Art",
      "Landmarks"
    ],
    flagImageUrl: "https://flagcdn.com/it.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Italy_relief_location_map.jpg/800px-Italy_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Europe"
  },
  {
    id: "spain",
    name: "Spain",
    code: "ES",
    position: {
      lat: 40.4637,
      lng: -3.7492,
    },
    difficulty: "easy",
    categories: [
      "History",
      "Culture",
      "Art",
      "Food",
      "Music",
      "Architecture",
      "Sports"
    ],
    flagImageUrl: "https://flagcdn.com/es.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Spain_relief_location_map.jpg/800px-Spain_relief_location_map.jpg",
    iconType: "culture",
    continent: "Europe"
  },
  {
    id: "portugal",
    name: "Portugal",
    code: "PT",
    position: {
      lat: 39.3999,
      lng: -8.2245,
    },
    difficulty: "easy",
    categories: [
      "History",
      "Culture",
      "Geography",
      "Food",
      "Music"
    ],
    flagImageUrl: "https://flagcdn.com/pt.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Portugal_relief_location_map.jpg/800px-Portugal_relief_location_map.jpg",
    iconType: "culture",
    continent: "Europe"
  },
  {
    id: "greece",
    name: "Greece",
    code: "GR",
    position: {
      lat: 39.0742,
      lng: 21.8243,
    },
    difficulty: "easy",
    categories: [
      "Ancient History",
      "Philosophy",
      "Architecture",
      "Geography",
      "Food",
      "Art"
    ],
    flagImageUrl: "https://flagcdn.com/gr.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Greece_relief_location_map.jpg/800px-Greece_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Europe"
  },
  {
    id: "croatia",
    name: "Croatia",
    code: "HR",
    position: {
      lat: 45.1000,
      lng: 15.2000,
    },
    difficulty: "easy",
    categories: [
      "Geography",
      "History",
      "Tourism",
      "Culture",
      "Food"
    ],
    flagImageUrl: "https://flagcdn.com/hr.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Croatia_relief_location_map.jpg/800px-Croatia_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Europe"
  },
  {
    id: "serbia",
    name: "Serbia",
    code: "RS",
    position: {
      lat: 44.0165,
      lng: 21.0059,
    },
    difficulty: "easy",
    categories: [
      "History",
      "Culture",
      "Music",
      "Food",
      "Sports"
    ],
    flagImageUrl: "https://flagcdn.com/rs.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Serbia_relief_location_map.jpg/800px-Serbia_relief_location_map.jpg",
    iconType: "culture",
    continent: "Europe"
  }
];

export default southernEuropeCountries;
