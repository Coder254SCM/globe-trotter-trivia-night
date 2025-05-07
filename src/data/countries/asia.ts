
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
  },
  // Adding more Asian countries
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
  },
  {
    id: "vietnam",
    name: "Vietnam",
    code: "VN",
    position: {
      lat: 14.0583,
      lng: 108.2772,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Culture",
      "Food",
      "Geography",
      "War",
      "Traditions"
    ],
    flagImageUrl: "https://flagcdn.com/vn.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Vietnam_relief_location_map.jpg/800px-Vietnam_relief_location_map.jpg",
    iconType: "culture",
    continent: "Asia"
  },
  {
    id: "malaysia",
    name: "Malaysia",
    code: "MY",
    position: {
      lat: 4.2105,
      lng: 101.9758,
    },
    difficulty: "medium",
    categories: [
      "Culture",
      "Geography",
      "Food",
      "History",
      "Wildlife",
      "Rainforests"
    ],
    flagImageUrl: "https://flagcdn.com/my.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Malaysia_relief_location_map.jpg/800px-Malaysia_relief_location_map.jpg",
    iconType: "nature",
    continent: "Asia"
  },
  {
    id: "indonesia",
    name: "Indonesia",
    code: "ID",
    position: {
      lat: -0.7893,
      lng: 113.9213,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Culture",
      "History",
      "Islands",
      "Food",
      "Wildlife",
      "Religion"
    ],
    flagImageUrl: "https://flagcdn.com/id.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Indonesia_relief_location_map.jpg/800px-Indonesia_relief_location_map.jpg",
    iconType: "nature",
    continent: "Asia"
  },
  {
    id: "singapore",
    name: "Singapore",
    code: "SG",
    position: {
      lat: 1.3521,
      lng: 103.8198,
    },
    difficulty: "medium",
    categories: [
      "Culture",
      "Technology",
      "Business",
      "Food",
      "Architecture",
      "History"
    ],
    flagImageUrl: "https://flagcdn.com/sg.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Singapore_relief_location_map.jpg/800px-Singapore_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Asia"
  }
];

export default asiaCountries;
