
import * as THREE from "three";
import { POIMarker } from "./types";

export const createCountryMarker = (
  lat: number, 
  lng: number, 
  difficulty: string
): THREE.Mesh => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -100 * Math.sin(phi) * Math.cos(theta);
  const y = 100 * Math.cos(phi);
  const z = 100 * Math.sin(phi) * Math.sin(theta);
  
  const markerGeometry = new THREE.SphereGeometry(2, 16, 16);
  
  let markerColor;
  switch (difficulty) {
    case 'easy':
      markerColor = 0x4ade80;
      break;
    case 'medium':
      markerColor = 0xfacc15;
      break;
    case 'hard':
      markerColor = 0xef4444;
      break;
    default:
      markerColor = 0x8b5cf6;
  }
  
  const markerMaterial = new THREE.MeshBasicMaterial({
    color: markerColor,
    transparent: true,
    opacity: 0.8,
  });
  
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  marker.position.set(x, y, z);
  return marker;
};

export const createPOIMarker = (
  lat: number,
  lng: number,
  type: 'museum' | 'sports'
): THREE.Mesh => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -100 * Math.sin(phi) * Math.cos(theta);
  const y = 100 * Math.cos(phi);
  const z = 100 * Math.sin(phi) * Math.sin(theta);
  
  const markerGeometry = new THREE.SphereGeometry(1.5, 16, 16);
  const markerMaterial = new THREE.MeshPhongMaterial({
    color: type === 'museum' ? 0x9333ea : 0x2563eb,
    emissive: type === 'museum' ? 0x6b21a8 : 0x1d4ed8,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.9,
  });
  
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  marker.position.set(x, y, z);
  return marker;
};

