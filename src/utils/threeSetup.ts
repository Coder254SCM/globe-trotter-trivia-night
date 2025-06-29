
import * as THREE from "three";

export const setupScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000011); // Dark blue-black for better space feeling
  
  // Stronger ambient light for better global illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
  scene.add(ambientLight);

  // Enhanced directional light from the front
  const directionalLight = new THREE.DirectionalLight(0xffffff, 4.0);
  directionalLight.position.set(0, 0, 100);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Add directional light from another angle with increased intensity
  const secondLight = new THREE.DirectionalLight(0xffffff, 3.0);
  secondLight.position.set(100, 100, 0);
  secondLight.castShadow = true;
  scene.add(secondLight);
  
  // Third light for more balanced illumination
  const thirdLight = new THREE.DirectionalLight(0xffffff, 2.5);
  thirdLight.position.set(-100, -50, -100);
  thirdLight.castShadow = true;
  scene.add(thirdLight);

  // Fourth light to illuminate the dark side
  const fourthLight = new THREE.DirectionalLight(0xffffff, 2.0);
  fourthLight.position.set(0, -100, -100);
  scene.add(fourthLight);

  return scene;
};

export const setupCamera = () => {
  const camera = new THREE.PerspectiveCamera(
    50, // Slightly wider field of view for better earth visibility
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 280; // Adjusted for better viewing distance
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
  
  // Update this line to use the newer outputColorSpace property instead of outputEncoding
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Increase exposure for better visibility
  renderer.toneMappingExposure = 2.5;
  
  return renderer;
};
