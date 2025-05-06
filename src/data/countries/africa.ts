
import { Country } from "../../types/quiz";

const africaCountries: Country[] = [
  {
    id: "kenya",
    name: "Kenya",
    code: "KE",
    position: {
      lat: 0.0236,
      lng: 37.9062,
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
      "Tribes",
      "Wildlife",
      "Politics",
      "Landmarks"
    ],
    flagImageUrl: "https://flagcdn.com/ke.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Kenya_relief_location_map.svg/800px-Kenya_relief_location_map.svg.png",
    iconType: "landmark",
    continent: "Africa"
  },
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
      "Ancient History",
      "Archaeology",
      "Culture",
      "Religion",
      "Architecture",
      "Art",
      "Geography"
    ],
    flagImageUrl: "https://flagcdn.com/eg.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Egypt_relief_location_map.jpg/800px-Egypt_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Africa"
  },
  {
    id: "south-africa",
    name: "South Africa",
    code: "ZA",
    position: {
      lat: -30.5595,
      lng: 22.9375,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Culture",
      "Wildlife",
      "Geography",
      "Politics",
      "Music",
      "Sports",
      "Languages"
    ],
    flagImageUrl: "https://flagcdn.com/za.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/South_Africa_relief_location_map.jpg/800px-South_Africa_relief_location_map.jpg",
    iconType: "nature",
    continent: "Africa"
  },
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
      "Culture",
      "History",
      "Music",
      "Cinema",
      "Food",
      "Languages",
      "Literature"
    ],
    flagImageUrl: "https://flagcdn.com/ng.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Nigeria_relief_location_map.jpg/800px-Nigeria_relief_location_map.jpg",
    iconType: "culture",
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
      "Culture",
      "History",
      "Food",
      "Geography",
      "Architecture",
      "Traditions",
      "Art"
    ],
    flagImageUrl: "https://flagcdn.com/ma.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Morocco_relief_location_map.jpg/800px-Morocco_relief_location_map.jpg",
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
      "Culture",
      "History",
      "Music",
      "Food",
      "Sports",
      "Geography"
    ],
    flagImageUrl: "https://flagcdn.com/gh.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Ghana_relief_location_map.jpg/800px-Ghana_relief_location_map.jpg",
    iconType: "culture",
    continent: "Africa"
  }
];

export default africaCountries;
