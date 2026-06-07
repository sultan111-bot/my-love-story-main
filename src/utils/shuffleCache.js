/**
 * Shuffle Cache Manager
 * Menyimpan hasil shuffle di sessionStorage agar shuffle hanya terjadi SEKALI per session
 * Tidak akan shuffle ulang kecuali cache dihapus atau user clear browser cache
 */

const SHUFFLE_CACHE_KEY = 'photos_shuffle_cache';
const CACHE_VERSION = 'v1';

/**
 * Generate hash dari array foto untuk verifikasi integritas cache
 * @param {Array} photos - Array foto
 * @returns {string} Hash
 */
function generatePhotosHash(photos) {
  if (!photos || photos.length === 0) return '';
  // Simple hash dari total foto + id pertama dan terakhir
  const data = `${photos.length}_${photos[0].id}_${photos[photos.length - 1].id}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get cached shuffled photos atau generate baru
 * @param {Array} photos - Original photos array
 * @param {Function} shuffleFunction - Function untuk shuffle
 * @returns {Array} Shuffled photos
 */
export function getOrCreateShuffleCache(photos, shuffleFunction) {
  if (!photos || photos.length === 0) return [];

  const currentHash = generatePhotosHash(photos);
  
  try {
    const cached = sessionStorage.getItem(SHUFFLE_CACHE_KEY);
    
    if (cached) {
      const { version, hash, shuffled, timestamp } = JSON.parse(cached);
      
      // Validasi cache
      if (version === CACHE_VERSION && hash === currentHash && shuffled) {
        console.log('✅ [SHUFFLE CACHE] Using cached shuffle from', new Date(timestamp).toLocaleTimeString());
        return shuffled;
      }
    }
  } catch (e) {
    console.warn('⚠️ [SHUFFLE CACHE] Error reading cache:', e);
  }

  // Cache miss atau invalid - shuffle baru
  console.log('🔄 [SHUFFLE CACHE] Creating new shuffle (cache miss or invalid)');
  const shuffled = shuffleFunction(photos);
  
  // Simpan ke cache
  try {
    const cacheData = {
      version: CACHE_VERSION,
      hash: currentHash,
      shuffled,
      timestamp: new Date().toISOString(),
    };
    sessionStorage.setItem(SHUFFLE_CACHE_KEY, JSON.stringify(cacheData));
    console.log('💾 [SHUFFLE CACHE] Saved to sessionStorage');
  } catch (e) {
    console.warn('⚠️ [SHUFFLE CACHE] Error saving cache:', e);
  }

  return shuffled;
}

/**
 * Clear shuffle cache (untuk testing atau force refresh)
 */
export function clearShuffleCache() {
  try {
    sessionStorage.removeItem(SHUFFLE_CACHE_KEY);
    console.log('🧹 [SHUFFLE CACHE] Cache cleared');
  } catch (e) {
    console.warn('⚠️ [SHUFFLE CACHE] Error clearing cache:', e);
  }
}

/**
 * Get cache info untuk debugging
 */
export function getShuffleCacheInfo() {
  try {
    const cached = sessionStorage.getItem(SHUFFLE_CACHE_KEY);
    if (cached) {
      const { version, hash, timestamp, shuffled } = JSON.parse(cached);
      return {
        cached: true,
        version,
        hash,
        timestamp,
        count: shuffled?.length || 0,
      };
    }
    return { cached: false };
  } catch (e) {
    return { cached: false, error: e.message };
  }
}
