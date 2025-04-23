
import { useEffect } from 'react';

interface StarsBackgroundProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export const StarsBackground = ({ containerRef }: StarsBackgroundProps) => {
  useEffect(() => {
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

    return () => {
      const stars = document.querySelectorAll(".star");
      stars.forEach((star) => star.remove());
    };
  }, [containerRef]);

  return null;
};

