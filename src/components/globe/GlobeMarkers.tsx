
import * as THREE from "three";
import { DifficultyLevel } from "@/types/quiz";

// Create a canvas text label
export const createTextCanvas = (text: string) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) return null;
  
  const fontSize = 24;
  context.font = `${fontSize}px Arial`;
  
  // Get text metrics to size canvas appropriately
  const metrics = context.measureText(text);
  const width = metrics.width + 20;
  const height = fontSize + 16;
  
  canvas.width = width;
  canvas.height = height;
  
  // Draw background with rounded corners
  context.fillStyle = 'rgba(0, 0, 0, 0.7)';
  context.beginPath();
  context.roundRect(0, 0, width, height, 8);
  context.fill();
  
  // Draw text
  context.fillStyle = 'white';
  context.font = `${fontSize}px Arial`;
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
  
  // Rotate cone markers to point outward
  if (iconType === 'landmark') {
    marker.lookAt(0, 0, 0);
    marker.rotateX(Math.PI / 2);
  }
  
  // Create a group to hold both the marker and label
  const group = new THREE.Group();
  group.position.set(x, y, z);
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
        depthTest: false,
        depthWrite: false,
      });
      
      const label = new THREE.Sprite(labelMaterial);
      const scale = 0.15; // Adjust scale as needed
      label.scale.set(labelCanvas.width * scale, labelCanvas.height * scale, 1);
      
      // Position above the marker
      label.position.set(0, 4, 0);
      
      group.add(label);
    }
  }
  
  return group;
};

export const createPOIMarker = (
  lat: number,
  lng: number,
  type: 'museum' | 'sports',
  name?: string
): THREE.Group => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -100 * Math.sin(phi) * Math.cos(theta);
  const y = 100 * Math.cos(phi);
  const z = 100 * Math.sin(phi) * Math.sin(theta);
  
  // Create group for marker and label
  const group = new THREE.Group();
  group.position.set(x, y, z);
  
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
        depthTest: false,
        depthWrite: false,
      });
      
      const label = new THREE.Sprite(labelMaterial);
      const scale = 0.15; // Adjust scale as needed
      label.scale.set(labelCanvas.width * scale, labelCanvas.height * scale, 1);
      
      // Position above the marker
      label.position.set(0, 4, 0);
      
      group.add(label);
    }
  }
  
  return group;
};
