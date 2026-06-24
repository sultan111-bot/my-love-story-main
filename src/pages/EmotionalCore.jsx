import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import SultanMascot from "../components/SultanMascot.jsx";
import { useSound } from "../hooks/useSound.js";
import { useVibration } from "../hooks/useVibration.js";

const ACCENTS = [
  "#FFB3C1", "#B5EAD7", "#C7CEEA", "#FFDAC1", "#E2C2FF",
  "#FFC8A2", "#A2D5F2", "#FFB7B2", "#B5DEFF", "#E0BBE4",
  "#FFD3B6", "#D4F0F0", "#FCE38A", "#F38181", "#95E1D3",
];

const LOVE_REASONS = [
  "Km baikk bgtt gilssss",
  "Km perhatiann ihh SUKAKKKK",
  "Km LUCUKKK, GEMASHHH, GEMOYY greget sendiri ak",
  "Km ngertiin ak bgtt sihh aseliii no debat no kecot",
  "Km tipe ak bgt coyyy gilakk",
  "Km CANTIK SEKALEHH masyaAllah sukakk betoll",
  "Km unik tw kek peka tapi ga peka, tapi anehnya peka hmzz",
  "Km selalu inget ak??!! GAK EKSPEKK",
  "Humor kita sama sama receh sik hehe...",
  "Km Bisa ak jadiin tempat ceritaa AKJSKSHJAGHASHJKH",
  "Km klo mish mish, ngeluh, marah, dsb YUYUR AK SUKAK BGT",
  "Km menuhin love language ak bgtt coyyy hahayy",
  "Ak klo sama kamu ketawa terus??!! hhhh emang yh jodoh",
  "Km Wangiii BGTTTTTTTTTTTT....",
  "Semuanya tentang km ihh ak sukakkkkk, ga cuma 15 yhh sebenernya ada 923778462374612836712378367356"
];

function EnvelopeCard({ n, accent, top, left, rot, onEnvelopeClick, registerRef, isHighest, highestZIndex }) {
  const [open, setOpen] = useState(false);
  const [z, setZ] = useState(1);
  const { playPop, playCelebration } = useSound();
  const { vibratePop } = useVibration();

  // Register close method with parent
  useEffect(() => {
    if (registerRef) {
      registerRef(n, { close: () => setOpen(false) });
    }
  }, [n, registerRef]);

  // Update z-index when this envelope becomes the highest
  useEffect(() => {
    if (isHighest) {
      setZ(highestZIndex);
    }
  }, [isHighest, highestZIndex]);

  const handleClick = () => {
    playPop();
    vibratePop();
    
    if (open) {
      setOpen(false);
      setZ(1);
    } else {
      setOpen(true);
      // Notify parent to close other envelopes
      if (onEnvelopeClick) onEnvelopeClick(n);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="absolute cursor-pointer"
      style={{
        top: open ? "50%" : `${top}%`,
        left: open ? "50%" : `${left}%`,
        zIndex: z,
        transform: open ? "translate(-50%, -50%)" : `translate(0, 0) rotate(${rot}deg)`,
        width: "clamp(75px, 19vw, 135px)",
        height: "clamp(56px, 14vw, 101px)",
        transition: "all 0.3s ease",
        transformOrigin: "center",
      }}
    >
      <div
        className="relative w-full h-full rounded-lg overflow-hidden"
        style={{
          background: "#FFFAF0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        {/* Flap */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: "55%",
            background: accent,
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            transformOrigin: "top center",
            transform: open ? "rotateX(-180deg)" : "rotateX(0deg)",
            transition: "transform 0.6s ease",
          }}
        />

        {/* Wax seal */}
        {!open && (
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-white font-bold"
            style={{ 
              background: "#C2185B", 
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              width: "clamp(28px, 6vw, 36px)",
              height: "clamp(28px, 6vw, 36px)",
              fontSize: "clamp(10px, 2.5vw, 14px)"
            }}
          >
            {n}
          </div>
        )}
      </div>

      {/* Letter that appears when opened */}
      {open && (
        <div
          className="absolute rounded-lg p-4 text-center flex flex-col items-center justify-center"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "clamp(200px, 70vw, 300px)",
            height: "clamp(140px, 50vw, 220px)",
            background: "#FFFAF0",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            opacity: 0,
            transition: "opacity 0.5s ease 0.3s",
          }}
          ref={(el) => {
            if (el && open) {
              setTimeout(() => {
                el.style.opacity = 1;
              }, 75);
            }
          }}
        >
          <div className="text-gray-500 mb-2" style={{ fontSize: "clamp(10px, 2.5vw, 14px)" }}>Alasan ke-{n} 💌</div>
          <div className="text-gray-700 leading-tight" style={{ fontSize: "clamp(11px, 2.8vw, 16px)" }}>
            {LOVE_REASONS[n - 1] || `Alasan ke-${n} 💌`}
          </div>
        </div>
      )}
    </div>
  );
}

