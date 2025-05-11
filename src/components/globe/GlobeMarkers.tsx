
import * as THREE from "three";
import { DifficultyLevel } from "@/types/quiz";

// Create a canvas text label with improved styling and better visibility
export const createTextCanvas = (text: string) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) return null;
  
  const fontSize = 24; // Larger font size for better visibility
  context.font = `bold ${fontSize}px Arial`;
  
  // Get text metrics to size canvas appropriately
  const metrics = context.measureText(text);
  const width = metrics.width + 40; // Wider padding
  const height = fontSize + 24;    // Taller for better visibility
  
  canvas.width = width;
  canvas.height = height;
  
  // Draw background with rounded corners - darker and more opaque
  context.fillStyle = 'rgba(0, 0, 0, 0.95)';
  context.beginPath();
  context.roundRect(0, 0, width, height, 10);
  context.fill();
  
  // Add a stronger border
  context.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  context.lineWidth = 2;
  context.beginPath();
  context.roundRect(0, 0, width, height, 10);
  context.stroke();
  
  // Draw text in white for better contrast
  context.fillStyle = 'white';
  context.font = `bold ${fontSize}px Arial`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, width / 2, height / 2);
  
  return canvas;
};

export const createCountryMarker = (
  lat: number, 
  lng: number, 
  difficulty: DifficultyLevel,
  iconType: 'landmark' | 'trophy' | 'globe' | 'culture' | 'nature' = 'globe',
  name?: string
): THREE.Group => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  // Calculate position on sphere with radius 100
  const radius = 100;
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
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

// Updated to accept all POI types with enhanced visibility
export const createPOIMarker = (
  lat: number,
  lng: number,
  type: 'museum' | 'sports' | 'landmark' | 'nature' | 'cultural',
  name?: string
): THREE.Group => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  // Calculate position on sphere with radius 100
  const radius = 100;
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
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
