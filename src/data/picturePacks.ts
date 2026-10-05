// Picture-based quiz packs grouped under "Do You Know These?"
// All image URLs are free, keyless CDN sources and have been verified to resolve:
//  - Logos & landmarks: Wikimedia Commons Special:FilePath (stable redirect)
//  - Flags: flagcdn.com

export type PicturePackId =
  | 'car-logos'
  | 'company-logos'
  | 'flags'
  | 'landmarks'
  | 'currencies'
  | 'sports-logos'
  | 'movie-posters';

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
  questionPrompt: string;
  /** Logos are mostly flat/dark artwork and need a light tile behind them. */
  lightTile: boolean;
  items: PictureItem[];
}

const commons = (file: string, width = 400) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`;
const flag = (code: string) => `https://flagcdn.com/w320/${code}.png`;

// Symbol-only logos (no brand name in the artwork) so the answer isn't given away.
const CARS: PictureItem[] = [
  { id: 'car-bmw', imageUrl: commons('BMW.svg'), answer: 'BMW', distractors: ['Audi', 'Mercedes-Benz', 'Volkswagen'] },
  { id: 'car-toyota', imageUrl: commons('Toyota_carlogo.svg'), answer: 'Toyota', distractors: ['Honda', 'Nissan', 'Hyundai'] },
  { id: 'car-tesla', imageUrl: commons('Tesla_T_symbol.svg'), answer: 'Tesla', distractors: ['Rivian', 'Lucid', 'Polestar'] },
  { id: 'car-audi', imageUrl: commons('Audi-Logo_2016.svg'), answer: 'Audi', distractors: ['BMW', 'Volkswagen', 'Opel'] },
  { id: 'car-mercedes', imageUrl: commons('Mercedes-Benz_free_logo.svg'), answer: 'Mercedes-Benz', distractors: ['BMW', 'Audi', 'Lexus'] },
  { id: 'car-porsche', imageUrl: commons('Newporschecrest.jpg'), answer: 'Porsche', distractors: ['Ferrari', 'Aston Martin', 'Bugatti'] },
  { id: 'car-vw', imageUrl: commons('Volkswagen_logo_2019.svg'), answer: 'Volkswagen', distractors: ['Audi', 'Skoda', 'Seat'] },
  { id: 'car-mitsubishi', imageUrl: commons('Mitsubishi_logo.svg'), answer: 'Mitsubishi', distractors: ['Subaru', 'Isuzu', 'Suzuki'] },
  { id: 'car-renault', imageUrl: commons('Renault_2021.svg'), answer: 'Renault', distractors: ['Peugeot', 'Citroën', 'Dacia'] },
  { id: 'car-mazda', imageUrl: commons('Mazda_logo.svg'), answer: 'Mazda', distractors: ['Nissan', 'Honda', 'Subaru'] },
  { id: 'car-citroen', imageUrl: commons('Citroen_2022.svg'), answer: 'Citroën', distractors: ['Renault', 'Peugeot', 'DS'] },
  { id: 'car-suzuki', imageUrl: commons('Suzuki_logo_2.svg'), answer: 'Suzuki', distractors: ['Yamaha', 'Kawasaki', 'Daihatsu'] },
  { id: 'car-acura', imageUrl: commons('Acura_logo.svg'), answer: 'Acura', distractors: ['Infiniti', 'Lexus', 'Genesis'] },
  { id: 'car-infiniti', imageUrl: commons('Infiniti_logo.svg'), answer: 'Infiniti', distractors: ['Acura', 'Lexus', 'Genesis'] },
  { id: 'car-volvo', imageUrl: commons('Volvo_logo.svg'), answer: 'Volvo', distractors: ['Saab', 'Scania', 'Polestar'] },
  { id: 'car-rolls', imageUrl: commons('Rolls-Royce_Motor_Cars_logo.svg'), answer: 'Rolls-Royce', distractors: ['Bentley', 'Maybach', 'Aston Martin'] },
];