function VirtualHug() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const [shortPress, setShortPress] = useState(false);
  const startRef = useRef(0);
  const rafRef = useRef(null);
  const timerRef = useRef(null);
  const { playHeartbeat, playCelebration } = useSound();
  const { vibrateHeartbeat } = useVibration();

  const start = () => {
    setShortPress(false);
    startRef.current = performance.now();
    const tick = () => {
      const p = Math.min(1, (performance.now() - startRef.current) / 2000);
      setProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    timerRef.current = setTimeout(() => {
      trigger();
    }, 2000);
  };
  const cancel = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      const elapsed = performance.now() - startRef.current;
      if (elapsed < 2000 && !active) {
        setShortPress(true);
        setTimeout(() => setShortPress(false), 2500);
      }
    }
    setProgress(0);
  };

  const trigger = () => {
    setActive(true);
    setProgress(0);
    playHeartbeat();
    vibrateHeartbeat();
    playCelebration();
    setTimeout(() => setActive(false), 5000);
  };

  return (
    <div className="text-center mt-2 pb-1">
      <div className="border-t border-pink-200 pt-2">
        <div className="text-gray-600 mb-2" style={{ fontSize: "clamp(12px, 2.5vw, 16px)" }}>
          Udh baca semuanya kahh?? Coba tekenn tombol dibawah hehee
        </div>
        <div className="relative inline-block">
          <button
            onPointerDown={start}
            onPointerUp={cancel}
            onPointerLeave={cancel}
            onPointerCancel={cancel}
            className="relative rounded-full text-white font-bold shadow-xl overflow-hidden select-none user-select-none btn-responsive"
            style={{
              background: "linear-gradient(135deg, #FF6B9D, #C2185B, #8E1538)",
              backgroundSize: "200% 200%",
              transform: shortPress ? "scale(0.95)" : "scale(1)",
              transition: "all 0.3s ease",
              boxShadow: shortPress ? "0 4px 15px rgba(194, 24, 91, 0.4)" : "0 6px 20px rgba(194, 24, 91, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundPosition = "right center";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundPosition = "left center";
              e.target.style.transform = "scale(1)";
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="animate-pulse">💕</span>
              Hug For uuuu
              <span className="animate-pulse">💕</span>
            </span>
            {progress > 0 && (
              <span
                className="absolute inset-0 bg-white/30"
                style={{ width: `${progress * 100}%` }}
              />
            )}
          </button>
        </div>
              </div>

{active && (
  <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
    <div className="absolute inset-0 bg-pink-50/80 backdrop-blur-sm" />
<div className="relative" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
  {/* Circle layer */}
  <div style={{ position: "absolute", zIndex: 1 }}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border-4"
        style={{ 
          borderColor: "#FF6B9D", 
          width: 80, 
          height: 80,
          left: "-40px",
          top: "-40px",
          willChange: "transform, opacity"
        }}
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ 
          duration: 1.2, 
          repeat: 3,
          repeatType: "reverse",
          delay: i * 0.25,
          ease: "easeOut"
        }}
      />
    ))}
  </div>
  
  {/* Mascot layer (on top) */}
  <motion.div
    animate={{ 
      scale: [0.95, 1.15, 0.95],
      opacity: [0.8, 1, 0.8]
    }}
    transition={{ 
      duration: 1.2, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
    style={{ position: "relative", zIndex: 10 }}
  >
    <SultanMascot size="xl" emotion="hug" />
  </motion.div>
  
  {/* Text layer */}
  <div
    className="absolute font-display italic whitespace-nowrap"
    style={{ top: "100%", left: "50%", transform: "translateX(-50%)", color: "#C2185B", zIndex: 1 }}
  >
    Utututututuu sinii sinii
  </div>
</div>
  </div>
)}
    </div>
  );
}

