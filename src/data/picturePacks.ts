// Picture-based quiz packs grouped under "Do You Know These?"
// All image URLs are free, keyless CDN sources and have been verified to resolve:
//  - Logos & landmarks: Wikimedia Commons Special:FilePath (stable redirect)
//  - Flags: flagcdn.com

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
  /** Logos are mostly flat/dark artwork and need a light tile behind them. */
  lightTile: boolean;
  items: PictureItem[];
}

const commons = (file: string, width = 400) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`;
const flag = (code: string) => `https://flagcdn.com/w320/${code}.png`;

const CARS: PictureItem[] = [
  { id: 'car-bmw', imageUrl: commons('BMW.svg'), answer: 'BMW', distractors: ['Audi', 'Mercedes-Benz', 'Volkswagen'] },
  { id: 'car-toyota', imageUrl: commons('Toyota_carlogo.svg'), answer: 'Toyota', distractors: ['Honda', 'Nissan', 'Hyundai'] },
  { id: 'car-tesla', imageUrl: commons('Tesla_T_symbol.svg'), answer: 'Tesla', distractors: ['Rivian', 'Lucid', 'Polestar'] },
  { id: 'car-audi', imageUrl: commons('Audi-Logo_2016.svg'), answer: 'Audi', distractors: ['BMW', 'Volkswagen', 'Opel'] },
  { id: 'car-mercedes', imageUrl: commons('Mercedes-Benz_Logo_2010.svg'), answer: 'Mercedes-Benz', distractors: ['BMW', 'Audi', 'Lexus'] },
  { id: 'car-honda', imageUrl: commons('Honda_Logo.svg'), answer: 'Honda', distractors: ['Toyota', 'Hyundai', 'Suzuki'] },
  { id: 'car-ford', imageUrl: commons('Ford_logo_flat.svg'), answer: 'Ford', distractors: ['Chevrolet', 'Dodge', 'Chrysler'] },
  { id: 'car-porsche', imageUrl: commons('Newporschecrest.jpg'), answer: 'Porsche', distractors: ['Ferrari', 'Aston Martin', 'Bugatti'] },
  { id: 'car-lambo', imageUrl: commons('Lamborghini_logo.svg'), answer: 'Lamborghini', distractors: ['Ferrari', 'Bugatti', 'McLaren'] },
  { id: 'car-vw', imageUrl: commons('Volkswagen_logo_2019.svg'), answer: 'Volkswagen', distractors: ['Audi', 'Skoda', 'Seat'] },
  { id: 'car-nissan', imageUrl: commons('Nissan_2020_logo.svg'), answer: 'Nissan', distractors: ['Toyota', 'Mitsubishi', 'Mazda'] },
  { id: 'car-subaru', imageUrl: commons('Subaru_logo.svg'), answer: 'Subaru', distractors: ['Mazda', 'Mitsubishi', 'Isuzu'] },
  { id: 'car-hyundai', imageUrl: commons('Hyundai_Motor_Company_logo.svg'), answer: 'Hyundai', distractors: ['Kia', 'Honda', 'Daewoo'] },
  { id: 'car-jeep', imageUrl: commons('Jeep_wordmark.svg'), answer: 'Jeep', distractors: ['Land Rover', 'GMC', 'Ram'] },
];