// Symbol/icon-only logos so the answer isn't spelled out in the image.
const COMPANIES: PictureItem[] = [
  { id: 'co-apple', imageUrl: commons('Apple_logo_black.svg'), answer: 'Apple', distractors: ['Samsung', 'Xiaomi', 'Huawei'] },
  { id: 'co-google', imageUrl: commons('Google_%22G%22_logo.svg'), answer: 'Google', distractors: ['Bing', 'Yahoo', 'DuckDuckGo'] },
  { id: 'co-amazon', imageUrl: commons('Amazon_icon.svg'), answer: 'Amazon', distractors: ['eBay', 'Alibaba', 'Walmart'] },
  { id: 'co-netflix', imageUrl: commons('Netflix_icon.svg'), answer: 'Netflix', distractors: ['Hulu', 'Disney+', 'HBO Max'] },
  { id: 'co-spotify', imageUrl: commons('Spotify_icon.svg'), answer: 'Spotify', distractors: ['Apple Music', 'Tidal', 'Deezer'] },
  { id: 'co-nike', imageUrl: commons('Logo_NIKE.svg'), answer: 'Nike', distractors: ['Adidas', 'Puma', 'Reebok'] },
  { id: 'co-pepsi', imageUrl: commons('Pepsi_logo_2014.svg'), answer: 'Pepsi', distractors: ['Coca-Cola', 'Dr Pepper', 'Fanta'] },
  { id: 'co-mcd', imageUrl: commons("McDonald%27s_Golden_Arches.svg"), answer: "McDonald's", distractors: ['Burger King', 'KFC', "Wendy's"] },
  { id: 'co-target', imageUrl: commons('Target_logo.svg'), answer: 'Target', distractors: ['Walmart', 'Costco', "Best Buy"] },
  { id: 'co-twitter', imageUrl: commons('Logo_of_Twitter.svg'), answer: 'Twitter', distractors: ['Facebook', 'Instagram', 'Threads'] },
  { id: 'co-telegram', imageUrl: commons('Telegram_2019_Logo.svg'), answer: 'Telegram', distractors: ['WhatsApp', 'Signal', 'WeChat'] },
  { id: 'co-chrome', imageUrl: commons('Google_Chrome_icon_(February_2022).svg'), answer: 'Chrome', distractors: ['Firefox', 'Safari', 'Edge'] },
  { id: 'co-firefox', imageUrl: commons('Firefox_logo,_2019.svg'), answer: 'Firefox', distractors: ['Chrome', 'Opera', 'Brave'] },
  { id: 'co-windows', imageUrl: commons('Windows_logo_-_2012_derivative.svg'), answer: 'Windows', distractors: ['macOS', 'Linux', 'ChromeOS'] },
  { id: 'co-dominos', imageUrl: commons('Dominos_pizza_logo.svg'), answer: "Domino's", distractors: ['Pizza Hut', "Papa John's", 'Little Caesars'] },
  { id: 'co-playstation', imageUrl: commons('PlayStation_logo.svg'), answer: 'PlayStation', distractors: ['Xbox', 'Nintendo', 'Steam'] },
  { id: 'co-xbox', imageUrl: commons('Xbox_one_logo.svg'), answer: 'Xbox', distractors: ['PlayStation', 'Nintendo', 'Sega'] },
  { id: 'co-whatsapp', imageUrl: commons('WhatsApp.svg'), answer: 'WhatsApp', distractors: ['Telegram', 'Signal', 'Messenger'] },
  { id: 'co-instagram', imageUrl: commons('Instagram_icon.png'), answer: 'Instagram', distractors: ['Pinterest', 'Flickr', 'Snapchat'] },
  { id: 'co-pinterest', imageUrl: commons('Pinterest_Logo.svg'), answer: 'Pinterest', distractors: ['Instagram', 'Tumblr', 'Reddit'] },
  { id: 'co-linkedin', imageUrl: commons('LinkedIn_icon.svg'), answer: 'LinkedIn', distractors: ['Indeed', 'Xing', 'Glassdoor'] },
  { id: 'co-mastercard', imageUrl: commons('Mastercard-logo.svg'), answer: 'Mastercard', distractors: ['Visa', 'Maestro', 'Amex'] },
  { id: 'co-airbnb', imageUrl: commons('Airbnb_Logo_B%C3%A9lo.svg'), answer: 'Airbnb', distractors: ['Booking.com', 'Vrbo', 'Expedia'] },
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

// Freely licensed banknote photographs from Wikimedia Commons.
const CURRENCIES: PictureItem[] = [
  { id: 'money-in', imageUrl: commons('India new 2000 INR, MG series, 2016, obverse.jpg', 700), answer: 'Indian Rupee', distractors: ['Pakistani Rupee', 'Nepalese Rupee', 'Sri Lankan Rupee'] },
  { id: 'money-jp', imageUrl: commons('10000 yen banknote (Series E), obverse.png', 700), answer: 'Japanese Yen', distractors: ['Chinese Yuan', 'South Korean Won', 'Thai Baht'] },
  { id: 'money-us', imageUrl: commons('Obverse of the series 2009 $100 Federal Reserve Note.jpg', 700), answer: 'US Dollar', distractors: ['Canadian Dollar', 'Australian Dollar', 'New Zealand Dollar'] },
  { id: 'money-ch', imageUrl: commons('CHF 1000 9 front.jpg', 700), answer: 'Swiss Franc', distractors: ['Swedish Krona', 'Norwegian Krone', 'Danish Krone'] },
  { id: 'money-br', imageUrl: commons('100 Brazil real Second Obverse.jpg', 700), answer: 'Brazilian Real', distractors: ['Argentine Peso', 'Mexican Peso', 'Colombian Peso'] },
  { id: 'money-kr', imageUrl: commons('50000 won banknote.jpg', 700), answer: 'South Korean Won', distractors: ['Japanese Yen', 'Chinese Yuan', 'Vietnamese Dong'] },
  { id: 'money-ca', imageUrl: commons('Twenty Dollar Bill - Currency from Canada (45287899755).jpg', 700), answer: 'Canadian Dollar', distractors: ['US Dollar', 'Australian Dollar', 'New Zealand Dollar'] },
  { id: 'money-au', imageUrl: commons('Aud20p.jpg', 700), answer: 'Australian Dollar', distractors: ['Canadian Dollar', 'New Zealand Dollar', 'Singapore Dollar'] },
  { id: 'money-eu', imageUrl: commons('The Europa series 20 € obverse side.jpg', 700), answer: 'Euro', distractors: ['British Pound', 'Swiss Franc', 'Polish Złoty'] },
  { id: 'money-ru', imageUrl: commons('100 rubles obverse 2004 and 2022.jpg', 700), answer: 'Russian Ruble', distractors: ['Ukrainian Hryvnia', 'Belarusian Ruble', 'Kazakhstani Tenge'] },
  { id: 'money-ph', imageUrl: commons('NDS obverse 500 Philippine peso bill.jpg', 700), answer: 'Philippine Peso', distractors: ['Mexican Peso', 'Thai Baht', 'Malaysian Ringgit'] },
  { id: 'money-id', imageUrl: commons('5000 rupiah bill, 2001 series (2009 date), processed, obverse and reverse.jpg', 700), answer: 'Indonesian Rupiah', distractors: ['Indian Rupee', 'Malaysian Ringgit', 'Vietnamese Dong'] },
];

// Freely licensed club and franchise marks available on Wikimedia Commons.
const SPORTS_LOGOS: PictureItem[] = [
  { id: 'sport-real-madrid', imageUrl: commons('Real de Madrid football 1902-1908 logo.svg'), answer: 'Real Madrid', distractors: ['Barcelona', 'Atlético Madrid', 'Valencia'] },
  { id: 'sport-bayern', imageUrl: commons('FC Bayern München logo (2024).svg'), answer: 'Bayern Munich', distractors: ['Borussia Dortmund', 'Bayer Leverkusen', 'RB Leipzig'] },
  { id: 'sport-juventus', imageUrl: commons('Juventus FC - logo black (Italy, 2020).svg'), answer: 'Juventus', distractors: ['AC Milan', 'Inter Milan', 'Napoli'] },
  { id: 'sport-arsenal', imageUrl: commons('Arsenal Crest Art Deco.svg'), answer: 'Arsenal', distractors: ['Chelsea', 'Liverpool', 'Manchester City'] },
  { id: 'sport-bulls', imageUrl: commons('Logo of Chicago Bulls.svg'), answer: 'Chicago Bulls', distractors: ['Miami Heat', 'Detroit Pistons', 'Houston Rockets'] },
  { id: 'sport-yankees', imageUrl: commons('NewYorkYankees caplogo.svg'), answer: 'New York Yankees', distractors: ['New York Mets', 'Boston Red Sox', 'Los Angeles Dodgers'] },
  { id: 'sport-red-sox', imageUrl: commons('Boston Red Sox cap logo.svg'), answer: 'Boston Red Sox', distractors: ['Chicago Cubs', 'Cincinnati Reds', 'Cleveland Guardians'] },
  { id: 'sport-packers', imageUrl: commons('Green Bay Packers logo.svg'), answer: 'Green Bay Packers', distractors: ['New York Jets', 'Philadelphia Eagles', 'Seattle Seahawks'] },
  { id: 'sport-cowboys', imageUrl: commons('Dallas Cowboys.svg'), answer: 'Dallas Cowboys', distractors: ['Houston Texans', 'Denver Broncos', 'Buffalo Bills'] },
  { id: 'sport-mets', imageUrl: commons('New York Mets Insignia.svg'), answer: 'New York Mets', distractors: ['New York Yankees', 'San Francisco Giants', 'Detroit Tigers'] },
  { id: 'sport-celtics', imageUrl: commons('Celtics6.png'), answer: 'Boston Celtics', distractors: ['Milwaukee Bucks', 'Philadelphia 76ers', 'Dallas Mavericks'] },
];

// Public-domain and freely licensed posters for classic films.
const MOVIE_POSTERS: PictureItem[] = [
  { id: 'movie-metropolis', imageUrl: commons('Boris Bilinski (1900-1948) Plakat für den Film Metropolis (1).jpg', 600), answer: 'Metropolis', distractors: ['Nosferatu', 'M', 'The Cabinet of Dr. Caligari'] },
  { id: 'movie-living-dead', imageUrl: commons('Night Of The Living Dead (1968) - Poster.jpg', 600), answer: 'Night of the Living Dead', distractors: ['Dawn of the Dead', 'Carnival of Souls', 'House on Haunted Hill'] },
  { id: 'movie-general', imageUrl: commons('The General (1926) - Movie Poster 2.png', 600), answer: 'The General', distractors: ['The Navigator', 'Steamboat Bill, Jr.', 'Sherlock Jr.'] },
  { id: 'movie-sherlock', imageUrl: commons('Sherlock jr poster.jpg', 600), answer: 'Sherlock Jr.', distractors: ['The General', 'The Kid', 'Safety Last!'] },
  { id: 'movie-his-girl-friday', imageUrl: commons('His Girl Friday (1940 poster).jpg', 600), answer: 'His Girl Friday', distractors: ['Bringing Up Baby', 'The Philadelphia Story', 'Holiday'] },
  { id: 'movie-the-kid', imageUrl: commons('The Kid (1921) poster.jpg', 600), answer: 'The Kid', distractors: ['City Lights', 'Modern Times', 'The Gold Rush'] },
  { id: 'movie-gold-rush', imageUrl: commons('Gold rush poster.jpg', 600), answer: 'The Gold Rush', distractors: ['The Kid', 'The Circus', 'City Lights'] },
  { id: 'movie-moon', imageUrl: commons('Trip-to-moon-1902.jpg', 600), answer: 'A Trip to the Moon', distractors: ['The Impossible Voyage', 'Metropolis', 'The Lost World'] },
  { id: 'movie-phantom', imageUrl: commons('The Phantom of the Opera (1925).jpg', 600), answer: 'The Phantom of the Opera', distractors: ['Dracula', 'Frankenstein', 'The Hunchback of Notre Dame'] },
  { id: 'movie-dracula', imageUrl: commons('Dracula (1931 insert poster).jpg', 600), answer: 'Dracula', distractors: ['The Mummy', 'The Wolf Man', 'Frankenstein'] },
  { id: 'movie-frankenstein', imageUrl: commons('Frankenstein poster 1931.jpg', 600), answer: 'Frankenstein', distractors: ['Dracula', 'The Invisible Man', 'The Mummy'] },
];

export const PICTURE_PACKS: PicturePack[] = [
  { id: 'car-logos', title: 'Car Logos', emoji: '🚗', description: 'Guess the car brand from its badge', questionPrompt: 'Which car brand is this?', lightTile: true, items: CARS },
  { id: 'company-logos', title: 'Company Logos', emoji: '🏢', description: 'Global brands you see every day', questionPrompt: 'Which company is this?', lightTile: true, items: COMPANIES },
  { id: 'flags', title: 'Flags of the World', emoji: '🚩', description: 'Identify the country from its flag', questionPrompt: 'Which country has this flag?', lightTile: false, items: FLAGS },
  { id: 'landmarks', title: 'Famous Landmarks', emoji: '🗺️', description: 'Iconic places around the globe', questionPrompt: 'Which landmark is this?', lightTile: false, items: LANDMARKS },
  { id: 'currencies', title: 'Currencies & Banknotes', emoji: '💵', description: 'Match the banknote to its currency', questionPrompt: 'Which currency is this?', lightTile: true, items: CURRENCIES },
  { id: 'sports-logos', title: 'Sports Team Logos', emoji: '🏆', description: 'Recognise famous teams from their emblems', questionPrompt: 'Which sports team is this?', lightTile: true, items: SPORTS_LOGOS },
  { id: 'movie-posters', title: 'Classic Movie Posters', emoji: '🎬', description: 'Name the film from its original poster', questionPrompt: 'Which movie poster is this?', lightTile: false, items: MOVIE_POSTERS },
];

export const getPack = (id: PicturePackId) => PICTURE_PACKS.find((p) => p.id === id);
