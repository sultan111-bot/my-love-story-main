import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const MUSIC_URL = "/bgm.mp3";

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  // Lazy create audio (skip if placeholder)
  useEffect(() => {
    console.log("Music URL:", MUSIC_URL);
    if (!MUSIC_URL || MUSIC_URL.startsWith("[")) {
      console.log("Invalid music URL, skipping");
      setReady(false);
      return;
    }
    const a = new Audio(MUSIC_URL);
    a.loop = true;
    a.muted = true;
    a.volume = 0;
    
    a.addEventListener('error', (e) => {
      console.error("Audio error:", e);
      console.error("Audio error details:", a.error);
    });
    
    a.addEventListener('loadeddata', () => {
      console.log("Audio loaded successfully");
    });
    
    audioRef.current = a;
    setReady(true);
    a.play().then(() => {
      console.log("Audio play started");
      setPlaying(true);
    }).catch((error) => {
      console.error("Audio play failed:", error);
    });
    return () => {
      a.pause();
      audioRef.current = null;
    };
  }, []);

  // Unmute on first user interaction
  useEffect(() => {
    const onInteract = () => {
      if (audioRef.current && muted) {
        audioRef.current.muted = false;
        setMuted(false);
        // gentle ramp
        let v = 0;
        const id = setInterval(() => {
          v += 0.05;
          if (audioRef.current) audioRef.current.volume = Math.min(1, v);
          if (v >= 1) clearInterval(id);
        }, 80);
      }
    };
    window.addEventListener("pointerdown", onInteract, { once: true });
    window.addEventListener("keydown", onInteract, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
    };
  }, [muted]);

  const fadeIn = useCallback((duration = 2000) => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = false;
    setMuted(false);
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      a.volume = t * 0.5; // Max volume 50%
      if (t < 1) requestAnimationFrame(tick);
    };
    a.play().then(() => setPlaying(true)).catch(() => {});
    requestAnimationFrame(tick);
  }, []);

  const toggle = useCallback(() => {
    console.log("Toggle music clicked");
    const a = audioRef.current;
    if (!a) {
      console.log("No audio element, toggling visual state only");
      // Without a real source, just toggle the visual state.
      setPlaying((p) => !p);
      return;
    }
    if (a.paused) {
      console.log("Audio is paused, attempting to play");
      a.muted = false;
      a.volume = 0.5; // Set volume to 50%
      setMuted(false);
      a.play().then(() => {
        console.log("Audio play successful");
        setPlaying(true);
      }).catch((error) => {
        console.error("Audio play failed:", error);
      });
    } else {
      console.log("Audio is playing, pausing");
      a.pause();
      setPlaying(false);
    }
  }, []);

  return (
    <MusicContext.Provider value={{ playing, toggle, fadeIn, ready }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}
