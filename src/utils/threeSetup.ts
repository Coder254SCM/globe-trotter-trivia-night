
import * as THREE from "three";

export const setupScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000); // Black background for better contrast
  
  // Add ambient light with improved brightness
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add directional light from the front
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(0, 0, 100);
  scene.add(directionalLight);

  // Add directional light from another angle
  const secondLight = new THREE.DirectionalLight(0xffffff, 0.8);
  secondLight.position.set(100, 100, 0);
  scene.add(secondLight);

  return scene;
};

export const setupCamera = () => {
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 300;
  return camera;
};

export const setupRenderer = () => {
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance" 
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for better performance
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;
};
