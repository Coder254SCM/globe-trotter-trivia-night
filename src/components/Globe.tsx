import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import countries from "../data/countries";
import { Country } from "../types/quiz";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Globe as GlobeIcon, MapPin, Landmark } from "lucide-react";
import dynamic from 'next/dynamic';

const Football = dynamic(() => import('lucide-react/icons/football'), { ssr: false });

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
    // Generate stars
    const starContainer = containerRef.current;
    if (starContainer) {
      for (let i = 0; i < 200; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.opacity = `${Math.random() * 0.8 + 0.2}`;
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        starContainer.appendChild(star);
      }
    }

    // Initialize Three.js with improved lighting and materials
    if (!containerRef.current) return;
    
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Improved camera settings
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 300;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance" 
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 100);
    scene.add(directionalLight);

    // Create globe with improved materials
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

    // Add museum and sports venue markers
    const addPointOfInterest = (lat: number, lng: number, type: 'museum' | 'sports') => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      
      const x = -100 * Math.sin(phi) * Math.cos(theta);
      const y = 100 * Math.cos(phi);
      const z = 100 * Math.sin(phi) * Math.sin(theta);
      
      const markerGeometry = new THREE.SphereGeometry(1.5, 16, 16);
      const markerMaterial = new THREE.MeshPhongMaterial({
        color: type === 'museum' ? 0x9333ea : 0x2563eb,
        emissive: type === 'museum' ? 0x6b21a8 : 0x1d4ed8,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.9,
      });
      
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, y, z);
      globe.add(marker);
      
      return marker;
    };

    // Add some notable museums and sports venues
    const pointsOfInterest = [
      { lat: 48.8606, lng: 2.3376, type: 'museum' as const }, // Louvre
      { lat: 40.7794, lng: -73.9632, type: 'museum' as const }, // Met
      { lat: 51.4967, lng: -0.1764, type: 'museum' as const }, // Natural History Museum
      { lat: 51.5033, lng: -0.1195, type: 'sports' as const }, // Wembley
      { lat: 40.7505, lng: -73.9934, type: 'sports' as const }, // Madison Square Garden
      { lat: 48.8413, lng: 2.2530, type: 'sports' as const }, // Roland Garros
    ];

    pointsOfInterest.forEach(poi => {
      addPointOfInterest(poi.lat, poi.lng, poi.type);
    });

    // Country markers
    countries.forEach((country) => {
      const { lat, lng } = country.position;
      
      // Convert lat/lng to 3D coordinates
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      
      const x = -100 * Math.sin(phi) * Math.cos(theta);
      const y = 100 * Math.cos(phi);
      const z = 100 * Math.sin(phi) * Math.sin(theta);
      
      // Create marker
      const markerGeometry = new THREE.SphereGeometry(2, 16, 16);
      
      // Set color based on difficulty
      let markerColor;
      switch (country.difficulty) {
        case 'easy':
          markerColor = 0x4ade80; // green
          break;
        case 'medium':
          markerColor = 0xfacc15; // yellow
          break;
        case 'hard':
          markerColor = 0xef4444; // red
          break;
        default:
          markerColor = 0x8b5cf6; // purple
      }
      
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: markerColor,
        transparent: true,
        opacity: 0.8,
      });
      
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, y, z);
      marker.userData = { countryId: country.id };
      globe.add(marker);
      
      // Store reference to marker
      markerRefs.current.set(country.id, marker);
    });

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener("resize", handleResize);

    // Raycaster for picking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Click handler
    const handleClick = (event: MouseEvent) => {
      if (!cameraRef.current || !sceneRef.current) return;
      
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      raycaster.setFromCamera(mouse, cameraRef.current);
      
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

    // Animation loop with smoother rotation
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      
      if (rotating && globeRef.current) {
        globeRef.current.rotation.y += 0.0005; // Slower rotation
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      // Animate markers with smoother pulsing
      markerRefs.current.forEach((marker) => {
        const scale = 1 + Math.sin(Date.now() * 0.002) * 0.1;
        marker.scale.set(scale, scale, scale);
      });
    };
    
    animate();

    // Cleanup
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      
      if (rendererRef.current && rendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeEventListener("click", handleClick);
      
      // Remove stars
      const stars = document.querySelectorAll(".star");
      stars.forEach((star) => star.remove());
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
        {/* Stars will be dynamically added here */}
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
        <div className="absolute inset-0 flex items-center justify-center z-10 animate-fade-in">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={handleCloseCard}></div>
          <Card className="w-full max-w-md p-6 relative z-20 border-primary/20 shadow-lg shadow-primary/20">
            <div className="flex items-center gap-4 mb-6">
              {/* Using standard lucide-react icons */}
              {selectedCountry.categories.includes('Museum') && <Landmark className="inline-block mr-1" size={24} />}
              {selectedCountry.categories.includes('Sports') && <Football className="inline-block mr-1" size={24} />}
              
              {selectedCountry.flagImageUrl && (
                <img 
                  src={selectedCountry.flagImageUrl} 
                  alt={`${selectedCountry.name} flag`}
                  className="w-12 h-8 object-cover shadow-sm"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold">{selectedCountry.name}</h2>
                <p className="text-muted-foreground">
                  <MapPin className="inline-block mr-1" size={16} />
                  Quiz {selectedCountry.difficulty} difficulty
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Categories:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCountry.categories.map((category) => (
                  <span 
                    key={category}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
            
            <Button onClick={handleStartQuiz} className="w-full">
              Start {selectedCountry.name} Quiz
            </Button>
            
            <Button 
              variant="ghost" 
              className="absolute top-2 right-2"
              onClick={handleCloseCard}
            >
              ✕
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Globe;
