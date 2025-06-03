
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
    
    // Add markers for filtered countries with much larger, more visible markers
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

  // Add points of interest markers
  const addPOIMarkers = () => {
    if (!globeRef.current) return;
    
    pointsOfInterest.forEach(poi => {
      const marker = createPOIMarker(poi.lat, poi.lng, poi.type, poi.name);
      marker.userData = { type: 'poi-marker' };
      globeRef.current?.add(marker);
    });
  };

  // Setup enhanced click handler with better hit detection
  const setupClickHandler = (camera: THREE.PerspectiveCamera, scene: THREE.Scene) => {
    if (!globeRef.current) return () => {};
    
    const mouse = new THREE.Vector2();
    const raycaster = raycasterRef.current;
    
    // Increase raycaster sensitivity
    raycaster.params.Points!.threshold = 10;
    raycaster.params.Line!.threshold = 10;

    const handleClick = (event: MouseEvent) => {
      if (!camera || !scene || !globeRef.current) return;
      
      event.preventDefault();
      event.stopPropagation();
      
      console.log('Globe click detected at:', event.clientX, event.clientY);
      
      // Calculate normalized device coordinates with better precision
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      console.log('Mouse coordinates:', mouse.x, mouse.y);
      
      // Update the raycaster
      raycaster.setFromCamera(mouse, camera);
      
      // Get all intersected objects, including deeply nested ones
      const intersects = raycaster.intersectObjects(globeRef.current.children, true);
      
      console.log(`Found ${intersects.length} intersections`);
      
      if (intersects.length > 0) {
        // Look for country markers specifically
        for (const intersect of intersects) {
          let obj: THREE.Object3D | null = intersect.object;
          let countryData = null;
          
          // Traverse up the parent chain to find country data
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
            console.log('Country clicked:', countryData.countryId);
            
            const country = filteredCountries.find((c) => c.id === countryData.countryId);
            if (country) {
              // Visual feedback - enhanced animation
              const marker = markerRefs.current.get(countryData.countryId);
              if (marker) {
                // Pulse animation
                const originalScale = marker.scale.clone();
                const targetScale = originalScale.clone().multiplyScalar(2.0);
                
                // Animate scale up
                const animateUp = () => {
                  marker.scale.copy(targetScale);
                  
                  // Animate back down after delay
                  setTimeout(() => {
                    marker.scale.copy(originalScale);
                  }, 200);
                };
                
                animateUp();
              }
              
              // Call the selection handler
              onCountrySelect(country);
              return; // Found and handled, exit
            }
          }
        }
      }
      
      console.log('No country marker clicked');
    };

    // Also add hover effects
    const handleMouseMove = (event: MouseEvent) => {
      if (!camera || !scene || !globeRef.current) return;
      
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(globeRef.current.children, true);
      
      // Reset all hover effects
      markerRefs.current.forEach(marker => {
        const hoverArea = marker.children.find(child => child.userData?.type === 'hover-area');
        if (hoverArea) hoverArea.visible = false;
      });
      
      // Apply hover effect to intersected country
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
    addPOIMarkers,
    setupClickHandler
  };
};
