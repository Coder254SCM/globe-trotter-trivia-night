
import { Country } from "../../../types/quiz";

const northernEuropeCountries: Country[] = [
  {
    id: "sweden",
    name: "Sweden",
    code: "SE",
    position: {
      lat: 60.1282,
      lng: 18.6435,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Culture",
      "Geography",
      "Technology",
      "Music",
      "Architecture"
    ],
    flagImageUrl: "https://flagcdn.com/se.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Sweden_relief_location_map.jpg/800px-Sweden_relief_location_map.jpg",
    iconType: "culture",
    continent: "Europe"
  },
  {
    id: "norway",
    name: "Norway",
    code: "NO",
    position: {
      lat: 60.472,
      lng: 8.4689,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Culture",
      "History",
      "Nature",
      "Sports"
    ],
    flagImageUrl: "https://flagcdn.com/no.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Norway_relief_location_map.jpg/800px-Norway_relief_location_map.jpg",
    iconType: "nature",
    continent: "Europe"
  },
  {
    id: "ireland",
    name: "Ireland",
    code: "IE",
    position: {
      lat: 53.1424,
      lng: -7.6921,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Literature",
      "Culture",
      "Music",
      "Geography"
    ],
    flagImageUrl: "https://flagcdn.com/ie.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Ireland_relief_location_map.jpg/800px-Ireland_relief_location_map.jpg",
    iconType: "culture",
    continent: "Europe"
  }
];

export default northernEuropeCountries;
