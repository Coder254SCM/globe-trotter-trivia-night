// Picture-based quiz packs grouped under "Do You Know These?"
// Free CDN image sources:
//  - Logos: Clearbit Logo API (https://logo.clearbit.com/<domain>) — free, no key
//  - Flags: flagcdn.com — free, no key
//  - Landmarks: Wikimedia Commons Special:FilePath (stable redirect)

export type PicturePackId = 'car-logos' | 'company-logos' | 'flags' | 'landmarks';

export interface PictureItem {
  id: string;
  imageUrl: string;
  answer: string;
  distractors: string[]; // 3 wrong options
}

export interface PicturePack {
  id: PicturePackId;
  title: string;
  emoji: string;
  description: string;
  items: PictureItem[];
}

const carLogo = (domain: string) => `https://logo.clearbit.com/${domain}?size=256`;
const companyLogo = (domain: string) => `https://logo.clearbit.com/${domain}?size=256`;
const flag = (code: string) => `https://flagcdn.com/w320/${code}.png`;
const landmark = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=400`;

const CARS: PictureItem[] = [
  { id: 'car-bmw', imageUrl: carLogo('bmw.com'), answer: 'BMW', distractors: ['Audi', 'Mercedes-Benz', 'Volkswagen'] },
  { id: 'car-toyota', imageUrl: carLogo('toyota.com'), answer: 'Toyota', distractors: ['Honda', 'Nissan', 'Mazda'] },
  { id: 'car-ferrari', imageUrl: carLogo('ferrari.com'), answer: 'Ferrari', distractors: ['Lamborghini', 'Porsche', 'Maserati'] },
  { id: 'car-tesla', imageUrl: carLogo('tesla.com'), answer: 'Tesla', distractors: ['Rivian', 'Lucid', 'Polestar'] },
  { id: 'car-audi', imageUrl: carLogo('audi.com'), answer: 'Audi', distractors: ['BMW', 'Volkswagen', 'Opel'] },
  { id: 'car-mercedes', imageUrl: carLogo('mercedes-benz.com'), answer: 'Mercedes-Benz', distractors: ['BMW', 'Audi', 'Lexus'] },
  { id: 'car-honda', imageUrl: carLogo('honda.com'), answer: 'Honda', distractors: ['Toyota', 'Hyundai', 'Kia'] },
  { id: 'car-ford', imageUrl: carLogo('ford.com'), answer: 'Ford', distractors: ['Chevrolet', 'Dodge', 'Chrysler'] },
  { id: 'car-porsche', imageUrl: carLogo('porsche.com'), answer: 'Porsche', distractors: ['Ferrari', 'Aston Martin', 'Bugatti'] },
  { id: 'car-lambo', imageUrl: carLogo('lamborghini.com'), answer: 'Lamborghini', distractors: ['Ferrari', 'Bugatti', 'McLaren'] },
  { id: 'car-vw', imageUrl: carLogo('volkswagen.com'), answer: 'Volkswagen', distractors: ['Audi', 'Skoda', 'Seat'] },
  { id: 'car-nissan', imageUrl: carLogo('nissan-global.com'), answer: 'Nissan', distractors: ['Toyota', 'Mitsubishi', 'Subaru'] },
];

const COMPANIES: PictureItem[] = [
  { id: 'co-apple', imageUrl: companyLogo('apple.com'), answer: 'Apple', distractors: ['Samsung', 'Xiaomi', 'Huawei'] },
  { id: 'co-google', imageUrl: companyLogo('google.com'), answer: 'Google', distractors: ['Bing', 'Yahoo', 'DuckDuckGo'] },
  { id: 'co-microsoft', imageUrl: companyLogo('microsoft.com'), answer: 'Microsoft', distractors: ['Apple', 'IBM', 'Oracle'] },
  { id: 'co-amazon', imageUrl: companyLogo('amazon.com'), answer: 'Amazon', distractors: ['eBay', 'Alibaba', 'Walmart'] },
  { id: 'co-netflix', imageUrl: companyLogo('netflix.com'), answer: 'Netflix', distractors: ['Hulu', 'Disney+', 'HBO Max'] },
  { id: 'co-spotify', imageUrl: companyLogo('spotify.com'), answer: 'Spotify', distractors: ['Apple Music', 'Tidal', 'Deezer'] },
  { id: 'co-nike', imageUrl: companyLogo('nike.com'), answer: 'Nike', distractors: ['Adidas', 'Puma', 'Reebok'] },
  { id: 'co-adidas', imageUrl: companyLogo('adidas.com'), answer: 'Adidas', distractors: ['Nike', 'Puma', 'Under Armour'] },
  { id: 'co-coke', imageUrl: companyLogo('coca-cola.com'), answer: 'Coca-Cola', distractors: ['Pepsi', 'Dr Pepper', 'Fanta'] },
  { id: 'co-mcd', imageUrl: companyLogo('mcdonalds.com'), answer: "McDonald's", distractors: ['Burger King', 'KFC', 'Wendy\'s'] },
  { id: 'co-starbucks', imageUrl: companyLogo('starbucks.com'), answer: 'Starbucks', distractors: ['Costa', 'Dunkin\'', 'Tim Hortons'] },
  { id: 'co-ikea', imageUrl: companyLogo('ikea.com'), answer: 'IKEA', distractors: ['Wayfair', 'Ashley', 'West Elm'] },
];

const FLAGS: PictureItem[] = [
  { id: 'fl-jp', imageUrl: flag('jp'), answer: 'Japan', distractors: ['China', 'South Korea', 'Vietnam'] },
  { id: 'fl-br', imageUrl: flag('br'), answer: 'Brazil', distractors: ['Argentina', 'Colombia', 'Portugal'] },
  { id: 'fl-ca', imageUrl: flag('ca'), answer: 'Canada', distractors: ['United States', 'Norway', 'Denmark'] },
  { id: 'fl-de', imageUrl: flag('de'), answer: 'Germany', distractors: ['Belgium', 'Spain', 'Russia'] },
  { id: 'fl-fr', imageUrl: flag('fr'), answer: 'France', distractors: ['Netherlands', 'Italy', 'Russia'] },
  { id: 'fl-ke', imageUrl: flag('ke'), answer: 'Kenya', distractors: ['South Africa', 'Ghana', 'Malawi'] },
  { id: 'fl-in', imageUrl: flag('in'), answer: 'India', distractors: ['Niger', 'Ireland', 'Ivory Coast'] },
  { id: 'fl-au', imageUrl: flag('au'), answer: 'Australia', distractors: ['New Zealand', 'United Kingdom', 'Fiji'] },
  { id: 'fl-za', imageUrl: flag('za'), answer: 'South Africa', distractors: ['Kenya', 'Namibia', 'Zimbabwe'] },
  { id: 'fl-mx', imageUrl: flag('mx'), answer: 'Mexico', distractors: ['Italy', 'Ireland', 'Hungary'] },
  { id: 'fl-eg', imageUrl: flag('eg'), answer: 'Egypt', distractors: ['Syria', 'Iraq', 'Yemen'] },
  { id: 'fl-ch', imageUrl: flag('ch'), answer: 'Switzerland', distractors: ['Denmark', 'Georgia', 'Tonga'] },
];

const LANDMARKS: PictureItem[] = [
  { id: 'lm-eiffel', imageUrl: landmark('Tour_Eiffel_Wikimedia_Commons.jpg'), answer: 'Eiffel Tower', distractors: ['Tokyo Tower', 'CN Tower', 'Blackpool Tower'] },
  { id: 'lm-pyramids', imageUrl: landmark('All_Gizah_Pyramids.jpg'), answer: 'Pyramids of Giza', distractors: ['Chichen Itza', 'Teotihuacan', 'Nubian Pyramids'] },
  { id: 'lm-taj', imageUrl: landmark('Taj_Mahal_(Edited).jpeg'), answer: 'Taj Mahal', distractors: ['Humayun\'s Tomb', 'Badshahi Mosque', 'Blue Mosque'] },
  { id: 'lm-colosseum', imageUrl: landmark('Colosseo_2020.jpg'), answer: 'Colosseum', distractors: ['Roman Forum', 'Pantheon', 'Arena of Verona'] },
  { id: 'lm-christ', imageUrl: landmark('Christ_the_Redeemer_-_Cristo_Redentor.jpg'), answer: 'Christ the Redeemer', distractors: ['Statue of Liberty', 'Motherland Calls', 'Spring Temple Buddha'] },
  { id: 'lm-liberty', imageUrl: landmark('Statue_of_Liberty_7.jpg'), answer: 'Statue of Liberty', distractors: ['Christ the Redeemer', 'Statue of Unity', 'Colossus of Rhodes'] },
  { id: 'lm-opera', imageUrl: landmark('Sydney_Opera_House_-_Dec_2008.jpg'), answer: 'Sydney Opera House', distractors: ['Oslo Opera House', 'Guangzhou Opera', 'Esplanade Singapore'] },
  { id: 'lm-wall', imageUrl: landmark('The_Great_Wall_of_China_at_Jinshanling-edit.jpg'), answer: 'Great Wall of China', distractors: ['Hadrian\'s Wall', 'Walls of Ston', 'Western Wall'] },
  { id: 'lm-machu', imageUrl: landmark('Machu_Picchu,_Peru.jpg'), answer: 'Machu Picchu', distractors: ['Chichen Itza', 'Tikal', 'Cusco'] },
  { id: 'lm-bigben', imageUrl: landmark('Elizabeth_Tower,_June_2022.jpg'), answer: 'Big Ben', distractors: ['Westminster Abbey', 'Tower Bridge', 'Buckingham Palace'] },
  { id: 'lm-petra', imageUrl: landmark('The_Treasury,_Petra,_Jordan8.jpg'), answer: 'Petra', distractors: ['Palmyra', 'Baalbek', 'Persepolis'] },
  { id: 'lm-burj', imageUrl: landmark('Burj_Khalifa.jpg'), answer: 'Burj Khalifa', distractors: ['Shanghai Tower', 'One World Trade Center', 'Taipei 101'] },
];

export const PICTURE_PACKS: PicturePack[] = [
  { id: 'car-logos', title: 'Car Logos', emoji: '🚗', description: 'Guess the car brand from its logo', items: CARS },
  { id: 'company-logos', title: 'Company Logos', emoji: '🏢', description: 'Global brands you see every day', items: COMPANIES },
  { id: 'flags', title: 'Flags of the World', emoji: '🚩', description: 'Identify the country from its flag', items: FLAGS },
  { id: 'landmarks', title: 'Famous Landmarks', emoji: '🗺️', description: 'Iconic places around the globe', items: LANDMARKS },
];

export const getPack = (id: PicturePackId) => PICTURE_PACKS.find((p) => p.id === id);
