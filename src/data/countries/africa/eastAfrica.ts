
import { Country } from "../../../types/quiz";

const eastAfricaCountries: Country[] = [
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
      "History", "Culture", "Geography", "Food", "Music", "Sports", "Language", 
      "Tribes", "Wildlife", "Politics", "Landmarks"
    ],
    flagImageUrl: "https://flagcdn.com/ke.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Kenya_relief_location_map.svg/800px-Kenya_relief_location_map.svg.png",
    iconType: "landmark",
    continent: "Africa"
  },
  {
    id: "ethiopia",
    name: "Ethiopia",
    code: "ET",
    position: {
      lat: 9.145,
      lng: 40.4897,
    },
    difficulty: "hard",
    categories: [
      "History", "Culture", "Food", "Geography", "Music", "Ancient Civilization"
    ],
    flagImageUrl: "https://flagcdn.com/et.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Ethiopia_relief_location_map.jpg/800px-Ethiopia_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Africa"
  },
  {
    id: "uganda",
    name: "Uganda",
    code: "UG",
    position: {
      lat: 1.3733,
      lng: 32.2903,
    },
    difficulty: "medium",
    categories: [
      "Wildlife", "History", "Geography", "Culture"
    ],
    flagImageUrl: "https://flagcdn.com/ug.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Uganda_relief_location_map.jpg/800px-Uganda_relief_location_map.jpg",
    iconType: "nature",
    continent: "Africa"
  },
  {
    id: "tanzania",
    name: "Tanzania",
    code: "TZ",
    position: {
      lat: -6.369,
      lng: 34.8888,
    },
    difficulty: "medium",
    categories: [
      "Wildlife", "Geography", "Culture", "Tourism", "History", "National Parks"
    ],
    flagImageUrl: "https://flagcdn.com/tz.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Tanzania_relief_location_map.jpg/800px-Tanzania_relief_location_map.jpg",
    iconType: "nature",
    continent: "Africa"
  },
  {
    id: "madagascar",
    name: "Madagascar",
    code: "MG",
    position: {
      lat: -18.7669,
      lng: 46.8691,
    },
    difficulty: "hard",
    categories: [
      "Wildlife", "Geography", "Nature", "Environment"
    ],
    flagImageUrl: "https://flagcdn.com/mg.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Madagascar_relief_location_map.jpg/800px-Madagascar_relief_location_map.jpg",
    iconType: "nature",
    continent: "Africa"
  }
];

export default eastAfricaCountries;
