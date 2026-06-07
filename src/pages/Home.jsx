import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ColorSwitcher from "../components/ColorSwitcher.jsx";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll.js";
import { useHoldPress } from "../hooks/useHoldPress.js";
import OurStoryModal from "../modals/OurStoryModal.jsx";
import { useSound } from "../hooks/useSound.js";
import { useVibration } from "../hooks/useVibration.js";

const PHOTO_URLS = [
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707775/IMG-20260207-WA0372_pdrhtu.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707778/IMG-20260211-WA0254_lwxzci.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707778/IMG_20250425_140021_zwghj7.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707778/IMG_20260214_194524_s4nvgr.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707778/IMG-20260213-WA0589_i0fbg9.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707780/IMG-20260214-WA0061_lx1baz.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707780/IMG-20260213-WA0584_qzw8bj.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707780/IMG-20260213-WA0771_nhdvqq.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707780/IMG-20260213-WA0705_gnttwn.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707781/IMG-20260214-WA0057_tnwnfs.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707782/IMG-20260214-WA0083_pxwh1f.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707782/WhatsApp_Image_2026-04-21_at_00.48.52_ixcews.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707782/WhatsApp_Image_2026-04-21_at_00.49.29_1_ixmu8t.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707784/WhatsApp_Image_2026-04-21_at_00.49.30_1_je3ixl.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707784/WhatsApp_Image_2026-04-21_at_00.49.29_mkiwko.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707785/IMG-20260221-WA0144_joqbgt.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707785/WhatsApp_Image_2026-04-21_at_00.49.30_qx1b6u.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707785/WhatsApp_Image_2026-04-21_at_00.49.36_yydqsl.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707786/WhatsApp_Image_2026-04-21_at_00.49.37_1_ujos1y.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707787/WhatsApp_Image_2026-04-21_at_00.49.37_decz99.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707788/WhatsApp_Image_2026-04-21_at_00.49.39_zld4fb.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707788/WhatsApp_Image_2026-04-21_at_00.49.40_1_fxcwsb.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707789/WhatsApp_Image_2026-04-21_at_00.49.40_pkexdn.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707790/WhatsApp_Image_2026-04-21_at_00.49.41_1_jvdsh0.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707791/WhatsApp_Image_2026-04-21_at_00.49.41_es7sam.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707792/WhatsApp_Image_2026-04-21_at_00.49.42_1_fzwymt.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707792/WhatsApp_Image_2026-04-21_at_00.49.42_tuh6az.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707793/WhatsApp_Image_2026-04-21_at_00.49.44_qogezv.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707793/WhatsApp_Image_2026-04-21_at_00.49.45_1_ja0cwn.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707794/WhatsApp_Image_2026-04-21_at_00.49.45_v3rog1.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707795/WhatsApp_Image_2026-04-21_at_00.49.46_sidega.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707796/WhatsApp_Image_2026-04-21_at_00.49.50_rkg4c6.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707796/WhatsApp_Image_2026-04-21_at_00.49.53_1_t9abmh.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707797/WhatsApp_Image_2026-04-21_at_00.49.53_hn0lyb.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707798/WhatsApp_Image_2026-04-21_at_00.49.54_n8p9vc.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707799/WhatsApp_Image_2026-04-21_at_00.49.57_pbcwuv.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707799/WhatsApp_Image_2026-04-21_at_00.49.58_1_tdjn3e.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707800/WhatsApp_Image_2026-04-21_at_00.49.58_quaeby.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707801/WhatsApp_Image_2026-04-21_at_00.49.59_lzbglm.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707802/WhatsApp_Image_2026-04-21_at_00.50.04_1_tiin2g.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707802/WhatsApp_Image_2026-04-21_at_00.50.04_qjypew.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707803/WhatsApp_Image_2026-04-21_at_00.50.05_iczvee.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707804/WhatsApp_Image_2026-04-21_at_00.50.06_uy533h.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707805/WhatsApp_Image_2026-04-21_at_00.50.09_z8jdni.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707805/WhatsApp_Image_2026-04-21_at_00.50.10_koyadt.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707806/WhatsApp_Image_2026-04-21_at_00.50.11_damvhj.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707807/WhatsApp_Image_2026-04-21_at_00.50.13_cay7zf.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707807/WhatsApp_Image_2026-04-21_at_00.50.15_1_e0jazl.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707808/WhatsApp_Image_2026-04-21_at_00.50.15_xlxnat.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707809/WhatsApp_Image_2026-04-21_at_00.50.17_s6vkcn.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707809/WhatsApp_Image_2026-04-21_at_00.50.20_kwesk4.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707810/WhatsApp_Image_2026-04-21_at_00.50.22_p4nhya.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707811/WhatsApp_Image_2026-04-21_at_00.50.23_zznmas.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707811/WhatsApp_Image_2026-04-21_at_00.50.24_ghylfz.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707812/WhatsApp_Image_2026-04-21_at_00.50.26_aqhyum.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707813/WhatsApp_Image_2026-04-21_at_00.50.30_1_okptbf.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707813/WhatsApp_Image_2026-04-21_at_00.50.30_bdad6t.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707814/WhatsApp_Image_2026-04-21_at_00.50.32_vwjmb0.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707815/WhatsApp_Image_2026-04-21_at_00.50.33_pojt0h.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707816/WhatsApp_Image_2026-04-21_at_00.50.36_wkmcdx.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707816/WhatsApp_Image_2026-04-21_at_00.50.40_xys6oa.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707817/WhatsApp_Image_2026-04-21_at_00.50.41_1_ar4zfu.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707818/WhatsApp_Image_2026-04-21_at_00.50.41_c8riey.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707819/WhatsApp_Image_2026-04-21_at_00.50.42_1_bgou3j.jpg",
  "https://res.cloudinary.com/dqp7raczz/image/upload/v1776707819/WhatsApp_Image_2026-04-21_at_00.50.42_xjiv2s.jpg"
];

