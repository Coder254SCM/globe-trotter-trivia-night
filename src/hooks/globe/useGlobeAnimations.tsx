
import { useRef } from "react";
import * as THREE from "three";
import { Country } from "../../types/quiz";
import { toast } from "@/components/ui/use-toast";

export const useGlobeAnimations = (
  globeRef: React.MutableRefObject<THREE.Group | null>,
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>,
  markerRefs: React.MutableRefObject<Map<string, THREE.Object3D>>
) => {
  const animationFrameIdRef = useRef<number>(0);

  const startRotation = (
    rotating: boolean,
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    cloudsRef: React.MutableRefObject<THREE.Mesh | null>
  ) => {
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
    };
  };

  // Zoom to a specific continent
  const zoomToContinent = (continent: string, countries: Country[]) => {
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
    startRotation,
    zoomToContinent,
    focusCountry,
    animationFrameIdRef
  };
};
