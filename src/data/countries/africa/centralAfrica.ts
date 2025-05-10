
import { Country } from "../../../types/quiz";

const centralAfricaCountries: Country[] = [
  {
    id: "democratic-republic-of-congo",
    name: "Democratic Republic of Congo",
    code: "CD",
    position: {
      lat: -4.0383,
      lng: 21.7587,
    },
    difficulty: "hard",
    categories: [
      "History", 
      "Geography", 
      "Wildlife", 
      "Culture", 
      "Nature"
    ],
    flagImageUrl: "https://flagcdn.com/cd.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Democratic_Republic_of_the_Congo_relief_location_map.jpg/800px-Democratic_Republic_of_the_Congo_relief_location_map.jpg",
    iconType: "nature",
    continent: "Africa"
  },
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
      "Culture",
      "Geography",
      "History",
      "Wildlife",
      "Sports",
      "Nature"
    ],
    flagImageUrl: "https://flagcdn.com/cm.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Cameroon_relief_location_map.jpg/800px-Cameroon_relief_location_map.jpg",
    iconType: "culture",
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
    difficulty: "hard",
    categories: [
      "Geography",
      "History", 
      "Culture",
      "Wildlife",
      "Nature",
      "Conservation"
    ],
    flagImageUrl: "https://flagcdn.com/td.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Chad_relief_location_map.jpg/800px-Chad_relief_location_map.jpg",
    iconType: "nature",
    continent: "Africa"
  }
];

export default centralAfricaCountries;
