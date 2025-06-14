
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Country } from "../../types/quiz";
import { createCountryMarker } from "../../components/globe/GlobeMarkers";

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
    
    // Only add markers for filtered countries (NO POIS)
    filteredCountries.forEach((country) => {
      const { lat, lng } = country.position;
      const marker = createCountryMarker(
        lat, 
        lng, 
        country.difficulty, 
        country.iconType,
        showLabels ? country.name : undefined
      );
      
      // Set unique userData for identification
      marker.userData = { 
        countryId: country.id,
        type: 'country-marker',
        country: country
      };
      
      // Create a much larger invisible clickable area
      const clickGeometry = new THREE.SphereGeometry(12, 16, 16); // Much larger
      const clickMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthTest: false, // Ensure it's always clickable
      });
      const clickArea = new THREE.Mesh(clickGeometry, clickMaterial);
      clickArea.userData = { 
        countryId: country.id,
        type: 'click-area',
        country: country
      };
      
      // Add hover effect geometry
      const hoverGeometry = new THREE.SphereGeometry(8, 16, 16);
      const hoverMaterial = new THREE.MeshBasicMaterial({
        color: 0x4ade80,
        transparent: true,
        opacity: 0.2,
      });
      const hoverArea = new THREE.Mesh(hoverGeometry, hoverMaterial);
      hoverArea.userData = { 
        countryId: country.id,
        type: 'hover-area'
      };
      hoverArea.visible = false;
      
      marker.add(clickArea);
      marker.add(hoverArea);
      
      globeRef.current?.add(marker);
      markerRefs.current.set(country.id, marker);
    });

    console.log(`Added ${filteredCountries.length} country markers to globe`);
  };

  // Setup enhanced click handler with better hit detection
  const setupClickHandler = (camera: THREE.PerspectiveCamera, scene: THREE.Scene) => {
    if (!globeRef.current) return null;
    
    const mouse = new THREE.Vector2();
    const raycaster = raycasterRef.current;
    
    raycaster.params.Points!.threshold = 10;
    raycaster.params.Line!.threshold = 10;

    const handleClick = (event: MouseEvent) => {
      if (!camera || !scene || !globeRef.current) return;
      
      event.preventDefault();
      event.stopPropagation();
      
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(globeRef.current.children, true);
      
      if (intersects.length > 0) {
        for (const intersect of intersects) {
          let obj: THREE.Object3D | null = intersect.object;
          let countryData = null;
          
          while (obj && !countryData) {
            if (obj.userData?.countryId && obj.userData?.country) {
              countryData = {
                countryId: obj.userData.countryId,
                country: obj.userData.country
              };
              break;
            }
            obj = obj.parent;
          }
          
          if (countryData) {
            const country = filteredCountries.find((c) => c.id === countryData.countryId);
            if (country) {
              const marker = markerRefs.current.get(countryData.countryId);
              if (marker) {
                const originalScale = marker.scale.clone();
                const targetScale = originalScale.clone().multiplyScalar(2.0);
                const animateUp = () => {
                  marker.scale.copy(targetScale);
                  setTimeout(() => {
                    marker.scale.copy(originalScale);
                  }, 200);
                };
                animateUp();
              }
              
              onCountrySelect(country);
              return;
            }
          }
        }
      }
    };

    // Also add hover effects
    const handleMouseMove = (event: MouseEvent) => {
      if (!camera || !scene || !globeRef.current) return;
      
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(globeRef.current.children, true);
      
      markerRefs.current.forEach(marker => {
        const hoverArea = marker.children.find(child => child.userData?.type === 'hover-area');
        if (hoverArea) hoverArea.visible = false;
      });
      
      if (intersects.length > 0) {
        for (const intersect of intersects) {
          let obj: THREE.Object3D | null = intersect.object;
          while (obj) {
            if (obj.userData?.countryId) {
              const marker = markerRefs.current.get(obj.userData.countryId);
              if (marker) {
                const hoverArea = marker.children.find(child => child.userData?.type === 'hover-area');
                if (hoverArea) {
                  hoverArea.visible = true;
                  (event.target as HTMLElement).style.cursor = 'pointer';
                }
              }
              break;
            }
            obj = obj.parent;
          }
        }
      } else {
        (event.target as HTMLElement).style.cursor = 'default';
      }
    };
    
    return { handleClick, handleMouseMove };
  };

  return {
    markerRefs,
    raycasterRef,
    updateMarkers,
    setupClickHandler
  };
};
