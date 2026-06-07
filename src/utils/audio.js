/**
 * Audio Manager
 * Handle manual play saja (tidak auto play)
 */

class AudioManager {
    constructor() {
      this.audio = null;
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
  
      // Setup audio listeners
      this.setupAudioListeners();
      console.log('✅ Audio manager ready (manual play only)');
    }
  
    setupAudioListeners() {
      if (!this.audio) return;
  
      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.playbackAttempts = 0;
        console.log('🎵 Audio playing');
      });
  
      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        console.log('⏸️ Audio paused');
      });
  
      this.audio.addEventListener('ended', () => {
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
        if (this.isPlaying) {
          console.log('ℹ️ Audio sudah playing');
          return;
        }
  
        if (this.playbackAttempts >= this.maxAttempts) {
          console.warn('⚠️ Max playback attempts reached');
          return;
        }
  
        this.playbackAttempts++;
  
        // Set volume
        this.audio.volume = 0.5;
        
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          console.log('✅ Audio playing successfully');
        }
      } catch (error) {
        console.warn('⚠️ Play failed:', error.message);
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
  
    destroy() {
      if (this.audio) {
        this.audio.pause();
        this.audio.src = '';
      }
      this.isPlaying = false;
      this.playbackAttempts = 0;
    }
  }
  
  export const audioManager = new AudioManager();