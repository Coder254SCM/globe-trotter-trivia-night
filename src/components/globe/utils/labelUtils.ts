
// Utility for creating text canvas labels for globe markers

// Create a canvas text label with improved styling and better visibility
export const createTextCanvas = (text: string) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) return null;
  
  const fontSize = 24; // Larger font size for better visibility
  context.font = `bold ${fontSize}px Arial`;
  
  // Get text metrics to size canvas appropriately
  const metrics = context.measureText(text);
  const width = metrics.width + 40; // Wider padding
  const height = fontSize + 24;    // Taller for better visibility
  
  canvas.width = width;
  canvas.height = height;
  
  // Draw background with rounded corners - darker and more opaque
  context.fillStyle = 'rgba(0, 0, 0, 0.95)';
  context.beginPath();
  context.roundRect(0, 0, width, height, 10);
  context.fill();
  
  // Add a stronger border
  context.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  context.lineWidth = 2;
  context.beginPath();
  context.roundRect(0, 0, width, height, 10);
  context.stroke();
  
  // Draw text in white for better contrast
  context.fillStyle = 'white';
  context.font = `bold ${fontSize}px Arial`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, width / 2, height / 2);
  
  return canvas;
};
