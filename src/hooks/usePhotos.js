import { useState, useEffect } from 'react';
import photosData from '../data/photos.json';

/**
 * Hook untuk load dan cache photo data
 */
export function usePhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (photosData && photosData.photos) {
        setPhotos(photosData.photos);
        console.log(`✅ Loaded ${photosData.photos.length} photos from manifest`);
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
  }, []);

  return { photos, loading, error };
}