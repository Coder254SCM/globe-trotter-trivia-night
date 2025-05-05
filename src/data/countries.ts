
import { Country } from "../types/quiz";

const countries: Country[] = [
  {
    id: "kenya",
    name: "Kenya",
    code: "KE",
    position: {
      lat: 0.0236,
      lng: 37.9062,
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
      "Tribes",
      "Wildlife",
      "Politics",
      "Landmarks"
    ],
    flagImageUrl: "https://flagcdn.com/ke.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Kenya_relief_location_map.svg/800px-Kenya_relief_location_map.svg.png",
    iconType: "landmark",
    continent: "Africa"
  },
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
    id: "japan",
    name: "Japan",
    code: "JP",
    position: {
      lat: 36.2048,
      lng: 138.2529,
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
      "Technology",
      "Art",
      "Traditions"
    ],
    flagImageUrl: "https://flagcdn.com/jp.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Japan_relief_map.png/800px-Japan_relief_map.png",
    iconType: "landmark",
    continent: "Asia"
  },
  {
    id: "brazil",
    name: "Brazil",
    code: "BR",
    position: {
      lat: -14.235,
      lng: -51.9253,
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
      "Wildlife",
      "Environment"
    ],
    flagImageUrl: "https://flagcdn.com/br.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Brazil_relief_location_map.jpg/800px-Brazil_relief_location_map.jpg",
    iconType: "trophy",
    continent: "South America"
  },
  {
    id: "italy",
    name: "Italy",
    code: "IT",
    position: {
      lat: 41.8719,
      lng: 12.5674,
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
      "Art",
      "Landmarks"
    ],
    flagImageUrl: "https://flagcdn.com/it.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Italy_relief_location_map.jpg/800px-Italy_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Europe"
  },
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
  // Add more countries with their unique attributes
  {
    id: "australia",
    name: "Australia",
    code: "AU",
    position: {
      lat: -25.2744,
      lng: 133.7751,
    },
    difficulty: "medium",
    categories: [
      "Wildlife",
      "Geography",
      "History",
      "Culture",
      "Sports",
      "Environment",
      "Indigenous Culture"
    ],
    flagImageUrl: "https://flagcdn.com/au.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Australia_relief_map.jpg/800px-Australia_relief_map.jpg",
    iconType: "nature",
    continent: "Oceania"
  },
  {
    id: "france",
    name: "France",
    code: "FR",
    position: {
      lat: 46.2276,
      lng: 2.2137,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Culture",
      "Food",
      "Art",
      "Architecture",
      "Fashion",
      "Literature",
      "Music"
    ],
    flagImageUrl: "https://flagcdn.com/fr.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/France_relief_location_map.jpg/800px-France_relief_location_map.jpg",
    iconType: "culture",
    continent: "Europe"
  },
  {
    id: "china",
    name: "China",
    code: "CN",
    position: {
      lat: 35.8617,
      lng: 104.1954,
    },
    difficulty: "hard",
    categories: [
      "History",
      "Culture",
      "Language",
      "Philosophy",
      "Art",
      "Technology",
      "Geography",
      "Traditions"
    ],
    flagImageUrl: "https://flagcdn.com/cn.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/China_relief_location_map.jpg/800px-China_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Asia"
  },
  {
    id: "south-africa",
    name: "South Africa",
    code: "ZA",
    position: {
      lat: -30.5595,
      lng: 22.9375,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Culture",
      "Wildlife",
      "Geography",
      "Politics",
      "Music",
      "Sports",
      "Languages"
    ],
    flagImageUrl: "https://flagcdn.com/za.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/South_Africa_relief_location_map.jpg/800px-South_Africa_relief_location_map.jpg",
    iconType: "nature",
    continent: "Africa"
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
    id: "egypt",
    name: "Egypt",
    code: "EG",
    position: {
      lat: 26.8206,
      lng: 30.8025,
    },
    difficulty: "hard",
    categories: [
      "Ancient History",
      "Archaeology",
      "Culture",
      "Religion",
      "Architecture",
      "Art",
      "Geography"
    ],
    flagImageUrl: "https://flagcdn.com/eg.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Egypt_relief_location_map.jpg/800px-Egypt_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Africa"
  },
  {
    id: "germany",
    name: "Germany",
    code: "DE",
    position: {
      lat: 51.1657,
      lng: 10.4515,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Music",
      "Science",
      "Technology",
      "Philosophy",
      "Culture",
      "Food",
      "Industry"
    ],
    flagImageUrl: "https://flagcdn.com/de.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Germany_relief_location_map.jpg/800px-Germany_relief_location_map.jpg",
    iconType: "trophy",
    continent: "Europe"
  },
  // Add more countries here...
];

export default countries;