export default function EmotionalCore() {
  // Layout positions for 15 envelopes — distribute roughly (optimized for better fit)
  const positions = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      return {
        top: 5 + row * 18 + (Math.random() * 4 - 2),
        left: 5 + col * 30 + (Math.random() * 6 - 3),
        rot: Math.random() * 18 - 9,
      };
    });
  }, []);

  const [kiss, setKiss] = useState(null);
  const [openEnvelope, setOpenEnvelope] = useState(null);
  const [highestZIndex, setHighestZIndex] = useState(10);
  const envelopeRefs = useRef({});

  const handleEnvelopeClick = (envelopeNumber) => {
    // Close the previously opened envelope if it's different
    if (openEnvelope && openEnvelope !== envelopeNumber && envelopeRefs.current[openEnvelope]) {
      // Trigger close on the previous envelope
      const prevEnvelope = envelopeRefs.current[openEnvelope];
      if (prevEnvelope && prevEnvelope.close) {
        prevEnvelope.close();
      }
    }
    setOpenEnvelope(envelopeNumber);
    // Increase z-index for the clicked envelope
    setHighestZIndex(prev => prev + 1);
  };

  useEffect(() => {
    let timeoutId;
    const schedule = () => {
      const delay = 18000 + Math.random() * 14000;
      timeoutId = setTimeout(() => {
        setKiss({ id: Date.now(), left: 10 + Math.random() * 80, drift: (Math.random() * 30 - 15).toFixed(0) });
        setTimeout(() => setKiss(null), 3000);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="page-container">
      <div className="flex flex-col px-4 pt-4 pb-4 overflow-y-auto lg:px-8 lg:pt-6" style={{ 
        height: "100%",
        paddingBottom: "calc(clamp(80px, 12vh, 100px) + 40px + 20px)" /* Sesuai navbar baru */
      }}>
        <div className="flex-shrink-0 mb-4 lg:mb-6">
          <h1 className="font-display text-center" style={{ color: "#C2185B", fontSize: "clamp(20px, 5vw, 36px)" }}>
            15 Reasons I LOVE U SOO MUCHH
          </h1>
          <p className="text-center text-[#999] mt-1" style={{ fontSize: "clamp(13px, 3vw, 17px)" }}>
            Pencet yhh amplopnyaa
          </p>
        </div>
            <div className="flex items-center justify-center py-3 flex-grow">
              <div className="envelope-container relative overflow-hidden">
                {positions.map((p, i) => (
                  <EnvelopeCard
                    key={i}
                    n={i + 1}
                    accent={ACCENTS[i % ACCENTS.length]}
                    top={p.top}
                    left={p.left}
                    rot={p.rot}
                    onEnvelopeClick={handleEnvelopeClick}
                    registerRef={(num, ref) => envelopeRefs.current[num] = ref}
                    isHighest={openEnvelope === i + 1}
                    highestZIndex={highestZIndex}
                  />
                ))}
              </div>
            </div>

            <div className="flex-shrink-0 mt-3">
              <VirtualHug />
            </div>

            {kiss && (
              <span
                key={kiss.id}
                className="fixed text-2xl pointer-events-none z-50 kiss-drop"
                style={{ left: kiss.left + "%", top: 80, "--kx": kiss.drift + "px" }}
              >
                💋
              </span>
            )}
          </div>
    </div>
  );
}
