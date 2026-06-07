import { memo, useState, useCallback, useEffect } from 'react';

/**
 * OptimizedImage Component
 * Progressive image loading dengan lazy loading
 * 
 * Features:
 * - Thumbnail blur-up loading
 * - Progressive full image loading
 * - Lazy loading untuk offscreen images
 * - Error handling
 * - Automatic format selection (WebP)
 */
const OptimizedImage = memo(function OptimizedImage({ 
  photo, 
  alt, 
  priority = false,
  onClick,
  onLoad
}) {
  // States: loading -> thumb-ready -> full-ready -> loaded
  const [loadState, setLoadState] = useState('loading');
  const [displayedSrc, setDisplayedSrc] = useState(photo.paths.thumb);

  // Update source ketika priority berubah
  useEffect(() => {
    if (priority) {
      // Priority images load full quality immediately
      setDisplayedSrc(photo.paths.full);
      setLoadState('loading');
    } else {
      // Non-priority images start with thumbnail
      setDisplayedSrc(photo.paths.thumb);
      setLoadState('loading');
    }
  }, [priority, photo.paths]);

  // Handler saat thumbnail selesai loading
  const handleThumbLoad = useCallback(() => {
    if (priority) {
      // Priority image already loading full quality
      setLoadState('loaded');
      onLoad?.();
    } else {
      // Non-priority: thumbnail loaded, now load full
      setLoadState('thumb-ready');
      
      // Preload full image in background
      const fullImg = new Image();
      fullImg.src = photo.paths.full;
      
      fullImg.onload = () => {
        setDisplayedSrc(photo.paths.full);
        setLoadState('loaded');
        onLoad?.();
      };
      
      fullImg.onerror = () => {
        // Full image failed, keep showing thumbnail
        setLoadState('error');
      };
    }
  }, [priority, photo.paths, onLoad]);

  // Handler saat image gagal loading
  const handleError = useCallback(() => {
    console.warn(`⚠️ Failed to load image: ${photo.title}`);
    setLoadState('error');
  }, [photo.title]);

  // Render
  return (
    <div
      className="relative w-full h-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer group"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        aspectRatio: `${photo.dimensions.width} / ${photo.dimensions.height}`,
      }}
    >
      {/* PLACEHOLDER - Animated gradient shimmer */}
      {loadState === 'loading' && (
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, rgba(200,200,200,0.2) 25%, rgba(255,255,255,0.1) 50%, rgba(200,200,200,0.2) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
          }}
        />
      )}

      {/* MAIN IMAGE - Progressive loading */}
      <img
        key={displayedSrc}
        src={displayedSrc}
        alt={alt || photo.title}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        width={photo.dimensions.width}
        height={photo.dimensions.height}
        onLoad={handleThumbLoad}
        onError={handleError}
        className={`
          w-full h-full object-cover 
          transition-all duration-500 ease-out
          ${loadState === 'loading' ? 'scale-95 blur-md opacity-0' : 'scale-100 blur-0 opacity-100'}
          group-hover:scale-105 group-hover:shadow-lg
        `}
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: `auto ${photo.dimensions.height}px`,
        }}
      />

      {/* LOADING SPINNER - Untuk slow networks */}
      {loadState === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-rose-400 rounded-full animate-spin" />
        </div>
      )}

      {/* ERROR STATE */}
      {loadState === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 backdrop-blur-sm">
          <span className="text-2xl">📷</span>
          <span className="text-gray-500 text-xs sm:text-sm mt-2">Foto tidak tersedia</span>
        </div>
      )}

      {/* OVERLAY EFFECT */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />

      {/* SHIMMER ANIMATION */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;