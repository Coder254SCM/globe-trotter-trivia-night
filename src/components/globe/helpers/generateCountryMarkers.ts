
import * as THREE from 'three';
import countries from "@/data/countries";

// Pure helper to create ALL country markers with better visibility
export function generateCountryMarkers(
  globe: THREE.Mesh | THREE.Group,
  markerRadius = 3.05 // Updated for larger globe
) {
  // Remove all existing markers (if any)
  while (globe.children.length > 1) { // preserve the globe geometry itself (assume at idx 0)
    const toRemove = globe.children[globe.children.length - 1];
    globe.remove(toRemove);
  }

  countries.forEach(country => {
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

    const x = -markerRadius * Math.sin(phi) * Math.cos(theta);
    const y = markerRadius * Math.cos(phi);
    const z = markerRadius * Math.sin(phi) * Math.sin(theta);

    // Create much larger and more visible markers with country labels
    const markerGeometry = new THREE.SphereGeometry(0.08, 16, 16); // Increased from 0.02 to 0.08
    const markerMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff88,
      emissive: 0x004422, // Add glow effect
      emissiveIntensity: 0.3
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(x, y, z);
    marker.userData = { country: country.name, countryId: country.id };

    // Create text label for each country
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      const fontSize = 32;
      context.font = `bold ${fontSize}px Arial`;
      const textWidth = context.measureText(country.name).width;
      canvas.width = textWidth + 20;
      canvas.height = fontSize + 10;
      
      // Clear and draw background
      context.fillStyle = 'rgba(0, 0, 0, 0.8)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw text
      context.fillStyle = 'white';
      context.font = `bold ${fontSize}px Arial`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(country.name, canvas.width / 2, canvas.height / 2);
      
      // Create sprite from canvas
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      
      // Scale and position the label
      const scale = 0.3;
      sprite.scale.set(canvas.width * scale, canvas.height * scale, 1);
      sprite.position.set(x * 1.1, y * 1.1, z * 1.1); // Position slightly outside the marker
      
      globe.add(sprite);
    }

    // Add a subtle pulsing animation
    const animate = () => {
      const time = Date.now() * 0.005;
      const scale = 1 + Math.sin(time + Math.random() * Math.PI) * 0.2;
      marker.scale.setScalar(scale);
      requestAnimationFrame(animate);
    };
    animate();

    globe.add(marker);
  });

  console.log(`Generated ${countries.length} visible country markers with labels`);
}
