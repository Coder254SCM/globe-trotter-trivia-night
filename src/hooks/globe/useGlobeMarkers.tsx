
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Country } from "../../types/quiz";
import { createCountryMarker, createPOIMarker } from "../../components/globe/GlobeMarkers";
import { pointsOfInterest } from "../../components/globe/types";

interface UseGlobeMarkersProps {
  globeRef: React.MutableRefObject<THREE.Group | null>;
  filteredCountries: Country[];
  showLabels: boolean;
  onCountrySelect: (country: Country) => void;
}

export const useGlobeMarkers = ({
  globeRef,
  filteredCountries,
  showLabels,
  onCountrySelect
}: UseGlobeMarkersProps) => {
  const markerRefs = useRef<Map<string, THREE.Object3D>>(new Map());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());

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
      
      // Add a much larger invisible hit area for better interaction
      const hitGeometry = new THREE.SphereGeometry(6, 16, 16);
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

  // Add points of interest markers
  const addPOIMarkers = () => {
    if (!globeRef.current) return;
    
    pointsOfInterest.forEach(poi => {
      const marker = createPOIMarker(poi.lat, poi.lng, poi.type, poi.name);
      globeRef.current?.add(marker);
    });
  };

  // Setup click handler for country selection with improved hit detection
  const setupClickHandler = (camera: THREE.PerspectiveCamera, scene: THREE.Scene) => {
    if (!globeRef.current) return () => {};
    
    const mouse = new THREE.Vector2();
    const raycaster = raycasterRef.current;

    const handleClick = (event: MouseEvent) => {
      if (!camera || !scene || !globeRef.current) return;
      
      // Calculate normalized device coordinates
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update the raycaster with the mouse position and camera
      raycaster.setFromCamera(mouse, camera);
      
      // Get all intersected objects with the ray, including children
      const intersects = raycaster.intersectObjects(globeRef.current.children, true);
      
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
          const country = filteredCountries.find((c) => c.id === countryId);
          if (country) {
            // Successfully found and selected a country
            onCountrySelect(country);
            
            // Visual feedback
            const marker = markerRefs.current.get(countryId);
            if (marker) {
              // Scale animation for visual feedback
              const originalScale = { value: 1 };
              const targetScale = { value: 1.8 };
              
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
                }, 300);
              };
              
              scaleUp();
            }
          }
        }
      }
    };
    
    return handleClick;
  };

  return {
    markerRefs,
    raycasterRef,
    updateMarkers,
    addPOIMarkers,
    setupClickHandler
  };
};
