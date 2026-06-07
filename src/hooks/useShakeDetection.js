import { useEffect, useRef } from "react";

export function useShakeDetection(onShake, { threshold = 15, cooldown = 3000 } = {}) {
  const lastShake = useRef(0);
  const cbRef = useRef(onShake);
  useEffect(() => {
    cbRef.current = onShake;
  }, [onShake]);

  useEffect(() => {
    let active = true;

    const handler = (e) => {
      const acc = e.accelerationIncludingGravity || e.acceleration;
      if (!acc) return;
      const { x = 0, y = 0, z = 0 } = acc;
      const max = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
      if (max > threshold) {
        const now = Date.now();
        if (now - lastShake.current > cooldown) {
          lastShake.current = now;
          if (active) cbRef.current?.();
        }
      }
    };

    const start = () => window.addEventListener("devicemotion", handler);

    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      // iOS — request on first tap
      const req = () => {
        DeviceMotionEvent.requestPermission()
          .then((p) => p === "granted" && start())
          .catch(() => {});
        window.removeEventListener("touchstart", req);
      };
      window.addEventListener("touchstart", req, { once: true });
    } else {
      start();
    }

    return () => {
      active = false;
      window.removeEventListener("devicemotion", handler);
    };
  }, [threshold, cooldown]);
}
