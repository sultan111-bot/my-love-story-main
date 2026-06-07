import { useMemo } from "react";
import { useAnimationConfig } from "../hooks/usePerformanceMode.js";

const DEFAULT_COUNT = 18;

export default function FloatingPetals() {
  const config = useAnimationConfig();

  // Use fewer petals on low-end devices
  const COUNT = config.enableFloatingPetals ? config.petalCount : 0;

  const petals = useMemo(() => {
    return Array.from({ length: COUNT }, (_, i) => {
      const size = 6 + Math.random() * 8;
      const left = Math.random() * 100;
      const opacity = 0.2 + Math.random() * 0.3;
      const duration = 12 + Math.random() * 14;
      const delay = -Math.random() * duration;
      const drift = (Math.random() * 80 - 40).toFixed(0) + "px";
      return { i, size, left, opacity, duration, delay, drift };
    });
  }, [COUNT]);

  if (COUNT === 0) return null;

  return (
    <div 
      aria-hidden 
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      style={{ contain: 'strict' }}
    >
      {petals.map((p) => (
        <span
          key={p.i}
          className="petal"
          style={{
            width: p.size,
            height: p.size,
            left: p.left + "%",
            animationDuration: p.duration + "s",
            animationDelay: p.delay + "s",
            "--petal-opacity": p.opacity,
            "--petal-drift": p.drift,
          }}
        />
      ))}
    </div>
  );
}
