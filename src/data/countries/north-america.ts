
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
  }
];

export default northAmericaCountries;
