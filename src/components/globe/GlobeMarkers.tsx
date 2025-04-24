import * as THREE from "three";
import { DifficultyLevel } from "@/types/quiz";

export const createCountryMarker = (
  lat: number, 
  lng: number, 
  difficulty: DifficultyLevel,
  iconType: 'landmark' | 'trophy' | 'globe' | 'culture' | 'nature' = 'globe'
): THREE.Mesh => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -100 * Math.sin(phi) * Math.cos(theta);
  const y = 100 * Math.cos(phi);
  const z = 100 * Math.sin(phi) * Math.sin(theta);
  
  // Different geometries for different icon types
  let markerGeometry;
  switch (iconType) {
    case 'landmark':
      markerGeometry = new THREE.ConeGeometry(2, 4, 6);
      break;
    case 'trophy':
      markerGeometry = new THREE.OctahedronGeometry(2);
      break;
    case 'culture':
      markerGeometry = new THREE.TorusGeometry(2, 0.5, 8, 16);
      break;
    case 'nature':
      markerGeometry = new THREE.DodecahedronGeometry(2);
      break;
    default:
      markerGeometry = new THREE.SphereGeometry(2, 16, 16);
  }
  
  // Colors based on difficulty
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
  }
  
  const markerMaterial = new THREE.MeshPhongMaterial({
    color: markerColor,
    emissive: markerColor,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.9,
  });
  
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  marker.position.set(x, y, z);
  
  // Rotate cone markers to point outward
  if (iconType === 'landmark') {
    marker.lookAt(0, 0, 0);
    marker.rotateX(Math.PI / 2);
  }
  
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
  
  // Create more visible and distinct markers
  const markerGeometry = new THREE.SphereGeometry(2.5, 16, 16);
  const markerMaterial = new THREE.MeshPhongMaterial({
    color: type === 'museum' ? 0xd946ef : 0x3b82f6,
    emissive: type === 'museum' ? 0xd946ef : 0x3b82f6,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.9,
  });
  
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  marker.position.set(x, y, z);
  return marker;
};
