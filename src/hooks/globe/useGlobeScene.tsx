
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { setupScene, setupCamera, setupRenderer } from "../../utils/threeSetup";

export const useGlobeScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const animationFrameIdRef = useRef<number>(0);
  const globeTextureLoaded = useRef<boolean>(false);
  const oceanRef = useRef<THREE.Mesh | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);

  // Initialize the scene, globe, and renderer
  useEffect(() => {
    if (!containerRef.current) return;
    
    const scene = setupScene();
    const camera = setupCamera();
    
    // Enhanced renderer with better antialiasing and higher pixel ratio
    const renderer = setupRenderer();
    renderer.setPixelRatio(window.devicePixelRatio * 1.5); // Higher quality rendering
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Create globe
    const globe = new THREE.Group();
    globeRef.current = globe;
    scene.add(globe);

    // Create Earth globe with continents
    const earthGeometry = new THREE.SphereGeometry(100, 128, 128); // Higher detail geometry
    
    // Load textures with better quality
    const textureLoader = new THREE.TextureLoader();
    
    // Load the Earth texture with enhanced detail
    const earthTexture = textureLoader.load('/lovable-uploads/ea2e8c03-0ad4-4868-9ddc-ba9172d51587.png', () => {
      globeTextureLoaded.current = true;
      
      // Only notify when globe is fully loaded
      if (cloudsRef.current) {
        // Toast logic will now be handled by the parent hook
      }
    });
    
    // Configure texture for better quality
    earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    earthTexture.minFilter = THREE.LinearMipmapLinearFilter;
    earthTexture.magFilter = THREE.LinearFilter;
    
    // Load normal map for that 3D terrain feel
    const normalMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg');
    normalMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
    
    // Load specular map for better lighting response
    const specularMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');
    specularMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
    
    // Create the main Earth material with enhanced lighting response
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(1.5, 1.5), // Stronger normal effect
      specularMap: specularMap,
      shininess: 35,
      specular: new THREE.Color(0x666666)
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.castShadow = true;
    earth.receiveShadow = true;
    earthRef.current = earth;
    globe.add(earth);
    
    // Create ocean layer for better visual separation
    const oceanGeometry = new THREE.SphereGeometry(100.1, 128, 128); // Slightly larger than earth
    const oceanMaterial = new THREE.MeshPhongMaterial({
      color: 0x006994,
      transparent: true,
      opacity: 0.7,
      shininess: 100,
      specular: new THREE.Color(0xffffff)
    });
    
    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    oceanRef.current = ocean;
    globe.add(ocean);
    
    // Add clouds layer
    const cloudsGeometry = new THREE.SphereGeometry(103, 64, 64); // Above earth
    const cloudsTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png');
    cloudsTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    cloudsRef.current = clouds;
    globe.add(clouds);
    
    // Add subtle atmosphere glow effect
    const atmosphereGeometry = new THREE.SphereGeometry(106, 64, 64);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x3366cc,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globe.add(atmosphere);

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      
      if (renderer && renderer.domElement && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    containerRef,
    globeRef,
    sceneRef,
    cameraRef,
    earthRef,
    oceanRef,
    cloudsRef,
    rendererRef,
    animationFrameIdRef,
    globeTextureLoaded
  };
};
