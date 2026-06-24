import { memo, useCallback, useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ColorSwitcher from "../components/ColorSwitcher.jsx";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll.js";
import { useHoldPress } from "../hooks/useHoldPress.js";
import OurStoryModal from "../modals/OurStoryModal.jsx";
import { useSound } from "../hooks/useSound.js";
import { useVibration } from "../hooks/useVibration.js";
import OptimizedImage from "../components/OptimizedImage.jsx";
import { usePhotos } from "../hooks/usePhotos.js";

function seededRand(seed) {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Prepare media items dari photos data
 * - Shuffle di usePhotos hook
 * - Di sini hanya prepare layout properties
 */
function prepareMediaItems(photosData) {
  if (!photosData || photosData.length === 0) {
    console.log('❌ prepareMediaItems: No photos data');
    return [];
  }

  console.log('\n========== PREPARE MEDIA ITEMS START =========');
  console.log('📊 Total photos:', photosData.length);

  // Map dengan layout properties
  const MEDIA_ITEMS = photosData.map((photo, i) => {
    // Hitung height berdasarkan aspect ratio dengan max 220px
    const aspectRatio = photo.dimensions.width / photo.dimensions.height;
    let calculatedHeight = 160; // Default height
    
    // Adjust height based on aspect ratio untuk balanced masonry
    if (aspectRatio > 1.2) {
      // Landscape: smaller height
      calculatedHeight = Math.min(140, 160);
    } else if (aspectRatio < 0.8) {
      // Portrait: medium height
      calculatedHeight = Math.min(190, 220);
    } else {
      // Square/balanced: medium height
      calculatedHeight = Math.min(160, 200);
    }

    return {
      ...photo,
      h: calculatedHeight,
      aspectRatio: aspectRatio,
      layoutIndex: i,
      rot: (seededRand(i) * 6 - 3).toFixed(2), // Reduced rotation untuk cleaner look
      tx: (seededRand(i + 99) * 8 - 4).toFixed(1), // Reduced translation
    };
  });

  console.log('✅ MEDIA_ITEMS created:', MEDIA_ITEMS.length);

  // CREATE 3x DUPLICATES untuk infinite scroll seamless
  const EXTENDED = Array.from({ length: 3 }, (_, copy) =>
    MEDIA_ITEMS.map((item, i) => {
      const layoutIndex = copy * MEDIA_ITEMS.length + i;
      return {
        ...item,
        id: `${item.id}-c${copy}`,
        layoutIndex,
        rot: (seededRand(layoutIndex) * 6 - 3).toFixed(2),
        tx: (seededRand(layoutIndex + 99) * 8 - 4).toFixed(1),
      };
    })
  ).flat();

  console.log('✅ EXTENDED created:', EXTENDED.length);
  console.log('========== PREPARE MEDIA ITEMS COMPLETE =========\n');

  return EXTENDED;
}

/**
 * Media Card Component
 */
const MediaCard = memo(function MediaCard({ item, onHold, priority = false }) {
  const handlers = useHoldPress({
    duration: 300,
    onHold: () => onHold(item),
  });

  return (
    <div
      {...handlers}
      className="media-card bg-white relative select-none cursor-pointer rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      style={{
        breakInside: "avoid",
        marginBottom: 8,
        padding: "6px 6px 18px 6px",
        transform: `rotate(${item.rot}deg) translateX(${item.tx}px)`,
        contentVisibility: 'auto',
        containIntrinsicSize: `auto ${item.h + 24}px`,
      }}
    >
      {/* Image container dengan fixed height untuk consistency */}
      <div
        className="rounded overflow-hidden bg-gray-100"
        style={{
          height: item.h,
          width: '100%',
          contain: 'layout style paint',
        }}
      >
        <OptimizedImage 
          photo={item}
          alt={`Foto ${item.originalId || item.id}`}
          priority={priority}
        />
      </div>
    </div>
  );
});

