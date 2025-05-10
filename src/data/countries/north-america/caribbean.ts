
import { Country } from "../../../types/quiz";

const caribbeanCountries: Country[] = [
  {
    id: "cuba",
    name: "Cuba",
    code: "CU",
    position: {
      lat: 21.5218,
      lng: -77.7812,
    },
    difficulty: "medium",
    categories: [
      "History", 
      "Geography", 
      "Culture", 
      "Music", 
      "Politics"
    ],
    flagImageUrl: "https://flagcdn.com/cu.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Cuba_relief_location_map.jpg/800px-Cuba_relief_location_map.jpg",
    iconType: "culture",
    continent: "North America"
  },
  {
    id: "jamaica",
    name: "Jamaica",
    code: "JM",
    position: {
      lat: 18.1096,
      lng: -77.2975,
    },
    difficulty: "medium",
    categories: [
      "Culture", 
      "Music", 
      "Sports", 
      "History", 
      "Food",
      "Geography"
    ],
    flagImageUrl: "https://flagcdn.com/jm.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Jamaica_relief_location_map.jpg/800px-Jamaica_relief_location_map.jpg",
    iconType: "culture",
    continent: "North America"
  },
  {
    id: "dominican-republic",
    name: "Dominican Republic",
    code: "DO",
    position: {
      lat: 18.7357,
      lng: -70.1627,
    },
    difficulty: "medium",
    categories: [
      "Culture",
      "History", 
      "Music", 
      "Sports", 
      "Geography",
      "Food"
    ],
    flagImageUrl: "https://flagcdn.com/do.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Dominican_Republic_relief_location_map.jpg/800px-Dominican_Republic_relief_location_map.jpg",
    iconType: "culture",
    continent: "North America"
  }
];

export default caribbeanCountries;
