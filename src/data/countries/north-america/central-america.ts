
import { Country } from "../../../types/quiz";

const centralAmericaCountries: Country[] = [
  {
    id: "belize",
    name: "Belize",
    code: "BZ",
    position: {
      lat: 17.1899,
      lng: -88.4976,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Culture",
      "History",
      "Wildlife",
      "Environment"
    ],
    flagImageUrl: "https://flagcdn.com/bz.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Belize_relief_location_map.jpg/800px-Belize_relief_location_map.jpg",
    iconType: "nature",
    continent: "North America"
  },
  {
    id: "costa-rica",
    name: "Costa Rica",
    code: "CR",
    position: {
      lat: 9.7489,
      lng: -83.7534,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Environment",
      "Wildlife",
      "Culture",
      "Tourism"
    ],
    flagImageUrl: "https://flagcdn.com/cr.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Costa_Rica_relief_location_map.jpg/800px-Costa_Rica_relief_location_map.jpg",
    iconType: "nature",
    continent: "North America"
  },
  {
    id: "el-salvador",
    name: "El Salvador",
    code: "SV",
    position: {
      lat: 13.7942,
      lng: -88.8965,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Culture",
      "History",
      "Food"
    ],
    flagImageUrl: "https://flagcdn.com/sv.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/El_Salvador_relief_location_map.jpg/800px-El_Salvador_relief_location_map.jpg",
    iconType: "culture",
    continent: "North America"
  },
  {
    id: "guatemala",
    name: "Guatemala",
    code: "GT",
    position: {
      lat: 15.7835,
      lng: -90.2308,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Culture",
      "History",
      "Ancient Civilizations",
      "Food"
    ],
    flagImageUrl: "https://flagcdn.com/gt.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Guatemala_relief_location_map.jpg/800px-Guatemala_relief_location_map.jpg",
    iconType: "landmark",
    continent: "North America"
  },
  {
    id: "honduras",
    name: "Honduras",
    code: "HN",
    position: {
      lat: 15.1991,
      lng: -86.2419,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "History",
      "Culture",
      "Environment"
    ],
    flagImageUrl: "https://flagcdn.com/hn.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Honduras_relief_location_map.jpg/800px-Honduras_relief_location_map.jpg",
    iconType: "nature",
    continent: "North America"
  },
  {
    id: "nicaragua",
    name: "Nicaragua",
    code: "NI",
    position: {
      lat: 12.8654,
      lng: -85.2072,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "History",
      "Culture",
      "Wildlife"
    ],
    flagImageUrl: "https://flagcdn.com/ni.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Nicaragua_relief_location_map.jpg/800px-Nicaragua_relief_location_map.jpg",
    iconType: "nature",
    continent: "North America"
  },
  {
    id: "panama",
    name: "Panama",
    code: "PA",
    position: {
      lat: 8.5380,
      lng: -80.7821,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "History",
      "Culture",
      "Canal",
      "Economy"
    ],
    flagImageUrl: "https://flagcdn.com/pa.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Panama_relief_location_map.jpg/800px-Panama_relief_location_map.jpg",
    iconType: "landmark",
    continent: "North America"
  }
];

export default centralAmericaCountries;