/**
 * HOME PAGE COMPONENT
 */
export default function Home() {
  // Load photos (SHUFFLE sudah terjadi di usePhotos)
  const { photos, loading, error } = usePhotos();
  
  // STATE: extended items (dengan layout properties)
  const [extendedItems, setExtendedItems] = useState([]);
  const [isReadyForScroll, setIsReadyForScroll] = useState(false);

  // EFFECT: Prepare media items ketika photos loaded
  useEffect(() => {
    if (photos && photos.length > 0) {
      console.log('🎯 Home.jsx useEffect: Photos loaded, preparing media items...');
      const prepared = prepareMediaItems(photos);
      setExtendedItems(prepared);
      // Delay scroll start agar DOM sudah ready
      setTimeout(() => {
        setIsReadyForScroll(true);
      }, 50);
    }
  }, [photos]);

  // Component states
  const [expanded, setExpanded] = useState(null);
  const [storyOpen, setStoryOpen] = useState(false);
  
  // Refs
  const scrollRef = useRef(null);
  
  // Hooks
  const { playSuccess, playPop } = useSound();
  const { vibrateSuccess, vibratePop } = useVibration();

  // INFINITE SCROLL - start only when ready
  useInfiniteScroll(scrollRef, { 
    speed: 35, 
    resumeDelay: 3000, 
    enabled: isReadyForScroll && extendedItems.length > 0
  });

  // ===== HANDLERS =====
  const handleExpand = useCallback((item) => {
    playPop();
    vibratePop();
    setExpanded(item);
  }, [playPop, vibratePop]);

  const handleStoryClick = () => {
    playSuccess();
    vibrateSuccess();
    setStoryOpen(true);
  };

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="relative flex flex-col home-container items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-rose-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading photos...</p>
        </div>
      </div>
    );
  }

  // ===== ERROR STATE =====
  if (error || extendedItems.length === 0) {
    return (
      <div className="relative flex flex-col home-container items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">❌ Error loading photos</p>
          <p className="text-gray-500 text-sm">{error || 'No photos available'}</p>
          <p className="text-gray-400 text-xs mt-4">Please run: npm run optimize-images</p>
        </div>
      </div>
    );
  }

  // ===== RENDER =====
  return (
    <div className="relative flex flex-col home-container">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0">
        <span className="text-responsive-sm text-gray-500">Happy Birthday 🎀</span>
        <ColorSwitcher />
      </div>

      {/* PHOTOS SCROLL CONTAINER */}
      <div
        ref={scrollRef}
        className="overflow-y-auto no-scrollbar px-2 flex-1"
        style={{ 
          WebkitOverflowScrolling: "touch", 
          overflowAnchor: "none",
          contain: 'layout style paint',
        }}
      >
        <div className="mobile-columns">
          {extendedItems.map((item, idx) => (
            <MediaCard 
              key={item.id} 
              item={item} 
              onHold={handleExpand}
              priority={idx < 9}
            />
          ))}
        </div>
      </div>

      {/* OUR STORY BUTTON */}
      <button
        onClick={handleStoryClick}
        className="our-story-btn"
      >
        📖 Our Story
      </button>

      {/* EXPANDED IMAGE MODAL */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-[99999999] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
            onClick={() => setExpanded(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative bg-white inline-block rounded-xl overflow-hidden max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setExpanded(null)}
                className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-700 z-20 hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>

              {/* IMAGE CONTAINER */}
              <div 
                className="flex items-center justify-center p-3"
                style={{
                  maxWidth: "95vw",
                  maxHeight: "85vh",
                  overflow: "hidden"
                }}
              >
                <OptimizedImage 
                  photo={expanded}
                  alt={`Foto ${expanded.id}`}
                  priority={true}
                  contain={true}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STORY MODAL */}
      <AnimatePresence>
        {storyOpen && <OurStoryModal onClose={() => setStoryOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
