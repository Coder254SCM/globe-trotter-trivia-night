
import { Country } from "../../../types/quiz";

const southAsiaCountries: Country[] = [
  {
    id: "india",
    name: "India",
    code: "IN",
    position: {
      lat: 20.5937,
      lng: 78.9629,
    },
    difficulty: "hard",
    categories: [
      "History",
      "Culture",
      "Religion",
      "Food",
      "Art",
      "Geography",
      "Technology",
      "Cinema",
      "Music",
      "Philosophy"
    ],
    flagImageUrl: "https://flagcdn.com/in.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/India_relief_location_map.jpg/800px-India_relief_location_map.jpg",
    iconType: "culture",
    continent: "Asia"
  },
  {
    id: "pakistan",
    name: "Pakistan",
    code: "PK",
    position: {
      lat: 30.3753,
      lng: 69.3451,
    },
    difficulty: "hard",
    categories: [
      "History",
      "Geography",
      "Culture",
      "Sports",
      "Food",
      "Nature",
      "Religion"
    ],
    flagImageUrl: "https://flagcdn.com/pk.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Pakistan_relief_location_map.jpg/800px-Pakistan_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Asia"
  },
  {
    id: "nepal",
    name: "Nepal",
    code: "NP",
    position: {
      lat: 28.3949,
      lng: 84.1240,
    },
    difficulty: "hard",
    categories: [
      "Geography",
      "Nature",
      "Culture",
      "History",
      "Religion",
      "Wildlife"
    ],
    flagImageUrl: "https://flagcdn.com/np.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Nepal_relief_location_map.svg/800px-Nepal_relief_location_map.svg.png",
    iconType: "nature",
    continent: "Asia"
  }
];

export default southAsiaCountries;
