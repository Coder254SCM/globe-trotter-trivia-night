
import * as THREE from "three";

export const setupScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000); // Black background for better contrast
  
  // Add stronger ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  // Add stronger directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(100, 100, 100);
  scene.add(directionalLight);

  // Add second directional light from another angle
  const secondLight = new THREE.DirectionalLight(0xffffff, 0.8);
  secondLight.position.set(-100, -100, -100);
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
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  return renderer;
};
