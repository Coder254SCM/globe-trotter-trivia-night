
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { setupScene, setupCamera, setupRenderer } from "../utils/threeSetup";
import { createCountryMarker, createPOIMarker } from "../components/globe/GlobeMarkers";
import countries from "../data/countries";
import { pointsOfInterest } from "../components/globe/types";
import { Country } from "../types/quiz";

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

  // Update markers when filtered countries change
  const updateMarkers = () => {
    if (!globeRef.current) return;
    
    // Clear existing country markers
    markerRefs.current.forEach((marker) => {
      globeRef.current?.remove(marker);
    });
    markerRefs.current.clear();
    
    // Add markers for filtered countries
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
    const renderer = setupRenderer();
    
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Create globe
    const globe = new THREE.Group();
    globeRef.current = globe;
    scene.add(globe);

    // Create Earth globe with continents
    const earthGeometry = new THREE.SphereGeometry(100, 64, 64);
    
    // Load Earth texture with continents and oceans
    const textureLoader = new THREE.TextureLoader();
    
    // First, load a normal map for that 3D terrain feel
    const normalMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg');
    
    // Load Earth texture (better quality)
    const earthTexture = textureLoader.load('/lovable-uploads/600c2c58-a99e-4652-8e24-5959f1631910.png', () => {
      globeTextureLoaded.current = true;
    });
    
    // Load cloud layer for more realism
    const cloudTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.jpg');
    
    // Create the main Earth material
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.8, 0.8),
      shininess: 20,
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthRef.current = earth;
    globe.add(earth);
    
    // Add subtle cloud layer
    const cloudGeometry = new THREE.SphereGeometry(101, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    globe.add(clouds);
    
    // Add atmosphere glow effect
    const atmosphereGeometry = new THREE.SphereGeometry(103, 64, 64);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x3366cc,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globe.add(atmosphere);

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

    // Click handler
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      if (!camera || !scene || !globe) return;
      
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      
      // Check all objects in the scene for intersections
      const intersects = raycaster.intersectObjects(globe.children, true);
      
      if (intersects.length > 0) {
        // Find the first ancestor with userData
        let obj: THREE.Object3D | null = intersects[0].object;
        let countryId = null;
        
        while (obj && !countryId) {
          if (obj.userData?.countryId) {
            countryId = obj.userData.countryId;
          }
          obj = obj.parent;
        }
        
        if (countryId) {
          const country = countries.find((c) => c.id === countryId);
          if (country) {
            onCountrySelect(country);
          }
        }
      }
    };
    
    containerRef.current.addEventListener("click", handleClick);

    // Animation loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      
      if (rotating && globeRef.current) {
        globeRef.current.rotation.y += 0.0005;
        
        // Rotate cloud layer slightly faster for a dynamic effect
        if (clouds) {
          clouds.rotation.y += 0.0001;
        }
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
        
        if (progress < 1) {
          requestAnimationFrame(rotateGlobe);
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
