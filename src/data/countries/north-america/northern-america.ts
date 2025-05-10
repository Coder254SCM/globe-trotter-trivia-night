
import { Country } from "../../../types/quiz";

const northernAmericaCountries: Country[] = [
  {
    id: "usa",
    name: "United States",
    code: "US",
    position: {
      lat: 37.0902,
      lng: -95.7129,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Geography",
      "Politics",
      "Culture",
      "Sports",
      "Entertainment"
    ],
    flagImageUrl: "https://flagcdn.com/us.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/USA_orthographic.svg/800px-USA_orthographic.svg.png",
    iconType: "landmark",
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
      "Geography",
      "History",
      "Culture",
      "Wildlife",
      "Sports"
    ],
    flagImageUrl: "https://flagcdn.com/ca.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Canada_relief_location_map.jpg/800px-Canada_relief_location_map.jpg",
    iconType: "nature",
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
      "Geography",
      "Food",
      "Art",
      "Traditions"
    ],
    flagImageUrl: "https://flagcdn.com/mx.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Mexico_relief_location_map.jpg/800px-Mexico_relief_location_map.jpg",
    iconType: "culture",
    continent: "North America"
  }
];

export default northernAmericaCountries;
