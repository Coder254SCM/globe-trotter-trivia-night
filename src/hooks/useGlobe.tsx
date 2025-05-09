
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { setupScene, setupCamera, setupRenderer } from "../utils/threeSetup";
import { createCountryMarker, createPOIMarker } from "../components/globe/GlobeMarkers";
import countries from "../data/countries";
import { pointsOfInterest } from "../components/globe/types";
import { Country } from "../types/quiz";
import { toast } from "@/components/ui/use-toast";

interface UseGlobeProps {
  filteredCountries: Country[];
  showLabels: boolean;
  rotating: boolean;
  onCountrySelect: (country: Country) => void;
}

export const useGlobe = ({
  filteredCountries,
  showLabels,
  rotating,
  onCountrySelect
}: UseGlobeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const markerRefs = useRef<Map<string, THREE.Object3D>>(new Map());
  const animationFrameIdRef = useRef<number>(0);
  const globeTextureLoaded = useRef<boolean>(false);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const oceanRef = useRef<THREE.Mesh | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);

  // Update markers when filtered countries change
  const updateMarkers = () => {
    if (!globeRef.current) return;
    
    // Clear existing country markers
    markerRefs.current.forEach((marker) => {
      globeRef.current?.remove(marker);
    });
    markerRefs.current.clear();
    
    // Add markers for filtered countries with larger hit areas
    filteredCountries.forEach((country) => {
      const { lat, lng } = country.position;
      const marker = createCountryMarker(
        lat, 
        lng, 
        country.difficulty, 
        country.iconType,
        showLabels ? country.name : undefined
      );
      marker.userData = { countryId: country.id };
      
      // Add invisible larger hit area for better interaction
      const hitGeometry = new THREE.SphereGeometry(3.5, 16, 16);
      const hitMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
      });
      const hitArea = new THREE.Mesh(hitGeometry, hitMaterial);
      hitArea.userData = { countryId: country.id };
      marker.add(hitArea);
      
      globeRef.current?.add(marker);
      markerRefs.current.set(country.id, marker);
    });
  };

  useEffect(() => {
    updateMarkers();
  }, [filteredCountries, showLabels]);

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
        toast({
          title: "Globe Loaded",
          description: "Use ⌘+K or click the search icon to find countries",
        });
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
    
    // Enhanced lighting for better clarity
    // Main directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(500, 500, -1000);
    sunLight.castShadow = true;
    scene.add(sunLight);
    
    // Ambient light to see the dark side better
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    // Hemisphere light for more natural coloring
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.2);
    scene.add(hemisphereLight);

    // Add points of interest markers
    pointsOfInterest.forEach(poi => {
      const marker = createPOIMarker(poi.lat, poi.lng, poi.type, poi.name);
      globe.add(marker);
    });

    // Add country markers
    updateMarkers();

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener("resize", handleResize);

    // Enhanced click handler with better hit detection
    const raycaster = new THREE.Raycaster();
    raycasterRef.current = raycaster;
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      if (!camera || !scene || !globe) return;
      
      // Calculate normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Update the raycaster with the mouse position and camera
      raycaster.setFromCamera(mouse, camera);
      
      // Get all intersected objects with the ray, including children
      const intersects = raycaster.intersectObjects(globe.children, true);
      
      if (intersects.length > 0) {
        // Find the first ancestor with userData containing countryId
        let obj: THREE.Object3D | null = intersects[0].object;
        let countryId = null;
        
        // Traverse up the parent chain to find the country id
        while (obj && !countryId) {
          if (obj.userData?.countryId) {
            countryId = obj.userData.countryId;
          }
          obj = obj.parent;
        }
        
        if (countryId) {
          const country = countries.find((c) => c.id === countryId);
          if (country) {
            // Successfully found and selected a country
            onCountrySelect(country);
            
            // Visual feedback
            const marker = markerRefs.current.get(countryId);
            if (marker) {
              // Scale animation for visual feedback
              const originalScale = { value: 1 };
              const targetScale = { value: 1.3 };
              
              const scaleUp = () => {
                marker.scale.set(
                  targetScale.value,
                  targetScale.value,
                  targetScale.value
                );
                
                setTimeout(() => {
                  marker.scale.set(
                    originalScale.value,
                    originalScale.value,
                    originalScale.value
                  );
                }, 200);
              };
              
              scaleUp();
            }
          }
        }
      }
    };
    
    containerRef.current.addEventListener("click", handleClick);

    // Animation loop with enhanced effects
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      
      if (rotating && globeRef.current) {
        globeRef.current.rotation.y += 0.0005;
      }
      
      // Animate clouds separately for realistic effect
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y += 0.0002;
      }
      
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };
    
    animate();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      
      if (renderer && renderer.domElement && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      window.addEventListener("resize", handleResize);
      containerRef.current?.removeEventListener("click", handleClick);
    };
  }, []);

  // Zoom to a specific continent
  const zoomToContinent = (continent: string) => {
    if (!globeRef.current || !cameraRef.current) return;
    
    // Get the average position of countries in this continent
    const continentCountries = countries.filter(c => c.continent === continent);
    if (continentCountries.length === 0) return;
    
    // Calculate average coordinates
    let avgLat = 0;
    let avgLng = 0;
    
    continentCountries.forEach(country => {
      avgLat += country.position.lat;
      avgLng += country.position.lng;
    });
    
    avgLat /= continentCountries.length;
    avgLng /= continentCountries.length;
    
    // Convert to 3D coordinates
    const phi = (90 - avgLat) * (Math.PI / 180);
    const theta = (avgLng + 180) * (Math.PI / 180);
    
    // Position camera to focus on this area
    if (globeRef.current && cameraRef.current) {
      const x = -200 * Math.sin(phi) * Math.cos(theta);
      const y = 200 * Math.cos(phi);
      const z = 200 * Math.sin(phi) * Math.sin(theta);
      
      // Gently rotate the globe to show this continent
      const duration = 1000; // ms
      const startRotationY = globeRef.current.rotation.y;
      const targetRotationY = Math.atan2(x, z);
      const startTime = Date.now();
      
      const rotateGlobe = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-in-out function
        const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        globeRef.current!.rotation.y = startRotationY + (targetRotationY - startRotationY) * easeProgress;
        
        if (progress < 1) {
          requestAnimationFrame(rotateGlobe);
        }
      };
      
      rotateGlobe();
    }
  };

  // Focus on a specific country
  const focusCountry = (country: Country) => {
    if (!globeRef.current || !cameraRef.current) return;
    
    const { lat, lng } = country.position;
    
    // Convert to 3D coordinates
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    if (globeRef.current && cameraRef.current) {
      // Calculate the target position
      const x = -200 * Math.sin(phi) * Math.cos(theta);
      const y = 200 * Math.cos(phi);
      const z = 200 * Math.sin(phi) * Math.sin(theta);
      
      // Gently rotate the globe to show this country
      const duration = 1000; // ms
      const startRotationY = globeRef.current.rotation.y;
      const targetRotationY = Math.atan2(x, z);
      const startTime = Date.now();
      
      const rotateGlobe = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-in-out function
        const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        globeRef.current!.rotation.y = startRotationY + (targetRotationY - startRotationY) * easeProgress;
        
        // Visual feedback on the country marker
        const marker = markerRefs.current.get(country.id);
        if (marker && progress >= 1) {
          marker.scale.set(1.3, 1.3, 1.3);
          setTimeout(() => {
            marker.scale.set(1, 1, 1);
          }, 300);
        }
        
        if (progress < 1) {
          requestAnimationFrame(rotateGlobe);
        } else {
          // Notify user when navigation is complete
          toast({
            title: country.name,
            description: `Click on the marker to start a quiz about ${country.name}`
          });
        }
      };
      
      rotateGlobe();
    }
  };
  
  return {
    containerRef,
    zoomToContinent,
    focusCountry
  };
};
