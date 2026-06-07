import { useCallback, useRef } from "react";

export function useHoldPress({ duration = 300, onHold, onTap, onProgress } = {}) {
  const timerRef = useRef(null);
  const startRef = useRef(0);
  const triggeredRef = useRef(false);
  const rafRef = useRef(null);

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    timerRef.current = null;
    rafRef.current = null;
  }, []);

  const onPointerDown = useCallback(
    (e) => {
      triggeredRef.current = false;
      startRef.current = performance.now();
      clear();
      timerRef.current = setTimeout(() => {
        triggeredRef.current = true;
        onHold?.(e);
      }, duration);
      if (onProgress) {
        const tick = () => {
          const p = Math.min(1, (performance.now() - startRef.current) / duration);
          onProgress(p);
          if (p < 1 && timerRef.current) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    [duration, onHold, onProgress, clear]
  );

  const onPointerUp = useCallback(
    (e) => {
      const elapsed = performance.now() - startRef.current;
      clear();
      if (!triggeredRef.current && elapsed < duration) {
        onTap?.(e);
      }
      if (onProgress) onProgress(0);
    },
    [duration, onTap, clear, onProgress]
  );

  const onPointerCancel = useCallback(() => {
    clear();
    if (onProgress) onProgress(0);
  }, [clear, onProgress]);

  return {
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onPointerLeave: onPointerCancel,
  };
}
