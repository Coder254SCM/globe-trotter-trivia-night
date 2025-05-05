
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
  }
];

export default oceaniaCountries;
