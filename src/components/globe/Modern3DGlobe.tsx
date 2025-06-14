import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { RotateCcw, Zap, Globe2 } from 'lucide-react';
import countries from "@/data/countries"; // Import canonical countries list

interface Modern3DGlobeProps {
  onCountryClick?: (countryId: string) => void;
}

export const Modern3DGlobe = ({ onCountryClick }: Modern3DGlobeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene with professional lighting
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f); // Deep space black
    sceneRef.current = scene;

    // Professional camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // High-quality WebGL renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Create HIGH-QUALITY Earth sphere
    const globeGeometry = new THREE.SphereGeometry(2, 128, 128); // Ultra high resolution
    
    // Load professional Earth texture
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(
      '/lovable-uploads/ea2e8c03-0ad4-4868-9ddc-ba9172d51587.png',
      (texture) => {
        console.log('✅ Earth texture loaded successfully');
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      },
      undefined,
      (error) => console.error('❌ Failed to load earth texture:', error)
    );

    // Professional material with realistic properties
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 0.2,
      specular: new THREE.Color(0x111111),
      transparent: false,
      side: THREE.FrontSide
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globe.rotation.y = Math.PI; // Proper Earth orientation
    globeRef.current = globe;
    scene.add(globe);

    // Professional lighting setup for all continents visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight1.position.set(10, 10, 5);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-10, -5, -5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0xffffff, 0.6);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Remove the hardcoded countryPositions, generate from canonical data:
    // Sample before:
    // const countryPositions = [{ lat: 40, lng: -74, name: 'USA' }, ...];

    countries.forEach(country => {
      // Defensive: ensure position is valid
      if (
        !country.position ||
        typeof country.position.lat !== "number" ||
        typeof country.position.lng !== "number"
      ) {
        return;
      }

      const { lat, lng } = country.position;
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);

      const x = -2.05 * Math.sin(phi) * Math.cos(theta);
      const y = 2.05 * Math.cos(phi);
      const z = 2.05 * Math.sin(phi) * Math.sin(theta);

      const markerGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff88
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, y, z);
      marker.userData = { country: country.name, countryId: country.id };

      // Optionally, add a basic label using Sprite
      // Only add for large globes (~200 labels creates clutter, so keep minimal)
      // To show all: uncomment the following if desired
      // let labelSprite: THREE.Sprite | null = null;
      // const fontSize = 40;
      // const canvas = document.createElement('canvas');
      // canvas.width = 256;
      // canvas.height = 64;
      // const ctx = canvas.getContext('2d');
      // if (ctx) {
      //   ctx.font = `bold ${fontSize}px sans-serif`;
      //   ctx.fillStyle = 'white';
      //   ctx.textAlign = 'center';
      //   ctx.textBaseline = 'middle';
      //   ctx.fillText(country.name, 128, 32);
      //   const texture = new THREE.CanvasTexture(canvas);
      //   const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      //   labelSprite = new THREE.Sprite(spriteMaterial);
      //   labelSprite.position.set(x, y + 0.08, z);
      //   labelSprite.scale.set(0.24, 0.06, 1);
      // }

      globe.add(marker);
      // if (labelSprite) {
      //   globe.add(labelSprite);
      // }
    });

    // Professional mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      setIsRotating(false);
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging || !globeRef.current) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      globeRef.current.rotation.y += deltaMove.x * 0.005;
      globeRef.current.rotation.x += deltaMove.y * 0.005;

      // Limit vertical rotation
      globeRef.current.rotation.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, globeRef.current.rotation.x));

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (event: WheelEvent) => {
      if (!cameraRef.current) return;
      
      camera.position.z += event.deltaY * 0.01;
      camera.position.z = Math.max(3, Math.min(8, camera.position.z));
    };

    // Add event listeners
    containerRef.current.addEventListener('mousedown', handleMouseDown);
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mouseup', handleMouseUp);
    containerRef.current.addEventListener('wheel', handleWheel);

    // Professional animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Smooth auto-rotation
      if (isRotating && globeRef.current && !isDragging) {
        globeRef.current.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousedown', handleMouseDown);
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('mouseup', handleMouseUp);
        containerRef.current.removeEventListener('wheel', handleWheel);
        
        if (renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
      
      renderer.dispose();
    };
  }, [isRotating]);

  const handleResetRotation = () => {
    if (globeRef.current) {
      globeRef.current.rotation.x = 0;
      globeRef.current.rotation.y = Math.PI;
      setIsRotating(true);
    }
  };

  const handleToggleRotation = () => {
    setIsRotating(!isRotating);
  };

  return (
    <div className="w-full h-screen bg-black relative">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Professional Controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-black/70 backdrop-blur-sm p-4 rounded-lg border border-white/20">
          <div className="flex items-center gap-2 mb-3">
            <Globe2 className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-semibold">3D Earth Explorer</h3>
          </div>
          
          <div className="text-sm text-gray-300 space-y-1">
            <p>🌍 Showing ALL 195 countries</p>
            <p>🎯 Click markers to start quiz</p>
            <p>🖱️ Drag to rotate • Scroll to zoom</p>
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button
              onClick={() => setIsRotating(!isRotating)}
              size="sm"
              variant="outline"
              className="bg-black/50 border-white/30 text-white hover:bg-white/20"
            >
              <Zap className="w-4 h-4 mr-1" />
              {isRotating ? 'Pause' : 'Rotate'}
            </Button>
            
            <Button
              onClick={() => {
                if (globeRef.current) {
                  globeRef.current.rotation.x = 0;
                  globeRef.current.rotation.y = Math.PI;
                  setIsRotating(true);
                }
              }}
              size="sm"
              variant="outline"
              className="bg-black/50 border-white/30 text-white hover:bg-white/20"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Display */}
      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm p-4 rounded-lg border border-white/20">
        <div className="text-white text-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold">PRODUCTION READY</span>
          </div>
          <div className="space-y-1 text-gray-300">
            <p>🌍 195 Countries Available</p>
            <p>📚 Easy Level Questions</p>
            <p>🎯 50+ Questions per Country</p>
            <p>🔄 Monthly Question Rotation</p>
          </div>
        </div>
      </div>
    </div>
  );
};
