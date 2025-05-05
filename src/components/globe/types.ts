
export interface POIMarker {
  lat: number;
  lng: number;
  type: 'museum' | 'sports' | 'landmark' | 'nature' | 'cultural';
  name?: string;
}

export const pointsOfInterest: POIMarker[] = [
  { lat: 48.8606, lng: 2.3376, type: 'museum', name: 'Louvre' },
  { lat: 40.7794, lng: -73.9632, type: 'museum', name: 'Met' },
  { lat: 51.4967, lng: -0.1764, type: 'museum', name: 'Natural History Museum' },
  { lat: 51.5033, lng: -0.1195, type: 'sports', name: 'Wembley' },
  { lat: 40.7505, lng: -73.9934, type: 'sports', name: 'MSG' },
  { lat: 48.8413, lng: 2.2530, type: 'sports', name: 'Roland Garros' },
  { lat: 27.1751, lng: 78.0421, type: 'landmark', name: 'Taj Mahal' },
  { lat: 41.8902, lng: 12.4922, type: 'landmark', name: 'Colosseum' },
  { lat: 30.3285, lng: 35.4444, type: 'landmark', name: 'Petra' },
  { lat: -13.1631, lng: -72.5450, type: 'landmark', name: 'Machu Picchu' },
  { lat: -1.2921, lng: 36.8219, type: 'cultural', name: 'Nairobi National Museum' },
  { lat: 55.7520, lng: 37.6175, type: 'cultural', name: 'Bolshoi Theatre' },
];
