
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface Enhanced3DGlobeProps {
  onCountryClick?: (countryId: string) => void;
}

export const Enhanced3DGlobe = ({ onCountryClick }: Enhanced3DGlobeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene with enhanced background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    sceneRef.current = scene;

    // Setup camera with better positioning
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Setup renderer with enhanced quality
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMappingExposure = 1.5;
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Create enhanced globe with higher resolution
    const globeGeometry = new THREE.SphereGeometry(2, 128, 128);
    
    // Load high-quality textures
    const textureLoader = new THREE.TextureLoader();
    
    // Earth diffuse texture
    const earthTexture = textureLoader.load(
      '/lovable-uploads/ea2e8c03-0ad4-4868-9ddc-ba9172d51587.png',
      () => console.log('Earth texture loaded successfully'),
      undefined,
      (error) => console.error('Failed to load earth texture:', error)
    );
    
    // Configure texture for maximum quality
    earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    earthTexture.minFilter = THREE.LinearMipmapLinearFilter;
    earthTexture.magFilter = THREE.LinearFilter;

    // Load bump map for terrain detail
    const bumpTexture = textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg'
    );
    bumpTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Load specular map for realistic water reflection
    const specularTexture = textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
    );
    specularTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Create enhanced material with realistic properties
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.05,
      specularMap: specularTexture,
      specular: new THREE.Color(0x4444aa),
      shininess: 100,
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globe.rotation.y = Math.PI;
    globe.castShadow = true;
    globe.receiveShadow = true;
    globeRef.current = globe;
    scene.add(globe);

    // Add realistic cloud layer
    const cloudsGeometry = new THREE.SphereGeometry(2.05, 64, 64);
    const cloudsTexture = textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
    );
    cloudsTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(clouds);

    // Add atmospheric glow effect
    const atmosphereGeometry = new THREE.SphereGeometry(2.2, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        c: { value: 1.0 },
        p: { value: 1.4 },
        glowColor: { value: new THREE.Color(0x00aaff) },
        viewVector: { value: camera.position }
      },
      vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(c - dot(vNormal, vNormel), p);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4(glow, 1.0);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Enhanced lighting setup for realistic illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(5, 3, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Add rim lighting for better depth perception
    const rimLight = new THREE.DirectionalLight(0x4488ff, 0.5);
    rimLight.position.set(-5, 0, -2);
    scene.add(rimLight);

    // Create realistic starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 15000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      // Random positions in sphere
      const radius = 500 + Math.random() * 500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
      
      // Varied star colors (white, blue, yellow)
      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.2 + 0.5, 0.55, Math.random() * 0.25 + 0.75);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const starsMaterial = new THREE.PointsMaterial({ 
      size: 2, 
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Enhanced mouse controls with smooth interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0 };
    let autoRotate = true;

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      autoRotate = false;
      previousMousePosition = { x: event.clientX, y: event.clientY };
      rotationVelocity = { x: 0, y: 0 };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging || !globeRef.current) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      rotationVelocity.x = deltaMove.y * 0.005;
      rotationVelocity.y = deltaMove.x * 0.005;

      globeRef.current.rotation.x += rotationVelocity.x;
      globeRef.current.rotation.y += rotationVelocity.y;

      // Rotate clouds slightly differently for realism
      clouds.rotation.y += rotationVelocity.y * 0.8;

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
      // Resume auto-rotation after 3 seconds of inactivity
      setTimeout(() => {
        if (!isDragging) autoRotate = true;
      }, 3000);
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.position.z += event.deltaY * 0.01;
      camera.position.z = Math.max(3, Math.min(8, camera.position.z));
    };

    // Add event listeners
    containerRef.current.addEventListener('mousedown', handleMouseDown);
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mouseup', handleMouseUp);
    containerRef.current.addEventListener('wheel', handleWheel, { passive: false });

    // Enhanced animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Auto-rotate when not interacting
      if (autoRotate && !isDragging && globeRef.current) {
        globeRef.current.rotation.y += 0.002;
        clouds.rotation.y += 0.0015; // Clouds rotate slightly faster
      }

      // Apply momentum when not dragging
      if (!isDragging && globeRef.current) {
        rotationVelocity.x *= 0.95;
        rotationVelocity.y *= 0.95;
        
        globeRef.current.rotation.x += rotationVelocity.x;
        globeRef.current.rotation.y += rotationVelocity.y;
        clouds.rotation.y += rotationVelocity.y * 0.8;
      }

      // Animate stars (subtle twinkling)
      if (stars.material instanceof THREE.PointsMaterial) {
        stars.material.opacity = 0.6 + Math.sin(Date.now() * 0.001) * 0.2;
      }

      // Update atmosphere shader
      if (atmosphere.material instanceof THREE.ShaderMaterial) {
        atmosphere.material.uniforms.viewVector.value = camera.position;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !renderer) return;
      
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
  }, []);

  return (
    <div className="w-full h-screen bg-black relative">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Enhanced Instructions Overlay */}
      <div className="absolute top-4 left-4 text-white bg-black/70 backdrop-blur-sm p-4 rounded-lg border border-white/10">
        <h3 className="font-bold mb-2 text-blue-400">🌍 Enhanced Earth Globe</h3>
        <p className="text-sm mb-1">• Drag to rotate the planet</p>
        <p className="text-sm mb-1">• Scroll to zoom in/out</p>
        <p className="text-sm mb-1">• Realistic textures & lighting</p>
        <p className="text-sm mb-1">• Atmospheric glow & cloud layers</p>
        <p className="text-sm">• Auto-rotation with momentum physics</p>
      </div>

      {/* Visual enhancements indicator */}
      <div className="absolute bottom-4 right-4 text-white bg-green-600/20 backdrop-blur-sm p-3 rounded-lg border border-green-400/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Enhanced Rendering Active</span>
        </div>
      </div>
    </div>
  );
};