const HEIGHTS = [140, 180, 220];

function seededRand(seed) {
  // mulberry32
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function buildMedia() {
  const items = [];
  
  // Use only photos for better performance
  const totalPhotos = PHOTO_URLS.length;
  
  // Create shuffled photo indices
  const photoIndices = Array.from({ length: totalPhotos }, (_, i) => i);
  
  // Shuffle array
  for (let i = photoIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [photoIndices[i], photoIndices[j]] = [photoIndices[j], photoIndices[i]];
  }
  
  // Create items with only photos
  for (let i = 0; i < totalPhotos; i++) {
    const photoIdx = photoIndices[i];
    items.push({ 
      id: `p${photoIdx}`, 
      type: "photo", 
      n: photoIdx + 1, 
      src: PHOTO_URLS[photoIdx], 
      h: HEIGHTS[items.length % 3] 
    });
  }
  
  return items;
}

function MediaCard({ item, index, onExpand }) {
  const rot = (seededRand(index) * 8 - 4).toFixed(2);
  const tx = (seededRand(index + 99) * 12 - 6).toFixed(1);
  const isPlaceholder = !item.src || item.src.startsWith("[");
  const [imgError, setImgError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const { playPop } = useSound();
  const { vibratePop } = useVibration();

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlers = useHoldPress({
    duration: 300,
    onHold: () => {
      playPop();
      vibratePop();
      onExpand(item);
    },
  });

  return (
    <div
      ref={cardRef}
      {...handlers}
      className="bg-white relative select-none"
      style={{
        breakInside: "avoid",
        marginBottom: 8,
        padding: "6px 6px 18px 6px",
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        transform: `rotate(${rot}deg) translateX(${tx}px)`,
        opacity: isVisible ? 0.92 : 0,
        transition: "all 0.3s ease",
      }}
    >
      <div
        className="rounded flex items-center justify-center text-xs font-semibold relative overflow-hidden"
        style={{
          minHeight: 120,
          maxHeight: item.h,
          background: "#E0E0E0",
          color: "#666",
        }}
      >
        {isPlaceholder ? (
          <span>📷 {item.n}</span>
        ) : !isVisible ? (
          <span>Loading...</span>
        ) : imgError ? (
          <span>📷 Foto {item.n} (Error)</span>
        ) : (
          <img 
            src={item.src} 
            alt={`Foto ${item.n}`} 
            draggable={false} 
            loading="lazy"
            className="max-w-full max-h-full object-contain rounded"
            style={{
              width: "auto",
              height: "auto"
            }}
            onError={() => setImgError(true)}
          />
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [expanded, setExpanded] = useState(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const scrollRef = useRef(null);
  const [mediaLimit, setMediaLimit] = useState(30);
  const { playSuccess } = useSound();
  const { vibrateSuccess } = useVibration();

  // Detect performance mode to adjust media count
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;

    if (prefersReducedMotion || (isMobile && isLowEndDevice) || (isMobile && isLowMemory)) {
      setMediaLimit(15); // Reduce to 15 on low-end devices
    } else if (isMobile || isLowEndDevice || isLowMemory) {
      setMediaLimit(20); // Reduce to 20 on medium devices
    }
  }, []);

  const baseMedia = useMemo(() => buildMedia(), []);
  // Reduce media count for better performance
  const extendedMedia = useMemo(() => {
    // Take only limited items for better performance
    const limited = baseMedia.slice(0, mediaLimit);
    // Create shuffled versions without too many duplicates
    const shuffled = [...limited].sort(() => Math.random() - 0.5);
    const shuffled2 = [...limited].sort(() => Math.random() - 0.5);
    return [...shuffled, ...shuffled2];
  }, [baseMedia, mediaLimit]);

  useInfiniteScroll(scrollRef, { speed: 2.0, interval: 30 });

  // Initialize scroll to middle so we can scroll up too
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight / 3;
  }, []);

  const handleStoryClick = () => {
    playSuccess();
    vibrateSuccess();
    setStoryOpen(true);
  };

  return (
    <div className="relative flex flex-col home-container">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0">
        <span className="text-[12px] lg:text-sm text-gray-500">Happy Birthday 🎀</span>
        <ColorSwitcher />
      </div>

      <div
        ref={scrollRef}
        className="overflow-y-auto no-scrollbar px-2 flex-1"
      >
        {/* Mobile: 3 columns, Tablet: 4 columns, Desktop: 5-6 columns */}
        <div className="mobile-columns">
          {extendedMedia.map((item, idx) => (
            <MediaCard key={`${item.id}-${idx}`} item={item} index={idx} onExpand={setExpanded} />
          ))}
        </div>
      </div>

      {/* Our Story floating */}
     {/* Our Story floating */}
<button
  onClick={handleStoryClick}
  className="fixed left-4 z-30 bg-white rounded-full px-4 py-2 text-sm shadow-lg flex items-center gap-1"
  style={{
    bottom: "calc(100px + env(safe-area-inset-bottom) + 8px)",
  }}
>
  📖 Our Story
</button>

      {/* Expanded media overlay */}
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
              className="relative bg-white inline-block"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setExpanded(null)}
                className="absolute -top-3 -right-3 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 z-10"
                aria-label="Close"
              >
                ✕
              </button>
              <div className="rounded flex items-center justify-center p-2"
                   style={{ 
                     maxWidth: "88vw", 
                     maxHeight: "80vh",
                     overflow: "hidden"
                   }}>
                {!expanded.src || expanded.src.startsWith("[") ? (
                  <div
                    className="flex items-center justify-center text-base font-semibold"
                    style={{
                      width: "300px",
                      height: "200px",
                      background: "#E0E0E0",
                      color: "#666",
                      borderRadius: 8,
                    }}
                  >
                    📷 Foto {expanded.n}
                  </div>
                ) : (
                  <img 
                    src={expanded.src} 
                    alt="" 
                    className="max-w-full max-h-[70vh] object-contain rounded"
                    style={{
                      width: "auto",
                      height: "auto"
                    }}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {storyOpen && <OurStoryModal onClose={() => setStoryOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
