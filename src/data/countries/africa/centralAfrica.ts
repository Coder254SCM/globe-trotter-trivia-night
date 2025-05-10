
import { Country } from "../../../types/quiz";
import { generateBasicCountry } from "../../../utils/quiz/countryGenerator";

const centralAfricaCountries: Country[] = [
  {
    id: "cameroon",
    name: "Cameroon",
    code: "CM",
    position: {
      lat: 7.3697,
      lng: 12.3547,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "History",
      "Culture",
      "Sports",
      "Wildlife"
    ],
    flagImageUrl: "https://flagcdn.com/cm.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Cameroon_relief_location_map.jpg/800px-Cameroon_relief_location_map.jpg",
    iconType: "nature",
    continent: "Africa"
  },
  {
    id: "central-african-republic",
    name: "Central African Republic",
    code: "CF",
    position: {
      lat: 6.6111,
      lng: 20.9394,
    },
    difficulty: "hard",
    categories: [
      "Geography",
      "History",
      "Culture",
      "Wildlife"
    ],
    flagImageUrl: "https://flagcdn.com/cf.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Central_African_Republic_relief_location_map.jpg/800px-Central_African_Republic_relief_location_map.jpg",
    iconType: "nature",
    continent: "Africa"
  },
  {
    id: "chad",
    name: "Chad",
    code: "TD",
    position: {
      lat: 15.4542,
      lng: 18.7322,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "History",
      "Culture"
    ],
    flagImageUrl: "https://flagcdn.com/td.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Chad_relief_location_map.jpg/800px-Chad_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Africa"
  },
  {
    id: "democratic-republic-of-congo",
    name: "Democratic Republic of Congo",
    code: "CD",
    position: {
      lat: -4.0383,
      lng: 21.7587,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "History",
      "Culture",
      "Wildlife",
      "Resources"
    ],
    flagImageUrl: "https://flagcdn.com/cd.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Democratic_Republic_of_the_Congo_relief_location_map.jpg/800px-Democratic_Republic_of_the_Congo_relief_location_map.jpg",
    iconType: "nature",
    continent: "Africa"
  },
  {
    id: "republic-of-congo",
    name: "Republic of Congo",
    code: "CG",
    position: {
      lat: -0.2280,
      lng: 15.8277,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "History",
      "Culture"
    ],
    flagImageUrl: "https://flagcdn.com/cg.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Republic_of_the_Congo_location_map.svg/800px-Republic_of_the_Congo_location_map.svg.png",
    iconType: "nature",
    continent: "Africa"
  },
  {
    id: "equatorial-guinea",
    name: "Equatorial Guinea",
    code: "GQ",
    position: {
      lat: 1.6508,
      lng: 10.2679,
    },
    difficulty: "hard",
    categories: [
      "Geography",
      "History",
      "Culture"
    ],
    flagImageUrl: "https://flagcdn.com/gq.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Equatorial_Guinea_relief_location_map.jpg/800px-Equatorial_Guinea_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Africa"
  },
  {
    id: "gabon",
    name: "Gabon",
    code: "GA",
    position: {
      lat: -0.8037,
      lng: 11.6094,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Wildlife",
      "Resources",
      "Culture"
    ],
    flagImageUrl: "https://flagcdn.com/ga.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Gabon_relief_location_map.jpg/800px-Gabon_relief_location_map.jpg",
    iconType: "nature",
    continent: "Africa"
  }
];

export default centralAfricaCountries;
