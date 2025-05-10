
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
      "Culture",
      "Politics",
      "Sports",
      "Technology",
      "Music",
      "Cinema"
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
      "Sports",
      "Nature",
      "Music"
    ],
    flagImageUrl: "https://flagcdn.com/ca.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Canada_relief_location_map.jpg/800px-Canada_relief_location_map.jpg",
    iconType: "nature",
    continent: "North America"
  },
  {
    id: "greenland",
    name: "Greenland",
    code: "GL",
    position: {
      lat: 71.7069,
      lng: -42.6043,
    },
    difficulty: "hard",
    categories: [
      "Geography",
      "Climate",
      "Indigenous Culture",
      "History",
      "Nature"
    ],
    flagImageUrl: "https://flagcdn.com/gl.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Greenland_relief_location_map.jpg/800px-Greenland_relief_location_map.jpg",
    iconType: "nature",
    continent: "North America"
  }
];

export default northernAmericaCountries;
