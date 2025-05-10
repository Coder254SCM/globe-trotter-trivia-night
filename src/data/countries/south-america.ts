
import { Country } from "../types/quiz";

const southAmericaCountries: Country[] = [
  {
    id: "brazil",
    name: "Brazil",
    code: "BR",
    position: {
      lat: -14.2350,
      lng: -51.9253,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Culture",
      "History",
      "Sports",
      "Wildlife",
      "Food",
      "Music"
    ],
    flagImageUrl: "https://flagcdn.com/br.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Brazil_relief_location_map.jpg/800px-Brazil_relief_location_map.jpg",
    iconType: "culture",
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
      "Geography",
      "Culture",
      "Food",
      "Sports",
      "History",
      "Music",
      "Literature"
    ],
    flagImageUrl: "https://flagcdn.com/ar.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Argentina_relief_location_map.jpg/800px-Argentina_relief_location_map.jpg",
    iconType: "culture",
    continent: "South America"
  },
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
      "Geography",
      "Culture",
      "History",
      "Food",
      "Wildlife",
      "Literature",
      "Music"
    ],
    flagImageUrl: "https://flagcdn.com/co.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Colombia_relief_location_map.jpg/800px-Colombia_relief_location_map.jpg",
    iconType: "nature",
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
      "Geography",
      "History",
      "Culture",
      "Archaeology",
      "Food",
      "Ancient Civilizations"
    ],
    flagImageUrl: "https://flagcdn.com/pe.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Peru_relief_location_map.jpg/800px-Peru_relief_location_map.jpg",
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
      "Environment",
      "Astronomy"
    ],
    flagImageUrl: "https://flagcdn.com/cl.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Chile_relief_location_map.jpg/800px-Chile_relief_location_map.jpg",
    iconType: "nature",
    continent: "South America"
  },
  {
    id: "venezuela",
    name: "Venezuela",
    code: "VE",
    position: {
      lat: 6.4238,
      lng: -66.5897,
    },
    difficulty: "hard",
    categories: [
      "Geography",
      "History",
      "Culture",
      "Politics",
      "Natural Resources",
      "Environment"
    ],
    flagImageUrl: "https://flagcdn.com/ve.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Venezuela_relief_location_map.jpg/800px-Venezuela_relief_location_map.jpg",
    iconType: "nature",
    continent: "South America"
  },
  {
    id: "ecuador",
    name: "Ecuador",
    code: "EC",
    position: {
      lat: -1.8312,
      lng: -78.1834,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Wildlife",
      "Galapagos",
      "Culture",
      "History",
      "Environment"
    ],
    flagImageUrl: "https://flagcdn.com/ec.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Ecuador_relief_location_map.jpg/800px-Ecuador_relief_location_map.jpg",
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
      "Nature",
      "Indigenous Peoples",
      "Environment"
    ],
    flagImageUrl: "https://flagcdn.com/bo.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Bolivia_relief_location_map.jpg/800px-Bolivia_relief_location_map.jpg",
    iconType: "culture",
    continent: "South America"
  },
  {
    id: "paraguay",
    name: "Paraguay",
    code: "PY",
    position: {
      lat: -23.4425,
      lng: -58.4438,
    },
    difficulty: "hard",
    categories: [
      "Geography",
      "Culture",
      "History",
      "Language",
      "Environment",
      "Sports"
    ],
    flagImageUrl: "https://flagcdn.com/py.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Paraguay_relief_location_map.jpg/800px-Paraguay_relief_location_map.jpg",
    iconType: "culture",
    continent: "South America"
  },
  {
    id: "uruguay",
    name: "Uruguay",
    code: "UY",
    position: {
      lat: -32.5228,
      lng: -55.7658,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Culture",
      "Football",
      "History",
      "Food",
      "Environment"
    ],
    flagImageUrl: "https://flagcdn.com/uy.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Uruguay_relief_location_map.jpg/800px-Uruguay_relief_location_map.jpg",
    iconType: "trophy",
    continent: "South America"
  },
  {
    id: "guyana",
    name: "Guyana",
    code: "GY",
    position: {
      lat: 4.8604,
      lng: -58.9302,
    },
    difficulty: "hard",
    categories: [
      "Geography",
      "History",
      "Culture",
      "Wildlife",
      "Environment",
      "Heritage"
    ],
    flagImageUrl: "https://flagcdn.com/gy.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Guyana_relief_location_map.jpg/800px-Guyana_relief_location_map.jpg",
    iconType: "nature",
    continent: "South America"
  },
  {
    id: "suriname",
    name: "Suriname",
    code: "SR",
    position: {
      lat: 3.9193,
      lng: -56.0278,
    },
    difficulty: "hard",
    categories: [
      "Geography",
      "Culture",
      "History",
      "Wildlife",
      "Environment",
      "Heritage"
    ],
    flagImageUrl: "https://flagcdn.com/sr.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Suriname_relief_location_map.jpg/800px-Suriname_relief_location_map.jpg",
    iconType: "nature",
    continent: "South America"
  }
];

export default southAmericaCountries;
