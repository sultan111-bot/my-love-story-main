/**
 * Audio Manager
 * Handle auto-play dengan user interaction
 * ✅ IMPROVED: Prevent audio duplication & better error handling
 */

class AudioManager {
    constructor() {
      this.audio = null;
      this.hasUserInteracted = false;
      this.isPlaying = false;
      this.playbackAttempts = 0;
      this.maxAttempts = 3;
    }
  
    init() {
      this.audio = document.getElementById('bgm');
      
      if (!this.audio) {
        console.warn('⚠️ Audio element not found');
        return;
      }
  
      // Listen untuk user interaction pertama
      this.setupUserInteractionListener();
      
      // Handle audio events
      this.setupAudioListeners();
    }
  
    setupUserInteractionListener() {
      const events = ['click', 'touchstart', 'keydown', 'mousemove'];
      
      const handleInteraction = async () => {
        if (this.hasUserInteracted) return;
        
        this.hasUserInteracted = true;
        console.log('👤 User interacted, attempting autoplay...');
        
        // Try to play audio
        await this.play();
        
        // Remove listeners setelah interact
        events.forEach(event => {
          document.removeEventListener(event, handleInteraction);
        });
      };
  
      // Add listeners
      events.forEach(event => {
        document.addEventListener(event, handleInteraction, { once: true }); // ✅ CHANGED: once: true untuk prevent multiple triggers
      });
    }
  
    setupAudioListeners() {
      if (!this.audio) return;
  
      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.playbackAttempts = 0; // ✅ Reset attempts on success
        console.log('🎵 Audio playing');
      });
  
      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        console.log('⏸️ Audio paused');
      });
  
      this.audio.addEventListener('ended', () => {
        // ✅ Restart dari awal kalau audio selesai
        if (this.audio && this.audio.loop) {
          this.audio.currentTime = 0;
          this.audio.play().catch(err => {
            console.warn('⚠️ Loop replay failed:', err.message);
          });
        }
      });
  
      this.audio.addEventListener('error', (error) => {
        console.error('❌ Audio error:', error);
        this.isPlaying = false;
      });
    }
  
    async play() {
      if (!this.audio) return;
  
      try {
        // ✅ Check if already playing to prevent duplicate play calls
        if (this.isPlaying) {
          console.log('ℹ️ Audio sudah playing');
          return;
        }
  
        // ✅ Prevent multiple simultaneous play attempts
        if (this.playbackAttempts >= this.maxAttempts) {
          console.warn('⚠️ Max playback attempts reached');
          return;
        }
  
        this.playbackAttempts++;
  
        // Set volume
        this.audio.volume = 0.5;
        
        // Attempt to play
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          console.log('✅ Audio auto-playing successfully');
        }
      } catch (error) {
        console.warn('⚠️ Autoplay failed (akan retry on interact):', error.message);
        this.playbackAttempts++;
      }
    }
  
    pause() {
      if (this.audio) {
        this.audio.pause();
        console.log('⏸️ Audio paused');
      }
    }
  
    toggle() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }
  
    setVolume(volume) {
      if (this.audio) {
        this.audio.volume = Math.max(0, Math.min(1, volume));
      }
    }
  
    getVolume() {
      return this.audio ? this.audio.volume : 0;
    }
  
    // ✅ NEW: Cleanup method untuk prevent memory leaks
    destroy() {
      if (this.audio) {
        this.audio.pause();
        this.audio.src = '';
      }
      this.hasUserInteracted = false;
      this.isPlaying = false;
      this.playbackAttempts = 0;
    }
  }
  
  export const audioManager = new AudioManager();