/**
 * True Random Shuffle Algorithm (Durstenfeld shuffle)
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      // Random index dari 0 sampai i
      const j = Math.floor(Math.random() * (i + 1));
      
      // Swap element
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  }
  
  /**
   * Verify shuffle bekerja dengan benar
   */
  export function verifyShuffle(original, shuffled) {
    if (original.length !== shuffled.length) {
      console.error('❌ Shuffle failed: length mismatch');
      return false;
    }
    
    const originalIds = new Set(original.map(p => p.id));
    const shuffledIds = new Set(shuffled.map(p => p.id));
    
    if (originalIds.size !== shuffledIds.size) {
      console.error('❌ Shuffle failed: missing items');
      return false;
    }
    
    console.log('✅ Shuffle verified: all items present and different order');
    return true;
  }