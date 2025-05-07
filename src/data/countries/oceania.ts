
import { Country } from "../../types/quiz";

const oceaniaCountries: Country[] = [
  {
    id: "australia",
    name: "Australia",
    code: "AU",
    position: {
      lat: -25.2744,
      lng: 133.7751,
    },
    difficulty: "medium",
    categories: [
      "Wildlife",
      "Geography",
      "History",
      "Culture",
      "Sports",
      "Environment",
      "Indigenous Culture"
    ],
    flagImageUrl: "https://flagcdn.com/au.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Australia_relief_map.jpg/800px-Australia_relief_map.jpg",
    iconType: "nature",
    continent: "Oceania"
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    code: "NZ",
    position: {
      lat: -40.9006,
      lng: 174.8860,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Indigenous Culture",
      "Wildlife",
      "Sports",
      "History",
      "Environment",
      "Cinema"
    ],
    flagImageUrl: "https://flagcdn.com/nz.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/New_Zealand_relief_map.jpg/800px-New_Zealand_relief_map.jpg",
    iconType: "nature",
    continent: "Oceania"
  },
  // Adding more Oceania countries
  {
    id: "fiji",
    name: "Fiji",
    code: "FJ",
    position: {
      lat: -17.7134,
      lng: 178.0650,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Culture",
      "Tourism",
      "History",
      "Islands",
      "Environment"
    ],
    flagImageUrl: "https://flagcdn.com/fj.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Fiji_relief_location_map.jpg/800px-Fiji_relief_location_map.jpg",
    iconType: "nature",
    continent: "Oceania"
  },
  {
    id: "papua-new-guinea",
    name: "Papua New Guinea",
    code: "PG",
    position: {
      lat: -6.3149,
      lng: 143.9555,
    },
    difficulty: "hard",
    categories: [
      "Culture",
      "Geography",
      "Wildlife",
      "Indigenous Peoples",
      "Languages",
      "History"
    ],
    flagImageUrl: "https://flagcdn.com/pg.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Papua_New_Guinea_relief_location_map.jpg/800px-Papua_New_Guinea_relief_location_map.jpg",
    iconType: "culture",
    continent: "Oceania"
  },
  {
    id: "solomon-islands",
    name: "Solomon Islands",
    code: "SB",
    position: {
      lat: -9.6457,
      lng: 160.1562,
    },
    difficulty: "hard",
    categories: [
      "Geography",
      "History",
      "Culture",
      "World War II",
      "Islands",
      "Environment"
    ],
    flagImageUrl: "https://flagcdn.com/sb.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Solomon_Islands_relief_location_map.jpg/800px-Solomon_Islands_relief_location_map.jpg",
    iconType: "nature",
    continent: "Oceania"
  }
];

export default oceaniaCountries;