const COMPANIES: PictureItem[] = [
  { id: 'co-apple', imageUrl: commons('Apple_logo_black.svg'), answer: 'Apple', distractors: ['Samsung', 'Xiaomi', 'Huawei'] },
  { id: 'co-google', imageUrl: commons('Google_%22G%22_logo.svg'), answer: 'Google', distractors: ['Bing', 'Yahoo', 'DuckDuckGo'] },
  { id: 'co-microsoft', imageUrl: commons('Microsoft_logo_(2012).svg'), answer: 'Microsoft', distractors: ['Apple', 'IBM', 'Oracle'] },
  { id: 'co-amazon', imageUrl: commons('Amazon_icon.svg'), answer: 'Amazon', distractors: ['eBay', 'Alibaba', 'Walmart'] },
  { id: 'co-netflix', imageUrl: commons('Netflix_icon.svg'), answer: 'Netflix', distractors: ['Hulu', 'Disney+', 'HBO Max'] },
  { id: 'co-spotify', imageUrl: commons('Spotify_icon.svg'), answer: 'Spotify', distractors: ['Apple Music', 'Tidal', 'Deezer'] },
  { id: 'co-nike', imageUrl: commons('Logo_NIKE.svg'), answer: 'Nike', distractors: ['Adidas', 'Puma', 'Reebok'] },
  { id: 'co-adidas', imageUrl: commons('Adidas_Logo.svg'), answer: 'Adidas', distractors: ['Nike', 'Puma', 'Under Armour'] },
  { id: 'co-pepsi', imageUrl: commons('Pepsi_2023.svg'), answer: 'Pepsi', distractors: ['Coca-Cola', 'Dr Pepper', 'Fanta'] },
  { id: 'co-mcd', imageUrl: commons("McDonald%27s_Golden_Arches.svg"), answer: "McDonald's", distractors: ['Burger King', 'KFC', "Wendy's"] },
  { id: 'co-bk', imageUrl: commons('Burger_King_2020.svg'), answer: 'Burger King', distractors: ["McDonald's", 'KFC', 'Subway'] },
  { id: 'co-ikea', imageUrl: commons('Ikea_logo.svg'), answer: 'IKEA', distractors: ['Wayfair', 'JYSK', 'West Elm'] },
  { id: 'co-meta', imageUrl: commons('Meta_Platforms_Inc._logo.svg'), answer: 'Meta', distractors: ['Twitter', 'Snapchat', 'TikTok'] },
  { id: 'co-whatsapp', imageUrl: commons('WhatsApp.svg'), answer: 'WhatsApp', distractors: ['Telegram', 'Signal', 'WeChat'] },
  { id: 'co-instagram', imageUrl: commons('Instagram_icon.png'), answer: 'Instagram', distractors: ['Pinterest', 'Flickr', 'Snapchat'] },
  { id: 'co-pinterest', imageUrl: commons('Pinterest_Logo.svg'), answer: 'Pinterest', distractors: ['Instagram', 'Tumblr', 'Reddit'] },
  { id: 'co-linkedin', imageUrl: commons('LinkedIn_icon.svg'), answer: 'LinkedIn', distractors: ['Indeed', 'Xing', 'Glassdoor'] },
  { id: 'co-visa', imageUrl: commons('Visa_Inc._logo.svg'), answer: 'Visa', distractors: ['Mastercard', 'Amex', 'Discover'] },
  { id: 'co-mastercard', imageUrl: commons('Mastercard-logo.svg'), answer: 'Mastercard', distractors: ['Visa', 'Maestro', 'Amex'] },
  { id: 'co-paypal', imageUrl: commons('PayPal.svg'), answer: 'PayPal', distractors: ['Stripe', 'Skrill', 'Venmo'] },
  { id: 'co-airbnb', imageUrl: commons('Airbnb_Logo_B%C3%A9lo.svg'), answer: 'Airbnb', distractors: ['Booking.com', 'Vrbo', 'Expedia'] },
  { id: 'co-uber', imageUrl: commons('Uber_logo_2018.svg'), answer: 'Uber', distractors: ['Lyft', 'Bolt', 'Grab'] },
  { id: 'co-fedex', imageUrl: commons('FedEx_Express.svg'), answer: 'FedEx', distractors: ['DHL', 'UPS', 'TNT'] },
  { id: 'co-youtube', imageUrl: commons('Youtube_logo.png'), answer: 'YouTube', distractors: ['Vimeo', 'Twitch', 'Dailymotion'] },
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
  { id: 'fl-ng', imageUrl: flag('ng'), answer: 'Nigeria', distractors: ['Italy', 'Ireland', 'Peru'] },
  { id: 'fl-ar', imageUrl: flag('ar'), answer: 'Argentina', distractors: ['Uruguay', 'Greece', 'Guatemala'] },
  { id: 'fl-kr', imageUrl: flag('kr'), answer: 'South Korea', distractors: ['Japan', 'North Korea', 'Taiwan'] },
  { id: 'fl-tr', imageUrl: flag('tr'), answer: 'Turkey', distractors: ['Tunisia', 'Morocco', 'Pakistan'] },
];

