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

const HEIGHTS = [140, 180, 220];

function seededRand(seed) {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Prepare media items dari photos data
 */
function prepareMediaItems(photosData) {
  if (!photosData || photosData.length === 0) return [];

  // Map photos dengan layout properties
  const MEDIA_ITEMS = photosData.map((photo, i) => ({
    ...photo,
    key: `p${photo.id}`,
    h: HEIGHTS[i % 3],
    layoutIndex: i,
    rot: (seededRand(i) * 8 - 4).toFixed(2),
    tx: (seededRand(i + 99) * 12 - 6).toFixed(1),
  }));

  // Create 3x duplicates untuk seamless infinite scroll
  const EXTENDED = Array.from({ length: 3 }, (_, copy) =>
    MEDIA_ITEMS.map((item, i) => {
      const layoutIndex = copy * MEDIA_ITEMS.length + i;
      return {
        ...item,
        id: `${item.key}-c${copy}`,
        layoutIndex,
        rot: (seededRand(layoutIndex) * 8 - 4).toFixed(2),
        tx: (seededRand(layoutIndex + 99) * 12 - 6).toFixed(1),
      };
    })
  ).flat();

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
        containIntrinsicSize: `auto ${item.h + 12}px`,
      }}
    >
      <div
        className="rounded overflow-hidden bg-gray-100"
        style={{ 
          height: item.h,
          contain: 'layout style paint',
        }}
      >
        <OptimizedImage 
          photo={item}
          alt={`Foto ${item.id}`}
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
  // Load photos dari manifest
  const { photos, loading, error } = usePhotos();
  const extendedItems = prepareMediaItems(photos);

  // Component states
  const [expanded, setExpanded] = useState(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  
  // Refs
  const scrollRef = useRef(null);
  
  // Hooks
  const { playSuccess, playPop } = useSound();
  const { vibrateSuccess, vibratePop } = useVibration();

  // ===== START AUTO-SCROLL DENGAN DELAY 2.5 DETIK =====
  useEffect(() => {
    const timer = setTimeout(() => {
      setScrollEnabled(true);
      console.log('✅ Auto-scroll dimulai');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Enable infinite scroll
  useInfiniteScroll(scrollRef, { 
    speed: 35, 
    resumeDelay: 3000, 
    enabled: scrollEnabled && !loading 
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
        <span className="text-[12px] lg:text-sm text-gray-500">Happy Birthday 🎀</span>
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
              priority={idx < 9} // First 9 items prioritized
            />
          ))}
        </div>
      </div>

      {/* OUR STORY BUTTON */}
      <button
        onClick={handleStoryClick}
        className="fixed left-4 z-30 bg-white rounded-full px-4 py-2 text-sm shadow-lg flex items-center gap-1 hover:shadow-xl transition-shadow"
        style={{
          bottom: "calc(100px + env(safe-area-inset-bottom) + 8px)",
        }}
      >
        📖 Our Story
      </button>

      {/* EXPANDED IMAGE MODAL */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
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
              className="relative bg-white inline-block rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setExpanded(null)}
                className="absolute -top-3 -right-3 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 z-10 hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>

              {/* IMAGE CONTAINER */}
              <div 
                className="flex items-center justify-center p-2"
                style={{
                  maxWidth: "88vw",
                  maxHeight: "80vh",
                  overflow: "hidden"
                }}
              >
                <OptimizedImage 
                  photo={expanded}
                  alt={expanded.title}
                  priority={true}
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