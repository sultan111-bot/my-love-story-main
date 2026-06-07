import { useEffect, useState } from "react";

/**
 * Hook untuk mendeteksi kapabilitas device dan menentukan mode performa
 * Returns: 'high' | 'medium' | 'low'
 */
export function usePerformanceMode() {
  const [mode, setMode] = useState('high');

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setMode('low');
      return;
    }

    // Detect device capabilities
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;

    // Set initial mode based on device
    if (isMobile || isLowEndDevice || isLowMemory) {
      setMode('medium');
    }

    if ((isMobile && isLowEndDevice) || (isMobile && isLowMemory)) {
      setMode('low');
    }

    // Fallback: check for laggy animations by measuring FPS
    let frameCount = 0;
    let lastTime = performance.now();
    let checkFrames = 0;
    const maxChecks = 60; // Check for 60 frames (approx 1 second)

    const checkPerformance = () => {
      const now = performance.now();
      frameCount++;
      checkFrames++;

      if (checkFrames >= maxChecks) {
        const fps = frameCount / ((now - lastTime) / 1000);
        
        // Adjust mode based on actual performance
        if (fps < 20) {
          setMode('low');
        } else if (fps < 30 && mode === 'high') {
          setMode('medium');
        }
        
        // Reset counters
        frameCount = 0;
        lastTime = now;
        checkFrames = 0;
      }
      
      requestAnimationFrame(checkPerformance);
    };

    const rafId = requestAnimationFrame(checkPerformance);
    return () => cancelAnimationFrame(rafId);
  }, [mode]);

  return mode;
}

/**
 * Hook untuk mendapatkan konfigurasi animasi berdasarkan mode performa
 */
export function useAnimationConfig() {
  const mode = usePerformanceMode();

  const config = {
    high: {
      petalCount: 18,
      confettiCount: 50,
      sparkleCount: 5,
      enableBackgroundCircles: true,
      enableFloatingPetals: true,
      animationDuration: 'normal',
    },
    medium: {
      petalCount: 8,
      confettiCount: 25,
      sparkleCount: 3,
      enableBackgroundCircles: true,
      enableFloatingPetals: true,
      animationDuration: 'reduced',
    },
    low: {
      petalCount: 4,
      confettiCount: 15,
      sparkleCount: 1,
      enableBackgroundCircles: false,
      enableFloatingPetals: false,
      animationDuration: 'minimal',
    },
  };

  return config[mode];
}
