import { memo, useCallback, useRef, useState, useEffect } from "react";
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
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function thumbUrl(url) {
  return url.replace("/upload/", "/upload/w_320,q_auto,f_auto/");
}

const SHUFFLED_PHOTOS = [...PHOTO_URLS]
  .sort(() => Math.random() - 0.5)
  .slice(0, 30);

const MEDIA_ITEMS = SHUFFLED_PHOTOS.map((src, i) => ({
  id: `p${i}`,
  type: "photo",
  src,
  thumb: thumbUrl(src),
  n: i + 1,
  h: HEIGHTS[i % 3],
}));

// 3x duplicate for seamless infinite scroll (90 cards, not 120+)
const EXTENDED_MEDIA_ITEMS = Array.from({ length: 3 }, (_, copy) =>
  MEDIA_ITEMS.map((item, i) => {
    const layoutIndex = copy * MEDIA_ITEMS.length + i;
    return {
      ...item,
      id: `${item.id}-c${copy}`,
      layoutIndex,
      rot: (seededRand(layoutIndex) * 8 - 4).toFixed(2),
      tx: (seededRand(layoutIndex + 99) * 12 - 6).toFixed(1),
    };
  })
).flat();

const MediaCard = memo(function MediaCard({ item, onHold }) {
  const handlers = useHoldPress({
    duration: 300,
    onHold: () => onHold(item),
  });

  return (
    <div
      {...handlers}
      className="media-card bg-white relative select-none"
      style={{
        breakInside: "avoid",
        marginBottom: 8,
        padding: "6px 6px 18px 6px",
        borderRadius: 10,
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        transform: `rotate(${item.rot}deg) translateX(${item.tx}px)`,
      }}
    >
      <div
        className="rounded overflow-hidden"
        style={{ height: item.h, background: "#E0E0E0" }}
      >
        <img
          src={item.thumb}
          alt={`Foto ${item.n}`}
          draggable={false}
          loading="lazy"
          decoding="async"
          width={320}
          height={item.h}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    </div>
  );
});

export default function Home() {
  const [expanded, setExpanded] = useState(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
  const scrollRef = useRef(null);
  const { playSuccess, playPop } = useSound();
  const { vibrateSuccess, vibratePop } = useVibration();

  // Aktifkan auto scroll setelah 2.5 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoScrollEnabled(true);
    }, 2500); // Delay 2.5 detik

    return () => clearTimeout(timer);
  }, []);

  // Gunakan hook dengan parameter enabled
  useInfiniteScroll(scrollRef, { speed: 35, enabled: autoScrollEnabled });

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
  style={{ WebkitOverflowScrolling: "touch", overflowAnchor: "none" }}
>
  {/* Ganti className dari "mobile-columns" menjadi inline style untuk masonry */}
  <div style={{
    columnCount: 3,
    columnGap: 8,
    '@media (minWidth: 768px)': { columnCount: 4 },
    '@media (minWidth: 1024px)': { columnCount: 5 },
  }}>
    {EXTENDED_MEDIA_ITEMS.map((item) => (
      <MediaCard key={item.id} item={item} onHold={handleExpand} />
    ))}
  </div>
</div>

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