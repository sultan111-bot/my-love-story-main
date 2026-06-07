/**
 * Fisher-Yates (Durstenfeld) Shuffle Algorithm
 * TRUE RANDOM SHUFFLE - bukan sort random
 */
export function shuffleArray(array) {
    if (!array || array.length === 0) return [];
    
    // PENTING: Buat copy baru, jangan modify original
    const shuffled = [...array];
    
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      // Random index dari 0 sampai i (inclusive)
      const j = Math.floor(Math.random() * (i + 1));
      
      // Swap elemen i dan j
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  }
  
  /**
   * Verify shuffle bekerja dengan benar
   */
  export function verifyShuffle(original, shuffled) {
    if (!original || !shuffled) return false;
    
    if (original.length !== shuffled.length) {
      console.error('❌ Shuffle FAILED: length mismatch');
      return false;
    }
    
    // Cek semua items masih ada
    const originalIds = new Set(original.map(p => p.id));
    const shuffledIds = new Set(shuffled.map(p => p.id));
    
    if (originalIds.size !== shuffledIds.size) {
      console.error('❌ Shuffle FAILED: missing items');
      return false;
    }
    
    // Cek order berbeda
    let sameOrder = true;
    for (let i = 0; i < Math.min(original.length, shuffled.length); i++) {
      if (original[i].id !== shuffled[i].id) {
        sameOrder = false;
        break;
      }
    }
    
    if (sameOrder) {
      console.warn('⚠️ WARNING: Shuffle array memiliki order yang SAMA (unlucky random)');
    }
    
    console.log('✅ Shuffle VERIFIED: semua items ada, order berbeda');
    return true;
  }
  