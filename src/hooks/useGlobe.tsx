
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
    updateMarkers();
  }, [filteredCountries, showLabels]);

  // Setup POI markers, click handlers, and animation once scene is ready
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current || !globeRef.current || !rendererRef.current) return;

    // Add POI markers
    addPOIMarkers();
    
    // Setup click handler with improved hit detection
    const handleClick = setupClickHandler(cameraRef.current, sceneRef.current);
    
    if (containerRef.current) {
      // Remove any existing handler first to prevent duplicates
      containerRef.current.removeEventListener("click", handleClick);
      // Add the new handler
      containerRef.current.addEventListener("click", handleClick);
    }
    
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
        title: "Globe Loaded",
        description: `Explore ${countries.length} countries from around the world. Click on any marker to learn more!`,
      });
    }
    
    return () => {
      containerRef.current?.removeEventListener("click", handleClick);
      cleanup();
    };
  }, [rotating, sceneRef.current, cameraRef.current, globeRef.current, rendererRef.current]);

  return {
    containerRef,
    zoomToContinent: (continent: string) => zoomToContinent(continent, countries),
    focusCountry
  };
};
