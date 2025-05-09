
import { Country } from "../../../types/quiz";

const easternEuropeCountries: Country[] = [
  {
    id: "russia",
    name: "Russia",
    code: "RU",
    position: {
      lat: 61.5240,
      lng: 105.3188,
    },
    difficulty: "hard",
    categories: [
      "History",
      "Geography",
      "Literature",
      "Art",
      "Science",
      "Politics",
      "Music"
    ],
    flagImageUrl: "https://flagcdn.com/ru.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Russia_relief_location_map.jpg/800px-Russia_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Europe"
  }
];

export default easternEuropeCountries;
