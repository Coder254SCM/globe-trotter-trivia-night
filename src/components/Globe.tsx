
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import countries from "../data/countries";
import { Country } from "../types/quiz";
import { Globe as GlobeIcon, MapPin, Landmark, Trophy } from "lucide-react";
import { setupScene, setupCamera, setupRenderer } from "../utils/threeSetup";
import { createCountryMarker, createPOIMarker } from "./globe/GlobeMarkers";
import { StarsBackground } from "./globe/StarsBackground";
import { CountryCard } from "./globe/CountryCard";
import { pointsOfInterest } from "./globe/types";
import { Button } from "./ui/button";

interface GlobeProps {
  onCountrySelect: (country: Country) => void;
  onStartWeeklyChallenge?: () => void;
}

const Globe = ({ onCountrySelect, onStartWeeklyChallenge }: GlobeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const markerRefs = useRef<Map<string, THREE.Object3D>>(new Map());
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [rotating, setRotating] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const animationFrameIdRef = useRef<number>(0);
  const globeTextureLoaded = useRef<boolean>(false);

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

    // Create colorful Earth globe with continents
    const earthGeometry = new THREE.SphereGeometry(100, 64, 64);
    
    // Load Earth texture with continents and oceans
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('/lovable-uploads/02bfe633-4bdd-46b1-bc0b-76cba6322120.png', () => {
      globeTextureLoaded.current = true;
    });
    
    // Add bump map for 3D effect (optional)
    const bumpMap = textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/2560px-Equirectangular_projection_SW.jpg');
    
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 2,
      specular: new THREE.Color(0x333333),
      shininess: 5,
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    globe.add(earth);
    
    // Add a subtle atmosphere glow effect
    const atmosphereGeometry = new THREE.SphereGeometry(103, 64, 64);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x3366cc,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globe.add(atmosphere);

    // Add ambient light for better visibility
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    // Add directional light for better visibility
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add a grid helper for longitude/latitude reference
    const gridHelper = new THREE.GridHelper(250, 20, 0xaaaaaa, 0x444444);
    gridHelper.rotation.x = Math.PI / 2;
    scene.add(gridHelper);

    // Add POI markers
    pointsOfInterest.forEach(poi => {
      const marker = createPOIMarker(poi.lat, poi.lng, poi.type, poi.name);
      globe.add(marker);
    });

    // Add country markers with labels
    countries.forEach((country) => {
      const { lat, lng } = country.position;
      const marker = createCountryMarker(
        lat, 
        lng, 
        country.difficulty, 
        country.iconType,
        showLabels ? country.name : undefined
      );
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
        
        // Scale the actual marker, not the label
        if (marker instanceof THREE.Group && marker.children.length > 0) {
          marker.children[0].scale.set(scale, scale, scale);
        } else {
          marker.scale.set(scale, scale, scale);
        }
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
  }, [showLabels]);

  const handleStartQuiz = (difficulty: string) => {
    if (selectedCountry) {
      // Use the selected difficulty for the quiz
      const countryWithDifficulty = {
        ...selectedCountry,
        difficulty: difficulty as 'easy' | 'medium' | 'hard'
      };
      onCountrySelect(countryWithDifficulty);
    }
  };

  const handleCloseCard = () => {
    setSelectedCountry(null);
    setRotating(true);
  };

  const toggleLabels = () => {
    setShowLabels(!showLabels);
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
      
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button 
          onClick={toggleLabels}
          className="flex items-center gap-2"
          variant="outline"
        >
          <MapPin size={18} />
          {showLabels ? "Hide Labels" : "Show Labels"}
        </Button>
        
        {onStartWeeklyChallenge && (
          <Button 
            onClick={onStartWeeklyChallenge}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Trophy size={18} />
            Weekly Challenge
          </Button>
        )}
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-4 px-6 py-3 bg-muted/90 backdrop-blur-sm rounded-full">
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
          <p className="ml-4">Click on a country to start a quiz</p>
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
