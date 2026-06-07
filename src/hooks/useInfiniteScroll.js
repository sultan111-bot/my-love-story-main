import { useEffect } from "react";

/**
 * Auto-scroll a container vertically with seamless infinite loop.
 * Pauses on user interaction, resumes after `resumeDelay`.
 * Content should be duplicated 3x; wraps when scroll passes 2/3 of scrollHeight.
 * Uses delta-time scrolling (px/sec) for smooth 60fps motion.
 */
export function useInfiniteScroll(ref, { speed = 35, resumeDelay = 3000 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let paused = false;
    let pauseTimer = null;
    let raf = 0;
    let last = 0;
    let segmentHeight = 0;

    const content = el.firstElementChild;

    const measure = () => {
      if (!el.scrollHeight) return;
      segmentHeight = el.scrollHeight / 3;
    };

    measure();
    const ro = content ? new ResizeObserver(measure) : null;
    if (content && ro) ro.observe(content);

    const step = (now) => {
      if (!paused && last && segmentHeight > 0) {
        const dt = Math.min(now - last, 32);
        let next = el.scrollTop + (speed * dt) / 1000;
        if (next >= segmentHeight * 2) {
          next -= segmentHeight;
        }
        el.scrollTop = next;
      }
      last = now;
      raf = requestAnimationFrame(step);
    };

    const onInteract = () => {
      paused = true;
      if (pauseTimer) clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => {
        paused = false;
        last = 0;
      }, resumeDelay);
    };

    el.addEventListener("pointerdown", onInteract);
    el.addEventListener("wheel", onInteract, { passive: true });
    el.addEventListener("touchmove", onInteract, { passive: true });

    requestAnimationFrame(() => {
      measure();
      if (segmentHeight > 0) el.scrollTop = segmentHeight;
    });

    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      if (pauseTimer) clearTimeout(pauseTimer);
      ro?.disconnect();
      el.removeEventListener("pointerdown", onInteract);
      el.removeEventListener("wheel", onInteract);
      el.removeEventListener("touchmove", onInteract);
    };
  }, [ref, speed, resumeDelay]);
}
