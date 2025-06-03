
import { useEffect } from "react";
import * as THREE from "three";
import { useGlobeScene } from "./globe/useGlobeScene";
import { useGlobeMarkers } from "./globe/useGlobeMarkers";
import { useGlobeAnimations } from "./globe/useGlobeAnimations";
import { Country } from "../types/quiz";
import countries from "../data/countries";
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
  // Get the scene, globe, and renderer
  const {
    containerRef,
    globeRef,
    sceneRef,
    cameraRef,
    cloudsRef,
    rendererRef,
    globeTextureLoaded
  } = useGlobeScene();

  // Get marker functionality
  const {
    markerRefs,
    updateMarkers,
    addPOIMarkers,
    setupClickHandler
  } = useGlobeMarkers({
    globeRef,
    filteredCountries,
    showLabels,
    onCountrySelect
  });

  // Get animation functionality
  const {
    startRotation,
    zoomToContinent,
    focusCountry
  } = useGlobeAnimations(globeRef, cameraRef, markerRefs);

  // Update markers when filtered countries change
  useEffect(() => {
    if (globeRef.current) {
      updateMarkers();
    }
  }, [filteredCountries, showLabels, globeRef.current]);

  // Setup click handlers and animation once scene is ready
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current || !globeRef.current || !rendererRef.current || !containerRef.current) return;

    console.log('Setting up globe interactions...');

    // Add POI markers
    addPOIMarkers();
    
    // Setup enhanced click handlers
    const handlers = setupClickHandler(cameraRef.current, sceneRef.current);
    if (!handlers) return;
    
    // Fixed: Properly destructure the handlers
    const { handleClick, handleMouseMove } = handlers;
    
    // Remove any existing handlers to prevent duplicates
    containerRef.current.removeEventListener("click", handleClick);
    containerRef.current.removeEventListener("mousemove", handleMouseMove);
    
    // Add the new handlers
    containerRef.current.addEventListener("click", handleClick, { passive: false });
    containerRef.current.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    // Start animation
    const cleanup = startRotation(
      rotating, 
      rendererRef.current, 
      sceneRef.current, 
      cameraRef.current,
      cloudsRef
    );
    
    // Display toast when globe is fully loaded
    if (globeTextureLoaded.current && cloudsRef.current) {
      toast({
        title: "World Explorer Ready",
        description: `Explore ${countries.length} countries worldwide. Click on any glowing marker to start a quiz!`,
      });
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("click", handleClick);
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
      }
      cleanup();
    };
  }, [rotating, sceneRef.current, cameraRef.current, globeRef.current, rendererRef.current, containerRef.current]);

  return {
    containerRef,
    zoomToContinent: (continent: string) => zoomToContinent(continent, countries),
    focusCountry
  };
};
