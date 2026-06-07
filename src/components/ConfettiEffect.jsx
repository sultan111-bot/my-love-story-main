import { useEffect, useState } from "react";
import { useAnimationConfig } from "../hooks/usePerformanceMode.js";

const COLORS = ["#FF6B9D", "#FFE66D", "#6BCB77", "#4D96FF", "#FF6B6B", "#C77DFF"];

/**
 * Reusable confetti effect (CSS-only). Renders `count` pieces falling from top.
 */
export default function ConfettiEffect({ active, duration = 3000, count = 40 }) {
  const config = useAnimationConfig();
  const [pieces, setPieces] = useState([]);

  // Adjust count based on performance mode
  const adjustedCount = config.confettiCount || count;

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }
    const arr = Array.from({ length: adjustedCount }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      left: Math.random() * 100,
      size: 6 + Math.random() * 6,
      bg: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() > 0.5 ? "50%" : "2px",
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 0.4,
    }));
    setPieces(arr);
    const t = setTimeout(() => setPieces([]), duration);
    return () => clearTimeout(t);
  }, [active, duration, adjustedCount]);

  if (!pieces.length) return null;
  return (
    <div 
      aria-hidden 
      className="pointer-events-none"
      style={{ contain: 'strict' }}
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left + "%",
            width: p.size,
            height: p.size,
            background: p.bg,
            borderRadius: p.shape,
            animationDuration: p.duration + "s",
            animationDelay: p.delay + "s",
          }}
        />
      ))}
    </div>
  );
}
