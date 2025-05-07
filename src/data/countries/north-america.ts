
import { Country } from "../../types/quiz";

const northAmericaCountries: Country[] = [
  {
    id: "usa",
    name: "United States",
    code: "US",
    position: {
      lat: 37.0902,
      lng: -95.7129,
    },
    difficulty: "easy",
    categories: [
      "History",
      "Culture",
      "Geography",
      "Food",
      "Music",
      "Sports",
      "Language",
      "Technology",
      "Politics",
      "Landmarks"
    ],
    flagImageUrl: "https://flagcdn.com/us.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/USA_relief_location_map.svg/800px-USA_relief_location_map.svg.png",
    iconType: "landmark",
    continent: "North America"
  },
  {
    id: "mexico",
    name: "Mexico",
    code: "MX",
    position: {
      lat: 23.6345,
      lng: -102.5528,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Culture",
      "Food",
      "Art",
      "Music",
      "Geography",
      "Traditions",
      "Festivals"
    ],
    flagImageUrl: "https://flagcdn.com/mx.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Mexico_relief_location_map.jpg/800px-Mexico_relief_location_map.jpg",
    iconType: "culture",
    continent: "North America"
  },
  {
    id: "canada",
    name: "Canada",
    code: "CA",
    position: {
      lat: 56.1304,
      lng: -106.3468,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Geography",
      "Culture",
      "Wildlife",
      "Sports",
      "Politics",
      "Indigenous Culture"
    ],
    flagImageUrl: "https://flagcdn.com/ca.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Canada_relief_location_map.jpg/800px-Canada_relief_location_map.jpg",
    iconType: "nature",
    continent: "North America"
  },
  // Adding more North American countries
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
      "Music",
      "Culture",
      "Geography",
      "Politics",
      "Food"
    ],
    flagImageUrl: "https://flagcdn.com/cu.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Cuba_relief_location_map.jpg/800px-Cuba_relief_location_map.jpg",
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
      "Food",
      "History",
      "Geography"
    ],
    flagImageUrl: "https://flagcdn.com/jm.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Jamaica_relief_location_map.jpg/800px-Jamaica_relief_location_map.jpg",
    iconType: "culture",
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
      "Nature",
      "Wildlife",
      "Geography",
      "Ecology",
      "Culture",
      "Tourism"
    ],
    flagImageUrl: "https://flagcdn.com/cr.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Costa_Rica_relief_location_map.jpg/800px-Costa_Rica_relief_location_map.jpg",
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
      "Canal",
      "Culture",
      "Wildlife",
      "Economy"
    ],
    flagImageUrl: "https://flagcdn.com/pa.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Panama_relief_location_map.jpg/800px-Panama_relief_location_map.jpg",
    iconType: "landmark",
    continent: "North America"
  }
];

export default northAmericaCountries;
