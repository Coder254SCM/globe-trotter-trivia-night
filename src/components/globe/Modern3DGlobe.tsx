
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { RotateCcw, Zap, Globe2 } from 'lucide-react';
import { generateCountryMarkers } from './helpers/generateCountryMarkers';

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

    // Setup scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

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

    // Create the Earth sphere
    const globeGeometry = new THREE.SphereGeometry(2, 128, 128);    
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(
      '/lovable-uploads/ea2e8c03-0ad4-4868-9ddc-ba9172d51587.png',
      (texture) => {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    );

    const globeMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 0.1,
      specular: new THREE.Color(0x222222),
      transparent: false
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globe.rotation.y = Math.PI;
    globeRef.current = globe;
    scene.add(globe);

    // Add atmospheric glow
    const globeGlow = new THREE.Mesh(
      new THREE.SphereGeometry(2.10, 128, 128),
      new THREE.MeshBasicMaterial({
        color: 0x7ddfff,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending
      })
    );
    scene.add(globeGlow);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight1.position.set(10, 20, 10);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight2.position.set(-10, -20, -5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // 🚨 Country Markers ONLY. No POIs, museums, etc.
    generateCountryMarkers(globe);

    // Mouse Controls
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

    containerRef.current.addEventListener('mousedown', handleMouseDown);
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mouseup', handleMouseUp);
    containerRef.current.addEventListener('wheel', handleWheel);

    // Animation loop 
    const animate = () => {
      requestAnimationFrame(animate);
      if (isRotating && globeRef.current && !isDragging) {
        globeRef.current.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Resize
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

  // UI actions
  const handleResetRotation = () => {
    if (globeRef.current) {
      globeRef.current.rotation.x = 0;
      globeRef.current.rotation.y = Math.PI;
      setIsRotating(true);
    }
  };

  return (
    <div className="w-full h-screen bg-black relative">
      <div ref={containerRef} className="w-full h-full" />
      {/* Controls */}
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
              onClick={handleResetRotation}
              size="sm"
              variant="outline"
              className="bg-black/50 border-white/30 text-white hover:bg-white/20"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      {/* Statistics */}
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
