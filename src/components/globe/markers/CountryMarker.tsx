
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
  
  // Create the main group
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.lookAt(0, 0, 0);
  
  // Create base marker - much larger and more visible
  const baseGeometry = new THREE.CylinderGeometry(0.5, 2.5, 8, 12);
  const baseMaterial = new THREE.MeshPhongMaterial({
    color: 0x4ade80, // Bright green for visibility
    emissive: 0x2d7d32,
    emissiveIntensity: 0.3,
    shininess: 100,
  });
  
  const baseMarker = new THREE.Mesh(baseGeometry, baseMaterial);
  baseMarker.position.y = 4; // Raise above surface
  
  // Create the icon on top based on type
  let iconGeometry;
  switch (iconType) {
    case 'landmark':
      iconGeometry = new THREE.ConeGeometry(2, 4, 8);
      break;
    case 'trophy':
      iconGeometry = new THREE.OctahedronGeometry(2.5);
      break;
    case 'culture':
      iconGeometry = new THREE.TorusGeometry(2, 0.8, 8, 16);
      break;
    case 'nature':
      iconGeometry = new THREE.DodecahedronGeometry(2.2);
      break;
    default:
      iconGeometry = new THREE.SphereGeometry(2.5, 16, 16);
  }
  
  const iconMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    emissive: 0x4ade80,
    emissiveIntensity: 0.5,
    shininess: 100,
  });
  
  const iconMarker = new THREE.Mesh(iconGeometry, iconMaterial);
  iconMarker.position.y = 9; // Position above base
  
  // Add pulsing animation
  const animate = () => {
    const time = Date.now() * 0.003;
    const scale = 1 + Math.sin(time) * 0.1;
    iconMarker.scale.set(scale, scale, scale);
    
    // Add gentle glow effect
    iconMaterial.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.2;
    
    requestAnimationFrame(animate);
  };
  animate();
  
  group.add(baseMarker);
  group.add(iconMarker);
  
  // Add professional label if name is provided
  if (name) {
    const labelCanvas = createTextCanvas(name, {
      fontSize: 32,
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      textColor: 'white',
      padding: 12,
      borderRadius: 8,
    });
    
    if (labelCanvas) {
      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      labelTexture.needsUpdate = true;
      
      const labelMaterial = new THREE.SpriteMaterial({ 
        map: labelTexture, 
        transparent: true,
        depthTest: false,
      });
      
      const label = new THREE.Sprite(labelMaterial);
      const scale = 0.15;
      label.scale.set(labelCanvas.width * scale, labelCanvas.height * scale, 1);
      label.position.set(0, 15, 0);
      
      group.add(label);
    }
  }
  
  return group;
};
