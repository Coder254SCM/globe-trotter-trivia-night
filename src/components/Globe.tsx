
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import countries from "../data/countries";
import { Country } from "../types/quiz";
import { Globe as GlobeIcon } from "lucide-react";
import { setupScene, setupCamera, setupRenderer } from "../utils/threeSetup";
import { createCountryMarker, createPOIMarker } from "./globe/GlobeMarkers";
import { StarsBackground } from "./globe/StarsBackground";
import { CountryCard } from "./globe/CountryCard";
import { pointsOfInterest } from "./globe/types";

interface GlobeProps {
  onCountrySelect: (country: Country) => void;
}

const Globe = ({ onCountrySelect }: GlobeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const markerRefs = useRef<Map<string, THREE.Mesh>>(new Map());
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [rotating, setRotating] = useState(true);
  const animationFrameIdRef = useRef<number>(0);

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

    const earthGeometry = new THREE.SphereGeometry(100, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x1f2937,
      wireframe: true,
      wireframeLinewidth: 0.5,
      transparent: true,
      opacity: 0.8
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    globe.add(earth);

    // Add POI markers
    pointsOfInterest.forEach(poi => {
      const marker = createPOIMarker(poi.lat, poi.lng, poi.type);
      globe.add(marker);
    });

    // Add country markers
    countries.forEach((country) => {
      const { lat, lng } = country.position;
      const marker = createCountryMarker(lat, lng, country.difficulty);
      marker.userData = { countryId: country.id };
      globe.add(marker);
      markerRefs.current.set(country.id, marker);
    });

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
      if (!camera || !scene) return;
      
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      
      const intersects = raycaster.intersectObjects(
        Array.from(markerRefs.current.values())
      );
      
      if (intersects.length > 0) {
        const clickedMarker = intersects[0].object;
        const countryId = clickedMarker.userData?.countryId;
        
        if (countryId) {
          const country = countries.find((c) => c.id === countryId);
          if (country) {
            setSelectedCountry(country);
            setRotating(false);
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
      }
      
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
      
      // Animate markers
      markerRefs.current.forEach((marker) => {
        const scale = 1 + Math.sin(Date.now() * 0.002) * 0.1;
        marker.scale.set(scale, scale, scale);
      });
    };
    
    animate();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      
      if (renderer && renderer.domElement && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeEventListener("click", handleClick);
    };
  }, []);

  const handleStartQuiz = () => {
    if (selectedCountry) {
      onCountrySelect(selectedCountry);
    }
  };

  const handleCloseCard = () => {
    setSelectedCountry(null);
    setRotating(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={containerRef} className="globe-container w-full h-full">
        <StarsBackground containerRef={containerRef} />
      </div>
      
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-4xl font-bold flex items-center">
          <GlobeIcon size={40} className="mr-2 text-primary glow" />
          <span>Global Night Out</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Explore the world and test your knowledge in this interactive trivia adventure
        </p>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-4 px-6 py-3 bg-muted/50 backdrop-blur-sm rounded-full">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Easy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Hard</span>
          </div>
          <p className="ml-4">Click on a location to start a quiz</p>
        </div>
      </div>
      
      {selectedCountry && (
        <CountryCard
          country={selectedCountry}
          onClose={handleCloseCard}
          onStartQuiz={handleStartQuiz}
        />
      )}
    </div>
  );
};

export default Globe;

