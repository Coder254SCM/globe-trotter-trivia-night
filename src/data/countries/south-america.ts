
import { Country } from "../../types/quiz";

const southAmericaCountries: Country[] = [
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
    id: "argentina",
    name: "Argentina",
    code: "AR",
    position: {
      lat: -38.4161,
      lng: -63.6167,
    },
    difficulty: "medium",
    categories: [
      "Culture",
      "Food",
      "Sports",
      "Music",
      "Geography",
      "History",
      "Dance"
    ],
    flagImageUrl: "https://flagcdn.com/ar.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Argentina_relief_location_map.jpg/800px-Argentina_relief_location_map.jpg",
    iconType: "culture",
    continent: "South America"
  },
  // Adding more South American countries
  {
    id: "colombia",
    name: "Colombia",
    code: "CO",
    position: {
      lat: 4.5709,
      lng: -74.2973,
    },
    difficulty: "medium",
    categories: [
      "Culture",
      "Geography",
      "History",
      "Music",
      "Food",
      "Coffee",
      "Literature"
    ],
    flagImageUrl: "https://flagcdn.com/co.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Colombia_relief_location_map.jpg/800px-Colombia_relief_location_map.jpg",
    iconType: "culture",
    continent: "South America"
  },
  {
    id: "peru",
    name: "Peru",
    code: "PE",
    position: {
      lat: -9.1900,
      lng: -75.0152,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Archaeology",
      "Geography",
      "Culture",
      "Food",
      "Ancient Civilizations"
    ],
    flagImageUrl: "https://flagcdn.com/pe.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Peru_relief_location_map.jpg/800px-Peru_relief_location_map.jpg",
    iconType: "landmark",
    continent: "South America"
  },
  {
    id: "chile",
    name: "Chile",
    code: "CL",
    position: {
      lat: -35.6751,
      lng: -71.5430,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Culture",
      "Wine",
      "History",
      "Nature",
      "Literature"
    ],
    flagImageUrl: "https://flagcdn.com/cl.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Chile_relief_location_map.jpg/800px-Chile_relief_location_map.jpg",
    iconType: "nature",
    continent: "South America"
  },
  {
    id: "bolivia",
    name: "Bolivia",
    code: "BO",
    position: {
      lat: -16.2902,
      lng: -63.5887,
    },
    difficulty: "hard",
    categories: [
      "Geography",
      "Culture",
      "History",
      "Indigenous Peoples",
      "Nature",
      "Traditions"
    ],
    flagImageUrl: "https://flagcdn.com/bo.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Bolivia_relief_location_map.jpg/800px-Bolivia_relief_location_map.jpg",
    iconType: "nature",
    continent: "South America"
  }
];

export default southAmericaCountries;