const LANDMARKS: PictureItem[] = [
  { id: 'lm-eiffel', imageUrl: commons('Tour_Eiffel_Wikimedia_Commons.jpg'), answer: 'Eiffel Tower', distractors: ['Tokyo Tower', 'CN Tower', 'Blackpool Tower'] },
  { id: 'lm-pyramids', imageUrl: commons('All_Gizah_Pyramids.jpg'), answer: 'Pyramids of Giza', distractors: ['Chichen Itza', 'Teotihuacan', 'Nubian Pyramids'] },
  { id: 'lm-taj', imageUrl: commons('Taj_Mahal_(Edited).jpeg'), answer: 'Taj Mahal', distractors: ["Humayun's Tomb", 'Badshahi Mosque', 'Blue Mosque'] },
  { id: 'lm-colosseum', imageUrl: commons('Colosseo_2020.jpg'), answer: 'Colosseum', distractors: ['Roman Forum', 'Pantheon', 'Arena of Verona'] },
  { id: 'lm-christ', imageUrl: commons('Christ_the_Redeemer_-_Cristo_Redentor.jpg'), answer: 'Christ the Redeemer', distractors: ['Statue of Liberty', 'Motherland Calls', 'Statue of Unity'] },
  { id: 'lm-liberty', imageUrl: commons('Statue_of_Liberty_7.jpg'), answer: 'Statue of Liberty', distractors: ['Christ the Redeemer', 'Statue of Unity', 'Colossus of Rhodes'] },
  { id: 'lm-opera', imageUrl: commons('Sydney_Opera_House_-_Dec_2008.jpg'), answer: 'Sydney Opera House', distractors: ['Oslo Opera House', 'Guangzhou Opera House', 'Esplanade Singapore'] },
  { id: 'lm-wall', imageUrl: commons('The_Great_Wall_of_China_at_Jinshanling-edit.jpg'), answer: 'Great Wall of China', distractors: ["Hadrian's Wall", 'Walls of Ston', 'Western Wall'] },
  { id: 'lm-machu', imageUrl: commons('80_-_Machu_Picchu_-_Juin_2009_-_edit.2.jpg'), answer: 'Machu Picchu', distractors: ['Chichen Itza', 'Tikal', 'Sacsayhuaman'] },
  { id: 'lm-bigben', imageUrl: commons('Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg'), answer: 'Big Ben', distractors: ['Westminster Abbey', 'Tower Bridge', 'Buckingham Palace'] },
  { id: 'lm-petra', imageUrl: commons('Petra_Jordan_BW_21.JPG'), answer: 'Petra', distractors: ['Palmyra', 'Baalbek', 'Persepolis'] },
];

export const PICTURE_PACKS: PicturePack[] = [
  { id: 'car-logos', title: 'Car Logos', emoji: '🚗', description: 'Guess the car brand from its badge', lightTile: true, items: CARS },
  { id: 'company-logos', title: 'Company Logos', emoji: '🏢', description: 'Global brands you see every day', lightTile: true, items: COMPANIES },
  { id: 'flags', title: 'Flags of the World', emoji: '🚩', description: 'Identify the country from its flag', lightTile: false, items: FLAGS },
  { id: 'landmarks', title: 'Famous Landmarks', emoji: '🗺️', description: 'Iconic places around the globe', lightTile: false, items: LANDMARKS },
];

export const getPack = (id: PicturePackId) => PICTURE_PACKS.find((p) => p.id === id);
