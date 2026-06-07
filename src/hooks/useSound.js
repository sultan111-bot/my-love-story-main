import { useCallback, useRef } from "react";

/**
 * Hook untuk memainkan sound effect menggunakan Web Audio API
 * ✅ IMPROVED: Prevent audio duplication dengan unique audio instances
 */
export function useSound() {
  const audioContextRef = useRef(null);
  const playingAudiosRef = useRef(new Set()); // ✅ Track active audio instances

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // ✅ NEW: Cleanup played audio dari tracking
  const cleanupAudio = useCallback((audio) => {
    setTimeout(() => {
      playingAudiosRef.current.delete(audio);
    }, 500);
  }, []);

  const playClick = useCallback(() => {
    try {
      const ctx = initAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
      
      cleanupAudio(oscillator);
    } catch (error) {
      console.error("Sound play error:", error);
    }
  }, [initAudioContext, cleanupAudio]);

  const playSuccess = useCallback(() => {
    try {
      const ctx = initAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(523, ctx.currentTime);
      oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
      
      cleanupAudio(oscillator);
    } catch (error) {
      console.error("Sound play error:", error);
    }
  }, [initAudioContext, cleanupAudio]);

  const playError = useCallback(() => {
    try {
      const ctx = initAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(400, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
      
      cleanupAudio(oscillator);
    } catch (error) {
      console.error("Sound play error:", error);
    }
  }, [initAudioContext, cleanupAudio]);

  const playPop = useCallback(() => {
    try {
      const ctx = initAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
      
      cleanupAudio(oscillator);
    } catch (error) {
      console.error("Sound play error:", error);
    }
  }, [initAudioContext, cleanupAudio]);

  const playHeartbeat = useCallback(() => {
    try {
      const ctx = initAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(100, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
      
      cleanupAudio(oscillator);
    } catch (error) {
      console.error("Sound play error:", error);
    }
  }, [initAudioContext, cleanupAudio]);

  const playCelebration = useCallback(() => {
    try {
      // ✅ IMPROVED: Prevent duplicate audio creation
      if (playingAudiosRef.current.size > 5) {
        console.warn('⚠️ Too many audio instances, skipping');
        return;
      }

      const audio = new Audio('/yeayy.mp3');
      audio.volume = 0.5;
      
      playingAudiosRef.current.add(audio);

      // ✅ Auto-cleanup after playing
      audio.addEventListener('ended', () => {
        playingAudiosRef.current.delete(audio);
      }, { once: true });

      audio.play().catch(error => {
        console.error("Audio play error:", error);
        playingAudiosRef.current.delete(audio);
      });
    } catch (error) {
      console.error("Sound play error:", error);
    }
  }, []);

  return {
    playClick,
    playSuccess,
    playError,
    playPop,
    playHeartbeat,
    playCelebration,
  };
}