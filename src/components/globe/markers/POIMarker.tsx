
import * as THREE from "three";
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

// Updated to accept all POI types with enhanced visibility
export const createPOIMarker = (
  lat: number,
  lng: number,
  type: 'museum' | 'sports' | 'landmark' | 'nature' | 'cultural',
  name?: string
): THREE.Group => {
  // Calculate position on sphere with radius 100
  const radius = 100;
  const { x, y, z } = calculateGlobePosition(lat, lng, radius);
  
  // Create group for marker and label
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.lookAt(0, 0, 0); // Make sure the marker is oriented correctly
  
  // Create more visible and distinct markers
  const markerGeometry = new THREE.SphereGeometry(3.0, 20, 20);
  
  // Use different colors based on POI type - brighter colors
  let markerColor;
  switch (type) {
    case 'museum':
      markerColor = 0xff00ff; // Brighter purple
      break;
    case 'sports':
      markerColor = 0x00aaff; // Brighter blue
      break;
    case 'landmark':
      markerColor = 0xff6b00; // Brighter orange
      break;
    case 'nature':
      markerColor = 0x00ff80; // Brighter green
      break;
    case 'cultural':
      markerColor = 0xff0080; // Brighter pink
      break;
    default:
      markerColor = 0x6366f1; // Indigo (fallback)
  }
  
  const markerMaterial = new THREE.MeshPhongMaterial({
    color: markerColor,
    emissive: markerColor,
    emissiveIntensity: 0.8, // Stronger emission
    shininess: 50,
  });
  
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
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
      const scale = 0.22; // Adjust scale for better visibility
      label.scale.set(labelCanvas.width * scale, labelCanvas.height * scale, 1);
      
      // Position above the marker
      label.position.set(0, 5.0, 0);
      
      group.add(label);
    }
  }
  
  return group;
};
