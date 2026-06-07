import { useState, useEffect } from 'react';
import photosData from '../data/photos.json';
import { shuffleArray } from '../utils/shuffle.js';

/**
 * Hook untuk load dan shuffle photo data
 * SHUFFLE terjadi di sini, bukan di Home.jsx!
 */
export function usePhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (photosData && photosData.photos) {
        console.log('\n📚 usePhotos: Loading photos from JSON...');
        const originalPhotos = photosData.photos;
        console.log('📊 Original count:', originalPhotos.length);
        
        // ✅ SHUFFLE DI SINI - bukan di Home.jsx!
        console.log('🔀 Starting Fisher-Yates shuffle...');
        const shuffled = shuffleArray(originalPhotos);
        console.log('✅ Shuffle complete!');
        console.log('📋 Shuffled IDs (first 15):', shuffled.slice(0, 15).map(p => p.id).join(', '));
        
        setPhotos(shuffled);
      } else {
        throw new Error('Invalid photos data structure');
      }
    } catch (err) {
      console.error('❌ Error loading photos:', err);
      setError(err.message);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ Empty array is correct here - load once on mount

  return { photos, loading, error };
}
