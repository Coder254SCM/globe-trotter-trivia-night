
import { Country } from "../../../types/quiz";

const southernAfricaCountries: Country[] = [
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
      "History", "Culture", "Wildlife", "Geography", "Politics", "Music", "Sports", "Languages"
    ],
    flagImageUrl: "https://flagcdn.com/za.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/South_Africa_relief_location_map.jpg/800px-South_Africa_relief_location_map.jpg",
    iconType: "nature",
    continent: "Africa"
  },
  {
    id: "namibia",
    name: "Namibia",
    code: "NA",
    position: {
      lat: -22.9576,
      lng: 18.4904,
    },
    difficulty: "hard",
    categories: [
      "Geography", "Wildlife", "Nature", "Desert"
    ],
    flagImageUrl: "https://flagcdn.com/na.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Namibia_relief_location_map.jpg/800px-Namibia_relief_location_map.jpg",
    iconType: "nature",
    continent: "Africa"
  },
  {
    id: "botswana",
    name: "Botswana",
    code: "BW",
    position: {
      lat: -22.3285,
      lng: 24.6849,
    },
    difficulty: "medium",
    categories: [
      "Wildlife", "Geography", "Nature", "Culture"
    ],
    flagImageUrl: "https://flagcdn.com/bw.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Botswana_relief_location_map.jpg/800px-Botswana_relief_location_map.jpg",
    iconType: "nature",
    continent: "Africa"
  },
  {
    id: "zimbabwe",
    name: "Zimbabwe",
    code: "ZW",
    position: {
      lat: -19.0154,
      lng: 29.1549,
    },
    difficulty: "medium",
    categories: [
      "History", "Geography", "Wildlife", "Culture"
    ],
    flagImageUrl: "https://flagcdn.com/zw.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Zimbabwe_relief_location_map.jpg/800px-Zimbabwe_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Africa"
  }
];

export default southernAfricaCountries;
