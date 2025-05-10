
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
    difficulty: "medium",
    categories: [
      "History",
      "Culture",
      "Geography",
      "Food",
      "Music",
      "Sports",
      "Language",
      "Religion",
      "Art"
    ],
    flagImageUrl: "https://flagcdn.com/in.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/India_relief_location_map.jpg/800px-India_relief_location_map.jpg",
    iconType: "landmark",
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
    difficulty: "medium",
    categories: [
      "Geography",
      "History",
      "Culture",
      "Food",
      "Sports"
    ],
    flagImageUrl: "https://flagcdn.com/pk.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Pakistan_relief_location_map.jpg/800px-Pakistan_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Asia"
  },
  {
    id: "bangladesh",
    name: "Bangladesh",
    code: "BD",
    position: {
      lat: 23.6850,
      lng: 90.3563,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Culture",
      "History",
      "Food"
    ],
    flagImageUrl: "https://flagcdn.com/bd.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Bangladesh_relief_location_map.jpg/800px-Bangladesh_relief_location_map.jpg",
    iconType: "culture",
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
    difficulty: "medium",
    categories: [
      "Geography",
      "Mountains",
      "Culture",
      "History"
    ],
    flagImageUrl: "https://flagcdn.com/np.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Nepal_relief_location_map.jpg/800px-Nepal_relief_location_map.jpg",
    iconType: "nature",
    continent: "Asia"
  },
  {
    id: "sri-lanka",
    name: "Sri Lanka",
    code: "LK",
    position: {
      lat: 7.8731,
      lng: 80.7718,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Culture",
      "History",
      "Food",
      "Wildlife"
    ],
    flagImageUrl: "https://flagcdn.com/lk.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Sri_Lanka_relief_location_map.jpg/800px-Sri_Lanka_relief_location_map.jpg",
    iconType: "culture",
    continent: "Asia"
  },
  {
    id: "bhutan",
    name: "Bhutan",
    code: "BT",
    position: {
      lat: 27.5142,
      lng: 90.4336,
    },
    difficulty: "hard",
    categories: [
      "Geography",
      "Culture",
      "Mountains",
      "History",
      "Religion"
    ],
    flagImageUrl: "https://flagcdn.com/bt.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Bhutan_relief_location_map.jpg/800px-Bhutan_relief_location_map.jpg",
    iconType: "nature",
    continent: "Asia"
  },
  {
    id: "maldives",
    name: "Maldives",
    code: "MV",
    position: {
      lat: 3.2028,
      lng: 73.2207,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Tourism",
      "Environment",
      "Culture"
    ],
    flagImageUrl: "https://flagcdn.com/mv.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Maldives_on_the_globe_%28Afro-Eurasia_centered%29.svg/800px-Maldives_on_the_globe_%28Afro-Eurasia_centered%29.svg.png",
    iconType: "nature",
    continent: "Asia"
  }
];

export default southAsiaCountries;
