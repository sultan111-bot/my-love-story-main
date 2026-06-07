import { useEffect, useRef } from "react";

/**
 * Auto-scroll a container vertically with seamless infinite loop.
 * Pauses on user interaction, resumes after `resumeDelay`.
 * Container's content should be duplicated 3x; we wrap when scrollTop >= content height.
 */
export function useInfiniteScroll(ref, { speed = 1, interval = 60, resumeDelay = 3000 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let paused = false;
    let pauseTimer = null;
    let last = 0;

    const step = (now) => {
      if (!el) return;
      if (!paused && now - last >= interval) {
        last = now;
        const third = el.scrollHeight / 3;
        if (el.scrollTop >= third * 2) {
          el.scrollTop = el.scrollTop - third;
        }
        el.scrollTop += speed;
      }
      raf = requestAnimationFrame(step);
    };

    const onInteract = () => {
      paused = true;
      if (pauseTimer) clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => {
        paused = false;
      }, resumeDelay);
    };

    el.addEventListener("pointerdown", onInteract);
    el.addEventListener("wheel", onInteract, { passive: true });
    el.addEventListener("touchmove", onInteract, { passive: true });

    let raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      if (pauseTimer) clearTimeout(pauseTimer);
      el.removeEventListener("pointerdown", onInteract);
      el.removeEventListener("wheel", onInteract);
      el.removeEventListener("touchmove", onInteract);
    };
  }, [ref, speed, interval, resumeDelay]);
}
