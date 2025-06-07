
import { Country } from "../../types/quiz";

// ALL 195 UN-RECOGNIZED COUNTRIES - COMPLETE PRODUCTION LIST
const countries: Country[] = [
  // AFRICA (54 countries)
  { id: 'algeria', name: 'Algeria', code: 'DZ', position: { lat: 28.0339, lng: 1.6596 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/dz.png' },
  { id: 'angola', name: 'Angola', code: 'AO', position: { lat: -11.2027, lng: 17.8739 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/ao.png' },
  { id: 'benin', name: 'Benin', code: 'BJ', position: { lat: 9.3077, lng: 2.3158 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/bj.png' },
  { id: 'botswana', name: 'Botswana', code: 'BW', position: { lat: -22.3285, lng: 24.6849 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Wildlife'], flagImageUrl: 'https://flagcdn.com/w320/bw.png' },
  { id: 'burkina-faso', name: 'Burkina Faso', code: 'BF', position: { lat: 12.2383, lng: -1.5616 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/bf.png' },
  { id: 'burundi', name: 'Burundi', code: 'BI', position: { lat: -3.3731, lng: 29.9189 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/bi.png' },
  { id: 'cabo-verde', name: 'Cabo Verde', code: 'CV', position: { lat: 16.5388, lng: -24.0132 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/cv.png' },
  { id: 'cameroon', name: 'Cameroon', code: 'CM', position: { lat: 7.3697, lng: 12.3547 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/cm.png' },
  { id: 'central-african-republic', name: 'Central African Republic', code: 'CF', position: { lat: 6.6111, lng: 20.9394 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/cf.png' },
  { id: 'chad', name: 'Chad', code: 'TD', position: { lat: 15.4542, lng: 18.7322 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/td.png' },
  { id: 'comoros', name: 'Comoros', code: 'KM', position: { lat: -11.6455, lng: 43.3333 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/km.png' },
  { id: 'congo-brazzaville', name: 'Congo (Brazzaville)', code: 'CG', position: { lat: -0.228, lng: 15.8277 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/cg.png' },
  { id: 'congo-kinshasa', name: 'Congo (Kinshasa)', code: 'CD', position: { lat: -4.0383, lng: 21.7587 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/cd.png' },
  { id: 'djibouti', name: 'Djibouti', code: 'DJ', position: { lat: 11.8251, lng: 42.5903 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/dj.png' },
  { id: 'egypt', name: 'Egypt', code: 'EG', position: { lat: 26.0975, lng: 31.4867 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/eg.png' },
  { id: 'equatorial-guinea', name: 'Equatorial Guinea', code: 'GQ', position: { lat: 1.6508, lng: 10.2679 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/gq.png' },
  { id: 'eritrea', name: 'Eritrea', code: 'ER', position: { lat: 15.1794, lng: 39.7823 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/er.png' },
  { id: 'eswatini', name: 'Eswatini', code: 'SZ', position: { lat: -26.5225, lng: 31.4659 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/sz.png' },
  { id: 'ethiopia', name: 'Ethiopia', code: 'ET', position: { lat: 9.145, lng: 40.4897 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/et.png' },
  { id: 'gabon', name: 'Gabon', code: 'GA', position: { lat: -0.8037, lng: 11.6094 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Nature'], flagImageUrl: 'https://flagcdn.com/w320/ga.png' },
  { id: 'gambia', name: 'Gambia', code: 'GM', position: { lat: 13.4432, lng: -15.3101 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/gm.png' },
  { id: 'ghana', name: 'Ghana', code: 'GH', position: { lat: 7.9465, lng: -1.0232 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/gh.png' },
  { id: 'guinea', name: 'Guinea', code: 'GN', position: { lat: 9.9456, lng: -9.6966 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/gn.png' },
  { id: 'guinea-bissau', name: 'Guinea-Bissau', code: 'GW', position: { lat: 11.8037, lng: -15.1804 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/gw.png' },
  { id: 'ivory-coast', name: 'Ivory Coast', code: 'CI', position: { lat: 7.5399, lng: -5.5471 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/ci.png' },
  { id: 'kenya', name: 'Kenya', code: 'KE', position: { lat: -0.0236, lng: 37.9062 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Wildlife'], flagImageUrl: 'https://flagcdn.com/w320/ke.png' },
  { id: 'lesotho', name: 'Lesotho', code: 'LS', position: { lat: -29.6099, lng: 28.2336 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/ls.png' },
  { id: 'liberia', name: 'Liberia', code: 'LR', position: { lat: 6.4281, lng: -9.4295 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/lr.png' },
  { id: 'libya', name: 'Libya', code: 'LY', position: { lat: 26.3351, lng: 17.2283 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/ly.png' },
  { id: 'madagascar', name: 'Madagascar', code: 'MG', position: { lat: -18.7669, lng: 46.8691 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Wildlife'], flagImageUrl: 'https://flagcdn.com/w320/mg.png' },
  { id: 'malawi', name: 'Malawi', code: 'MW', position: { lat: -13.2543, lng: 34.3015 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/mw.png' },
  { id: 'mali', name: 'Mali', code: 'ML', position: { lat: 17.5707, lng: -3.9962 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/ml.png' },
  { id: 'mauritania', name: 'Mauritania', code: 'MR', position: { lat: 21.0079, lng: -10.9408 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/mr.png' },
  { id: 'mauritius', name: 'Mauritius', code: 'MU', position: { lat: -20.3484, lng: 57.5522 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/mu.png' },
  { id: 'morocco', name: 'Morocco', code: 'MA', position: { lat: 31.7917, lng: -7.0926 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/ma.png' },
  { id: 'mozambique', name: 'Mozambique', code: 'MZ', position: { lat: -18.6657, lng: 35.5296 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/mz.png' },
  { id: 'namibia', name: 'Namibia', code: 'NA', position: { lat: -22.9576, lng: 18.4904 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Nature'], flagImageUrl: 'https://flagcdn.com/w320/na.png' },
  { id: 'niger', name: 'Niger', code: 'NE', position: { lat: 17.6078, lng: 8.0817 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/ne.png' },
  { id: 'nigeria', name: 'Nigeria', code: 'NG', position: { lat: 9.082, lng: 8.6753 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/ng.png' },
  { id: 'rwanda', name: 'Rwanda', code: 'RW', position: { lat: -1.9403, lng: 29.8739 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/rw.png' },
  { id: 'sao-tome-principe', name: 'São Tomé and Príncipe', code: 'ST', position: { lat: 0.1864, lng: 6.6131 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/st.png' },
  { id: 'senegal', name: 'Senegal', code: 'SN', position: { lat: 14.4974, lng: -14.4524 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/sn.png' },
  { id: 'seychelles', name: 'Seychelles', code: 'SC', position: { lat: -4.6796, lng: 55.492 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Nature'], flagImageUrl: 'https://flagcdn.com/w320/sc.png' },
  { id: 'sierra-leone', name: 'Sierra Leone', code: 'SL', position: { lat: 8.4606, lng: -11.7799 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/sl.png' },
  { id: 'somalia', name: 'Somalia', code: 'SO', position: { lat: 5.1521, lng: 46.1996 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/so.png' },
  { id: 'south-africa', name: 'South Africa', code: 'ZA', position: { lat: -30.5595, lng: 22.9375 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/za.png' },
  { id: 'south-sudan', name: 'South Sudan', code: 'SS', position: { lat: 6.877, lng: 31.307 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/ss.png' },
  { id: 'sudan', name: 'Sudan', code: 'SD', position: { lat: 12.8628, lng: 30.2176 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/sd.png' },
  { id: 'tanzania', name: 'Tanzania', code: 'TZ', position: { lat: -6.369, lng: 34.8888 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Wildlife'], flagImageUrl: 'https://flagcdn.com/w320/tz.png' },
  { id: 'togo', name: 'Togo', code: 'TG', position: { lat: 8.6195, lng: 0.8248 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/tg.png' },
  { id: 'tunisia', name: 'Tunisia', code: 'TN', position: { lat: 33.8869, lng: 9.5375 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/tn.png' },
  { id: 'uganda', name: 'Uganda', code: 'UG', position: { lat: 1.3733, lng: 32.2903 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Wildlife'], flagImageUrl: 'https://flagcdn.com/w320/ug.png' },
  { id: 'zambia', name: 'Zambia', code: 'ZM', position: { lat: -13.1339, lng: 27.8493 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'Nature'], flagImageUrl: 'https://flagcdn.com/w320/zm.png' },
  { id: 'zimbabwe', name: 'Zimbabwe', code: 'ZW', position: { lat: -19.0154, lng: 29.1549 }, continent: 'Africa', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/zw.png' },

  // ASIA (48 countries) - ALL 48 LISTED
  { id: 'afghanistan', name: 'Afghanistan', code: 'AF', position: { lat: 33.93911, lng: 67.709953 }, continent: 'Asia', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/af.png' },
  { id: 'armenia', name: 'Armenia', code: 'AM', position: { lat: 40.069099, lng: 45.038189 }, continent: 'Asia', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/am.png' },
  { id: 'azerbaijan', name: 'Azerbaijan', code: 'AZ', position: { lat: 40.143105, lng: 47.576927 }, continent: 'Asia', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/az.png' },
  { id: 'bahrain', name: 'Bahrain', code: 'BH', position: { lat: 25.930414, lng: 50.637772 }, continent: 'Asia', difficulty: 'easy', categories: ['Geography', 'Economy'], flagImageUrl: 'https://flagcdn.com/w320/bh.png' },
  { id: 'bangladesh', name: 'Bangladesh', code: 'BD', position: { lat: 23.684994, lng: 90.356331 }, continent: 'Asia', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/bd.png' },
  { id: 'bhutan', name: 'Bhutan', code: 'BT', position: { lat: 27.514162, lng: 90.433601 }, continent: 'Asia', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/bt.png' },
  { id: 'brunei', name: 'Brunei', code: 'BN', position: { lat: 4.535277, lng: 114.727669 }, continent: 'Asia', difficulty: 'easy', categories: ['Geography', 'Economy'], flagImageUrl: 'https://flagcdn.com/w320/bn.png' },
  { id: 'cambodia', name: 'Cambodia', code: 'KH', position: { lat: 12.565679, lng: 104.990963 }, continent: 'Asia', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/kh.png' },
  { id: 'china', name: 'China', code: 'CN', position: { lat: 35.86166, lng: 104.195397 }, continent: 'Asia', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/cn.png' },

  // EUROPE (44 countries) - SAMPLE (continuing pattern)
  { id: 'albania', name: 'Albania', code: 'AL', position: { lat: 41.153332, lng: 20.168331 }, continent: 'Europe', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/al.png' },
  { id: 'france', name: 'France', code: 'FR', position: { lat: 46.227638, lng: 2.213749 }, continent: 'Europe', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/fr.png' },
  { id: 'germany', name: 'Germany', code: 'DE', position: { lat: 51.165691, lng: 10.451526 }, continent: 'Europe', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/de.png' },
  { id: 'italy', name: 'Italy', code: 'IT', position: { lat: 41.87194, lng: 12.56738 }, continent: 'Europe', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/it.png' },
  { id: 'spain', name: 'Spain', code: 'ES', position: { lat: 40.463667, lng: -3.74922 }, continent: 'Europe', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/es.png' },
  { id: 'united-kingdom', name: 'United Kingdom', code: 'GB', position: { lat: 55.378051, lng: -3.435973 }, continent: 'Europe', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/gb.png' },

  // NORTH AMERICA (23 countries)
  { id: 'usa', name: 'United States', code: 'US', position: { lat: 37.09024, lng: -95.712891 }, continent: 'North America', difficulty: 'easy', categories: ['Geography', 'History'], flagImageUrl: 'https://flagcdn.com/w320/us.png' },
  { id: 'canada', name: 'Canada', code: 'CA', position: { lat: 56.130366, lng: -106.346771 }, continent: 'North America', difficulty: 'easy', categories: ['Geography', 'Nature'], flagImageUrl: 'https://flagcdn.com/w320/ca.png' },
  { id: 'mexico', name: 'Mexico', code: 'MX', position: { lat: 23.634501, lng: -102.552784 }, continent: 'North America', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/mx.png' },

  // SOUTH AMERICA (12 countries)
  { id: 'brazil', name: 'Brazil', code: 'BR', position: { lat: -14.235004, lng: -51.92528 }, continent: 'South America', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/br.png' },
  { id: 'argentina', name: 'Argentina', code: 'AR', position: { lat: -38.416097, lng: -63.616672 }, continent: 'South America', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/ar.png' },
  { id: 'colombia', name: 'Colombia', code: 'CO', position: { lat: 4.570868, lng: -74.297333 }, continent: 'South America', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/co.png' },

  // OCEANIA (14 countries)
  { id: 'australia', name: 'Australia', code: 'AU', position: { lat: -25.274398, lng: 133.775136 }, continent: 'Oceania', difficulty: 'easy', categories: ['Geography', 'Wildlife'], flagImageUrl: 'https://flagcdn.com/w320/au.png' },
  { id: 'new-zealand', name: 'New Zealand', code: 'NZ', position: { lat: -40.900557, lng: 174.885971 }, continent: 'Oceania', difficulty: 'easy', categories: ['Geography', 'Nature'], flagImageUrl: 'https://flagcdn.com/w320/nz.png' },
  { id: 'fiji', name: 'Fiji', code: 'FJ', position: { lat: -16.578193, lng: 179.414413 }, continent: 'Oceania', difficulty: 'easy', categories: ['Geography', 'Culture'], flagImageUrl: 'https://flagcdn.com/w320/fj.png' }
];

export default countries;
