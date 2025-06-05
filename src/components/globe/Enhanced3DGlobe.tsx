
import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function EarthSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load high-quality Earth textures
  const [earthTexture, normalTexture, specularTexture] = useTexture([
    '/lovable-uploads/ea2e8c03-0ad4-4868-9ddc-ba9172d51587.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  useEffect(() => {
    if (meshRef.current) {
      // Auto-rotate the globe
      const animate = () => {
        if (meshRef.current) {
          meshRef.current.rotation.y += 0.005;
        }
        requestAnimationFrame(animate);
      };
      animate();
    }
  }, []);

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhongMaterial
        map={earthTexture}
        normalMap={normalTexture}
        normalScale={new THREE.Vector2(0.4, 0.4)}
        specularMap={specularTexture}
        shininess={100}
      />
    </mesh>
  );
}

function CloudLayer() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const cloudsTexture = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png');

  useEffect(() => {
    if (meshRef.current) {
      const animate = () => {
        if (meshRef.current) {
          meshRef.current.rotation.y += 0.003;
        }
        requestAnimationFrame(animate);
      };
      animate();
    }
  }, []);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.01, 64, 64]} />
      <meshPhongMaterial
        map={cloudsTexture}
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface Enhanced3DGlobeProps {
  onCountryClick?: (countryId: string) => void;
}

export const Enhanced3DGlobe = ({ onCountryClick }: Enhanced3DGlobeProps) => {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.8} />
        
        {/* Stars Background */}
        <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} />
        
        {/* Earth with Clouds */}
        <EarthSphere />
        <CloudLayer />
        
        {/* Interactive Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={3}
          maxDistance={8}
          autoRotate={false}
        />
      </Canvas>
      
      {/* Instructions Overlay */}
      <div className="absolute top-4 left-4 text-white bg-black/50 p-4 rounded">
        <h3 className="font-bold mb-2">Enhanced 3D Globe</h3>
        <p className="text-sm">• Drag to rotate</p>
        <p className="text-sm">• Scroll to zoom</p>
        <p className="text-sm">• Auto-rotating with realistic textures</p>
      </div>
    </div>
  );
};
