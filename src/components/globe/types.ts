
export interface POIMarker {
  lat: number;
  lng: number;
  type: 'museum' | 'sports';
}

export const pointsOfInterest: POIMarker[] = [
  { lat: 48.8606, lng: 2.3376, type: 'museum' }, // Louvre
  { lat: 40.7794, lng: -73.9632, type: 'museum' }, // Met
  { lat: 51.4967, lng: -0.1764, type: 'museum' }, // Natural History Museum
  { lat: 51.5033, lng: -0.1195, type: 'sports' }, // Wembley
  { lat: 40.7505, lng: -73.9934, type: 'sports' }, // Madison Square Garden
  { lat: 48.8413, lng: 2.2530, type: 'sports' }, // Roland Garros
];

