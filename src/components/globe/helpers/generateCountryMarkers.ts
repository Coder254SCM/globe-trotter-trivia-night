
import * as THREE from 'three';
import countries from "@/data/countries";

// Pure helper to create ALL country markers (no POIs, no landmarks)
export function generateCountryMarkers(
  globe: THREE.Mesh | THREE.Group,
  markerRadius = 2.05
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

    const markerGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff88
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(x, y, z);
    marker.userData = { country: country.name, countryId: country.id };

    globe.add(marker);
  });
}
