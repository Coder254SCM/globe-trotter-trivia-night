
import { Country } from "../../types/quiz";

const europeCountries: Country[] = [
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
    id: "russia",
    name: "Russia",
    code: "RU",
    position: {
      lat: 61.5240,
      lng: 105.3188,
    },
    difficulty: "hard",
    categories: [
      "History",
      "Geography",
      "Literature",
      "Art",
      "Science",
      "Politics",
      "Music"
    ],
    flagImageUrl: "https://flagcdn.com/ru.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Russia_relief_location_map.jpg/800px-Russia_relief_location_map.jpg",
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
    difficulty: "medium",
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
  },
  {
    id: "sweden",
    name: "Sweden",
    code: "SE",
    position: {
      lat: 60.1282,
      lng: 18.6435,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Culture",
      "Geography",
      "Design",
      "Music",
      "Technology"
    ],
    flagImageUrl: "https://flagcdn.com/se.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Sweden_relief_location_map.jpg/800px-Sweden_relief_location_map.jpg",
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
    difficulty: "medium",
    categories: [
      "Ancient History",
      "Philosophy",
      "Mythology",
      "Architecture",
      "Geography",
      "Food",
      "Art"
    ],
    flagImageUrl: "https://flagcdn.com/gr.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Greece_relief_location_map.jpg/800px-Greece_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Europe"
  }
];

export default europeCountries;
