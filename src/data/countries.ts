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
  
  // Adding more countries to fill out the globe
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
  },
  {
    id: "argentina",
    name: "Argentina",
    code: "AR",
    position: {
      lat: -38.4161,
      lng: -63.6167,
    },
    difficulty: "medium",
    categories: [
      "Culture",
      "Food",
      "Sports",
      "Music",
      "Geography",
      "History",
      "Dance"
    ],
    flagImageUrl: "https://flagcdn.com/ar.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Argentina_relief_location_map.jpg/800px-Argentina_relief_location_map.jpg",
    iconType: "culture",
    continent: "South America"
  },
  {
    id: "spain",
    name: "Spain",
    code: "ES",
    position: {
      lat: 40.4637,
      lng: -3.7492,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Culture",
      "Art",
      "Food",
      "Music",
      "Architecture",
      "Sports"
    ],
    flagImageUrl: "https://flagcdn.com/es.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Spain_relief_location_map.jpg/800px-Spain_relief_location_map.jpg",
    iconType: "culture",
    continent: "Europe"
  },
  {
    id: "thailand",
    name: "Thailand",
    code: "TH",
    position: {
      lat: 15.8700,
      lng: 100.9925,
    },
    difficulty: "medium",
    categories: [
      "Culture",
      "Food",
      "Religion",
      "History",
      "Geography",
      "Traditions",
      "Wildlife"
    ],
    flagImageUrl: "https://flagcdn.com/th.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Thailand_relief_location_map.jpg/800px-Thailand_relief_location_map.jpg",
    iconType: "culture",
    continent: "Asia"
  },
  {
    id: "nigeria",
    name: "Nigeria",
    code: "NG",
    position: {
      lat: 9.0820,
      lng: 8.6753,
    },
    difficulty: "hard",
    categories: [
      "Culture",
      "History",
      "Music",
      "Film",
      "Food",
      "Languages",
      "Literature"
    ],
    flagImageUrl: "https://flagcdn.com/ng.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Nigeria_relief_location_map.jpg/800px-Nigeria_relief_location_map.jpg",
    iconType: "culture",
    continent: "Africa"
  },
  {
    id: "united-kingdom",
    name: "United Kingdom",
    code: "GB",
    position: {
      lat: 55.3781,
      lng: -3.4360,
    },
    difficulty: "medium",
    categories: [
      "History",
      "Literature",
      "Politics",
      "Music",
      "Sports",
      "Culture",
      "Art"
    ],
    flagImageUrl: "https://flagcdn.com/gb.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/United_Kingdom_relief_location_map.jpg/800px-United_Kingdom_relief_location_map.jpg",
    iconType: "landmark",
    continent: "Europe"
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    code: "NZ",
    position: {
      lat: -40.9006,
      lng: 174.8860,
    },
    difficulty: "medium",
    categories: [
      "Geography",
      "Indigenous Culture",
      "Wildlife",
      "Sports",
      "History",
      "Environment",
      "Cinema"
    ],
    flagImageUrl: "https://flagcdn.com/nz.svg",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/New_Zealand_relief_map.jpg/800px-New_Zealand_relief_map.jpg",
    iconType: "nature",
    continent: "Oceania"
  }
];

export default countries;
