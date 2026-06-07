/**
 * Audio Manager
 * Handle auto-play dengan user interaction
 */

class AudioManager {
    constructor() {
      this.audio = null;
      this.hasUserInteracted = false;
      this.isPlaying = false;
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
        document.addEventListener(event, handleInteraction, { once: false });
      });
    }
  
    setupAudioListeners() {
      if (!this.audio) return;
  
      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        console.log('🎵 Audio playing');
      });
  
      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        console.log('⏸️ Audio paused');
      });
  
      this.audio.addEventListener('error', (error) => {
        console.error('❌ Audio error:', error);
      });
    }
  
    async play() {
      if (!this.audio) return;
  
      try {
        // Set volume
        this.audio.volume = 0.5;
        
        // Attempt to play
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          console.log('✅ Audio auto-playing successfully');
        }
      } catch (error) {
        console.warn('⚠️ Autoplay failed (will retry on interact):', error.message);
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
  }
  
  export const audioManager = new AudioManager();