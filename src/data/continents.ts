
export interface Continent {
  id: string;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  countries: string[];
  iconType: 'landmark' | 'trophy' | 'globe';
  mapImageUrl?: string;
}

const continents: Continent[] = [
  {
    id: "africa",
    name: "Africa",
    position: {
      lat: 8.7832,
      lng: 34.5085,
    },
    countries: ["kenya", "egypt", "south_africa", "nigeria", "morocco"],
    iconType: "globe",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Africa_%28orthographic_projection%29.svg/800px-Africa_%28orthographic_projection%29.svg.png"
  },
  {
    id: "asia",
    name: "Asia",
    position: {
      lat: 34.0479,
      lng: 100.6197,
    },
    countries: ["japan", "india", "china", "thailand", "israel"],
    iconType: "globe",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Asia_%28orthographic_projection%29.svg/800px-Asia_%28orthographic_projection%29.svg.png"
  },
  {
    id: "europe",
    name: "Europe",
    position: {
      lat: 54.5260,
      lng: 15.2551,
    },
    countries: ["italy", "france", "germany", "uk", "spain"],
    iconType: "globe",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Europe_orthographic_Caucasus_Urals_boundary_%28with_borders%29.svg/800px-Europe_orthographic_Caucasus_Urals_boundary_%28with_borders%29.svg.png"
  },
  {
    id: "north_america",
    name: "North America",
    position: {
      lat: 54.5260,
      lng: -105.2551,
    },
    countries: ["usa", "canada", "mexico"],
    iconType: "globe",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Location_North_America.svg/800px-Location_North_America.svg.png"
  },
  {
    id: "south_america",
    name: "South America",
    position: {
      lat: -8.7832,
      lng: -55.4915,
    },
    countries: ["brazil", "argentina", "peru", "colombia"],
    iconType: "globe",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/South_America_%28orthographic_projection%29.svg/800px-South_America_%28orthographic_projection%29.svg.png"
  },
  {
    id: "oceania",
    name: "Oceania",
    position: {
      lat: -22.7359,
      lng: 140.0188,
    },
    countries: ["australia", "new_zealand"],
    iconType: "globe",
    mapImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Oceania_%28orthographic_projection%29.svg/800px-Oceania_%28orthographic_projection%29.svg.png"
  },
];

export default continents;
