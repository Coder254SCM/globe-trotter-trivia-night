
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import countries from "../data/countries";
import { Country, QuestionCategory } from "../types/quiz";
import { Globe as GlobeIcon, MapPin, Landmark, Trophy, Filter, Book } from "lucide-react";
import { setupScene, setupCamera, setupRenderer } from "../utils/threeSetup";
import { createCountryMarker, createPOIMarker } from "./globe/GlobeMarkers";
import { StarsBackground } from "./globe/StarsBackground";
import { CountryCard } from "./globe/CountryCard";
import { pointsOfInterest } from "./globe/types";
import { Button } from "./ui/button";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";

interface GlobeProps {
  onCountrySelect: (country: Country) => void;
  onStartWeeklyChallenge?: () => void;
}

// Extract unique continents from countries data
const availableContinents = Array.from(new Set(countries.map(country => country.continent)));

// Extract unique categories from all countries
const allCategories = Array.from(
  new Set(countries.flatMap(country => country.categories))
);

const Globe = ({ onCountrySelect, onStartWeeklyChallenge }: GlobeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const markerRefs = useRef<Map<string, THREE.Object3D>>(new Map());
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [rotating, setRotating] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | null>(null);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(countries);
  const animationFrameIdRef = useRef<number>(0);
  const globeTextureLoaded = useRef<boolean>(false);

  // Apply filters when continent or category changes
  useEffect(() => {
    let filtered = [...countries];
    
    if (selectedContinent) {
      filtered = filtered.filter(c => c.continent === selectedContinent);
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(c => c.categories.includes(selectedCategory));
    }
    
    setFilteredCountries(filtered);
  }, [selectedContinent, selectedCategory]);

  // Create and update markers when filtered countries change
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

  // Update markers when filters or label visibility changes
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
    
    // Use the new uploaded texture
    const earthTexture = textureLoader.load('/lovable-uploads/94c703e9-6c52-4f7b-826f-0de74dd8bcdf.png', () => {
      globeTextureLoaded.current = true;
    });
    
    // Add bump map for 3D effect
    const bumpMap = textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/2560px-Equirectangular_projection_SW.jpg');
    
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 4,
      specular: new THREE.Color(0x333333),
      shininess: 15,
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthRef.current = earth;
    globe.add(earth);
    
    // Add atmosphere glow effect
    const atmosphereGeometry = new THREE.SphereGeometry(103, 64, 64);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x3366cc,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globe.add(atmosphere);

    // Add lighting for better visibility
    const ambientLight = new THREE.AmbientLight(0x606060, 2);
    scene.add(ambientLight);

    // Add directional light to create shadows and highlights on the globe
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add a secondary light from another angle
    const secondaryLight = new THREE.DirectionalLight(0xffffff, 1.5);
    secondaryLight.position.set(-1, 0.5, -1);
    scene.add(secondaryLight);
    
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
        } else {
          setRotating(false); // Stop automatic rotation when focused
        }
      };
      
      rotateGlobe();
    }
  };

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

  const handleContinentChange = (value: string) => {
    if (value === "all") {
      setSelectedContinent(null);
    } else {
      setSelectedContinent(value);
      zoomToContinent(value);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(value as QuestionCategory);
    }
  };

  const clearFilters = () => {
    setSelectedContinent(null);
    setSelectedCategory(null);
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
      
      {/* New filter controls */}
      <div className="absolute top-24 right-4 z-10 bg-background/90 p-4 rounded-lg shadow-lg backdrop-blur-sm border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-primary" />
          <h3 className="font-medium">Explore by</h3>
        </div>
        
        <div className="grid gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Continent</label>
            <Select 
              value={selectedContinent || "all"} 
              onValueChange={handleContinentChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Continents" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Continents</SelectItem>
                  {availableContinents.map((continent) => (
                    <SelectItem key={continent} value={continent}>
                      {continent}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Category</label>
            <Select 
              value={selectedCategory || "all"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <SelectGroup>
                  <SelectItem value="all">All Categories</SelectItem>
                  {allCategories
                    .sort((a, b) => a.localeCompare(b))
                    .map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="mt-2"
          >
            Clear Filters
          </Button>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Showing:</p>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline">{filteredCountries.length} Countries</Badge>
            {selectedContinent && (
              <Badge variant="secondary">{selectedContinent}</Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary">{selectedCategory}</Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-4 px-6 py-3 bg-background/90 backdrop-blur-sm rounded-full border border-border">
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
