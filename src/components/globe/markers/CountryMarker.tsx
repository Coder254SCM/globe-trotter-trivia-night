
import * as THREE from "three";
import { DifficultyLevel } from "@/types/quiz";
import { createTextCanvas } from "../utils/labelUtils";

// Helper function to calculate position on globe
const calculateGlobePosition = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return { x, y, z };
};

export const createCountryMarker = (
  lat: number, 
  lng: number, 
  difficulty: DifficultyLevel,
  iconType: 'landmark' | 'trophy' | 'globe' | 'culture' | 'nature' = 'globe',
  name?: string
): THREE.Group => {
  // Calculate position on sphere with radius 100
  const radius = 100;
  const { x, y, z } = calculateGlobePosition(lat, lng, radius);
  
  // Different geometries for different icon types - larger for better visibility
  let markerGeometry;
  switch (iconType) {
    case 'landmark':
      markerGeometry = new THREE.ConeGeometry(3.2, 6.0, 8);
      break;
    case 'trophy':
      markerGeometry = new THREE.OctahedronGeometry(3.2);
      break;
    case 'culture':
      markerGeometry = new THREE.TorusGeometry(3.2, 1.0, 12, 24);
      break;
    case 'nature':
      markerGeometry = new THREE.DodecahedronGeometry(3.2);
      break;
    default:
      markerGeometry = new THREE.SphereGeometry(3.2, 24, 24);
  }
  
  // Colors based on difficulty with stronger emission
  let markerColor;
  let emissiveIntensity;
  markerColor = 0x4ade80; // Always use green color for easy difficulty
  emissiveIntensity = 1.0;
  
  // Enhanced material with stronger emission for better visibility
  const markerMaterial = new THREE.MeshPhongMaterial({
    color: markerColor,
    emissive: markerColor,
    emissiveIntensity: emissiveIntensity,
    shininess: 60,
    specular: new THREE.Color(0xffffff),
  });
  
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  
  // Rotate cone markers to point outward
  if (iconType === 'landmark') {
    marker.lookAt(0, 0, 0);
    marker.rotateX(Math.PI / 2);
  }
  
  // Create a group to hold both the marker and label
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.lookAt(0, 0, 0); // Make sure the marker is oriented correctly
  group.add(marker);
  
  // Add label if name is provided
  if (name) {
    const labelCanvas = createTextCanvas(name);
    if (labelCanvas) {
      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      labelTexture.needsUpdate = true;
      
      const labelMaterial = new THREE.SpriteMaterial({ 
        map: labelTexture, 
        transparent: true,
        depthTest: false, // This ensures labels are always visible
      });
      
      const label = new THREE.Sprite(labelMaterial);
      const scale = 0.25; // Larger scale for better visibility
      label.scale.set(labelCanvas.width * scale, labelCanvas.height * scale, 1);
      
      // Position above the marker
      label.position.set(0, 6.0, 0);
      
      group.add(label);
    }
  }
  
  return group;
};
