
import { Country } from "../types/quiz";

const countries: Country[] = [
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
    id: "usa",
    name: "United States",
    code: "US",
    position: {
      lat: 37.0902,
      lng: -95.7129,
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
      "Technology",
      "Politics",
      "Landmarks"
    ],
    flagImageUrl: "https://flagcdn.com/us.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/USA_relief_location_map.svg/800px-USA_relief_location_map.svg.png",
    iconType: "landmark",
    continent: "North America"
  },
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
    id: "brazil",
    name: "Brazil",
    code: "BR",
    position: {
      lat: -14.235,
      lng: -51.9253,
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
      "Wildlife",
      "Environment"
    ],
    flagImageUrl: "https://flagcdn.com/br.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Brazil_relief_location_map.jpg/800px-Brazil_relief_location_map.jpg",
    iconType: "trophy",
    continent: "South America"
  },
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
  // Add more countries here (you would want to add more countries to reach 50 across different continents)
];

export default countries;
