
import * as THREE from "three";

// Enhanced globe rendering with better continent visibility
export const createEnhancedGlobe = (scene: THREE.Scene) => {
  // Create base earth with higher resolution
  const earthGeometry = new THREE.SphereGeometry(100, 256, 256); // Much higher resolution
  
  // Load high-quality earth texture
  const textureLoader = new THREE.TextureLoader();
  
  // Use a high-quality earth texture that shows all continents clearly
  const earthTexture = textureLoader.load('/lovable-uploads/ea2e8c03-0ad4-4868-9ddc-ba9172d51587.png', 
    (texture) => {
      console.log("Earth texture loaded successfully");
      texture.anisotropy = 16; // Maximum anisotropy for crisp details
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
    },
    undefined,
    (error) => {
      console.error("Failed to load earth texture:", error);
    }
  );
  
  // Enhanced material with better lighting response
  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    shininess: 0.1,
    specular: new THREE.Color(0x222222),
    transparent: false
  });
  
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  earth.rotation.y = Math.PI; // Rotate to show proper orientation
  
  // Add to scene
  scene.add(earth);
  
  return earth;
};

// Add better lighting for continent visibility
export const setupEnhancedLighting = (scene: THREE.Scene) => {
  // Remove existing lights
  const existingLights = scene.children.filter(child => child instanceof THREE.Light);
  existingLights.forEach(light => scene.remove(light));
  
  // Add ambient light for general illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);
  
  // Add multiple directional lights to illuminate all sides
  const lights = [
    { position: [100, 0, 100], intensity: 2.0 },
    { position: [-100, 0, 100], intensity: 1.5 },
    { position: [0, 100, 0], intensity: 1.5 },
    { position: [0, -100, 0], intensity: 1.0 },
    { position: [0, 0, -100], intensity: 1.5 }
  ];
  
  lights.forEach(({ position, intensity }) => {
    const light = new THREE.DirectionalLight(0xffffff, intensity);
    light.position.set(position[0], position[1], position[2]);
    scene.add(light);
  });
  
  console.log("Enhanced lighting setup complete");
};
