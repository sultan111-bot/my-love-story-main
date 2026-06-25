import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SultanMascot from "../components/SultanMascot.jsx";
import SpeechBubble from "../components/SpeechBubble.jsx";
import ConfettiEffect from "../components/ConfettiEffect.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useSound } from "../hooks/useSound.js";
import { useVibration } from "../hooks/useVibration.js";

const PLACES = [
  { e: "🎬", n: "Movie Date" },
  { e: "🍜", n: "Restaurant Date" },
  { e: "🌊", n: "Beach Date" },
  { e: "🎡", n: "Playground Date" },
  { e: "☕", n: "Coffee Date" },
  { e: "🎨", n: "Art Date" },
];

const CONFIG = {
  mascot: {
    topPadding: "pt-2",
    size: "lg"
  },
  content: {
    questionMargin: "mb-3",
    speechMargin: "mt-2"
  },
  speeches: {
    escape: [
      "Coba lagi~ 😼",
      "Yakin nihh?? 🤔",
      "Jangan nyesel ya~ 😏",
      "Kok gitu sikk sygg 😔",
      "HMZZZZ 🥺",
      "Terakhir nihhh!! 🎯",
      "Apalahhhh bubbb 💔"
    ],
    final: "hhhh mampus luwhhhh 😏"
  }
};

function TrapOfLove({ onYesTriggered }) {
  const ref = useRef(null);
  const noBtn = useRef(null);
  const yesBtn = useRef(null);
  const [escapes, setEscapes] = useState(0);
  const escapesRef = useRef(0);
  const [noGone, setNoGone] = useState(false);
  const noGoneRef = useRef(false);
  const lastEscapeTime = useRef(0);
  const [yesClicked, setYesClicked] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [noPos, setNoPos] = useState({ left: 16, bottom: 14 });
  const [yesPos, setYesPos] = useState({ x: 0, y: 0, scale: 1 });
  const [sultanState, setSultanState] = useState({ emotion: "happy", speech: "Pilih yg jujur yhh~" });
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isButtonHidden, setIsButtonHidden] = useState(false);
  const lastMoveTime = useRef(0);
  const previousPositions = useRef([]);
  const { playClick, playSuccess, playError, playCelebration } = useSound();
  const { vibrateClick, vibrateSuccess, vibrateError } = useVibration();

  // Calculate initial bottom position
  useEffect(() => {
    const calculateInitialBottom = () => {
      const containerHeight = ref.current?.getBoundingClientRect().height;
      if (!containerHeight) return;
      
      // Calculate pixel value for clamp(14px, 3.5vw, 28px)
      const vw = window.innerWidth * 0.035;
      const initialBottom = Math.min(28, Math.max(14, vw));
      setNoPos(prev => ({ ...prev, bottom: initialBottom }));
    };

    calculateInitialBottom();
    window.addEventListener('resize', calculateInitialBottom);
    return () => window.removeEventListener('resize', calculateInitialBottom);
  }, []);

  const moveNoButtonRandom = () => {
    const rect = ref.current?.getBoundingClientRect();
    const btnRect = noBtn.current?.getBoundingClientRect();
    if (!rect || !btnRect) return;

    const btnW = btnRect.width;
    const btnH = btnRect.height;
    const padding = 16;

    setIsButtonHidden(true);

    setTimeout(() => {
      const containerWidth = rect.width;
      const containerHeight = rect.height;
      
      const currentLeft = noPos.left;
      const currentBottom = noPos.bottom;

      let yesButtonArea = null;
      if (yesBtn.current) {
        const yesRect = yesBtn.current.getBoundingClientRect();
        const yesScale = yesPos.scale || 1;
        const yesW = yesRect.width * yesScale;
        const yesH = yesRect.height * yesScale;
        const yesX = yesRect.left - rect.left;
        const yesY = yesRect.top - rect.top;
        yesButtonArea = {
          left: yesX - 20,
          top: yesY - 20,
          right: yesX + yesW + 20,
          bottom: yesY + yesH + 20
        };
      }

      const maxMoveDistance = Math.min(containerWidth, containerHeight) * 0.35;
      
      let newLeft, newBottom;
      let attempts = 0;
      const maxAttempts = 20;
      
      do {
        const moveX = (Math.random() - 0.5) * maxMoveDistance * 2;
        const moveY = (Math.random() - 0.5) * maxMoveDistance * 2;
        
        newLeft = currentLeft + moveX;
        newBottom = currentBottom + moveY;
        
        newLeft = Math.max(padding, Math.min(newLeft, containerWidth - btnW - padding));
        newBottom = Math.max(padding, Math.min(newBottom, containerHeight - btnH - padding));
        
        const isTooCloseToPrevious = previousPositions.current.some(prev => {
          const dx = prev.left - newLeft;
          const dy = prev.bottom - newBottom;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < 90;
        });
        
        let overlapsWithYes = false;
        if (yesButtonArea) {
          const noRight = newLeft + btnW;
          const noTop = containerHeight - newBottom - btnH;
          
          overlapsWithYes = !(noRight < yesButtonArea.left || 
                           newLeft > yesButtonArea.right || 
                           containerHeight - newBottom < yesButtonArea.top || 
                           noTop > yesButtonArea.bottom);
        }
        
        if (!isTooCloseToPrevious && !overlapsWithYes) break;
        attempts++;
      } while (attempts < maxAttempts);

      previousPositions.current.push({ left: newLeft, bottom: newBottom });
      if (previousPositions.current.length > 3) {
        previousPositions.current.shift();
      }

      setNoPos({ left: newLeft, bottom: newBottom });
      setTimeout(() => setIsButtonHidden(false), 50);
    }, 200);
  };

  const registerEscape = () => {
    const now = Date.now();
    if (now - lastEscapeTime.current < 300) return;
    
    lastEscapeTime.current = now;
    escapesRef.current += 1;
    setEscapes(escapesRef.current);
    
    if (escapesRef.current < 7) {
      const speechIndex = Math.min(escapesRef.current - 1, CONFIG.speeches.escape.length - 1);
      const speech = CONFIG.speeches.escape[speechIndex];
      setSultanState({ 
        emotion: "teasing", 
        speech: speech 
      });
    } else {
      noGoneRef.current = true;
      setNoGone(true);
      setSultanState({ emotion: "smug", speech: CONFIG.speeches.final });
    }
  };

  const onTouchStartContainer = (e) => {
    if (noGoneRef.current) return;
    
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || !noBtn.current) return;
    
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      return;
    }
    
    const fx = clientX - rect.left;
    const fy = clientY - rect.top;
    
    const r = noBtn.current.getBoundingClientRect();
    const cx = r.left + r.width / 2 - rect.left;
    const cy = r.top + r.height / 2 - rect.top;
    const dx = cx - fx;
    const dy = cy - fy;
    const dist = Math.hypot(dx, dy);
    
    if (dist < 120) {
      moveNoButtonRandom();
      registerEscape();
    }
  };

  const onMove = (e) => {
    if (noGoneRef.current) return;
    
    const now = Date.now();
    if (now - lastMoveTime.current < 60) return;
    lastMoveTime.current = now;
    
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const fx = clientX - rect.left;
    const fy = clientY - rect.top;

    if (!noGoneRef.current && noBtn.current) {
      const r = noBtn.current.getBoundingClientRect();
      const cx = r.left + r.width / 2 - rect.left;
      const cy = r.top + r.height / 2 - rect.top;
      const dx = cx - fx;
      const dy = cy - fy;
      const dist = Math.hypot(dx, dy);
      
      if (dist < 110) {
        moveNoButtonRandom();
        registerEscape();
      }
    }

    if (noGoneRef.current && yesBtn.current) {
      setYesPos({ 
        x: fx - rect.width / 2, 
        y: fy - rect.height / 2, 
        scale: 1.7 
      });
    }

    if (!noGoneRef.current && yesBtn.current) {
      const r = yesBtn.current.getBoundingClientRect();
      const cx = r.left + r.width / 2 - rect.left;
      const cy = r.top + r.height / 2 - rect.top;
      const dx = fx - cx;
      const dy = fy - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < 90) {
        const factor = 6 / Math.max(15, dist);
        setYesPos(prev => ({ 
          x: prev.x === 0 ? dx * factor : prev.x, 
          y: prev.y === 0 ? dy * factor : prev.y, 
          scale: prev.scale || 1 
        }));
      } else {
        setYesPos(prev => ({ 
          x: prev.x, 
          y: prev.y, 
          scale: prev.scale || 1 
        }));
      }
    }
  };

  const onNoClick = (e) => {
    if (e) e.preventDefault();
    
    if (!noGoneRef.current) {
      playError();
      vibrateError();
      moveNoButtonRandom();
      registerEscape();

      const scale = 1 + (escapesRef.current * 0.1);
      const centerX = 0;
      const centerY = 0;
      
      setYesPos({ x: centerX, y: centerY, scale });
    }
  };

  const onYes = () => {
    playSuccess();
    vibrateSuccess();
    playCelebration();
    setYesClicked(true);
    setSultanState({ emotion: "celebrating", speech: "Yayyyy!! 🥳" });
    const emojis = ["❤️", "🧡", "💛", "💗"];
    const arr = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      e: emojis[Math.floor(Math.random() * emojis.length)],
      x: (Math.random() * 200 - 100).toFixed(0),
      delay: (Math.random() * 0.6).toFixed(2),
    }));
    setHearts(arr);
    setTimeout(() => setHearts([]), 2000);
    setTimeout(() => onYesTriggered(), 1000);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onTouchMove={onMove}
      onTouchStart={onTouchStartContainer}
      className="relative w-full max-w-lg mx-auto trap-of-love-inner"
      style={{
        background: "#FFF5F8",
        borderRadius: "24px",
        padding: "clamp(20px, 5vw, 32px)",
        boxShadow: "0 6px 24px rgba(255, 107, 157, 0.12)",
        border: "2px solid #FFE0E9"
      }}
      initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Sultan Mascot */}
      <motion.div 
        className="flex justify-center mb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <motion.div
          animate={{ 
            y: [0, -6, 0],
            rotate: [0, 3, -3, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOutSine" }}
        >
          <SultanMascot size="lg" emotion={sultanState.emotion} />
        </motion.div>
      </motion.div>
      
      {/* Text Section */}
      <motion.div 
        className="flex flex-col items-center justify-center mb-8" 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <motion.h2 
          className="font-display text-center"
          style={{ 
            color: "#C2185B",
            fontSize: "clamp(20px, 5.5vw, 38px)",
            marginBottom: "clamp(8px, 2vw, 12px)"
          }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOutSine" }}
        >
          Km Sayang Ak Kannn???
        </motion.h2>
        
        <motion.div 
          className="text-gray-600 text-center px-4 font-medium"
          style={{ fontSize: "clamp(13px, 3.2vw, 17px)" }}
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {sultanState.speech}
        </motion.div>
      </motion.div>

      {/* Buttons Section */}
      <div className="relative" style={{ height: "clamp(160px, 42vw, 240px)" }}>
        {!noGone && (
          <motion.button
            ref={noBtn}
            className="absolute px-6 py-3 rounded-full text-gray-700 font-semibold border-2"
            style={{
              left: `${noPos.left}px`,
              bottom: `${noPos.bottom}px`,
              position: 'absolute',
              pointerEvents: 'auto',
              fontSize: "clamp(13px, 2.7vw, 16px)",
              background: "#F9FAFB",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderColor: "#E5E7EB"
            }}
            animate={{
              scale: isButtonHidden ? 0 : (hoveredButton === 'no' ? 1.07 : 1),
              opacity: isButtonHidden ? 0 : 1,
              boxShadow: hoveredButton === 'no' ? '0 8px 20px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.1)'
            }}
            transition={{ 
              scale: { duration: 0.2, ease: "easeInOut" },
              opacity: { duration: 0.2, ease: "easeInOut" },
              boxShadow: { type: "spring", stiffness: 380, damping: 18 }
            }}
            onClick={onNoClick}
            onHoverStart={() => setHoveredButton('no')}
            onHoverEnd={() => setHoveredButton(null)}
            whileTap={{ scale: 0.94 }}
          >
            <motion.span
              animate={{ rotate: [0, -6, 6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2.2 }}
            >
              Nggak 😤
            </motion.span>
          </motion.button>
        )}
        <motion.button
          ref={yesBtn}
          onClick={onYes}
          className="absolute left-1/2 -translate-x-1/2 rounded-full text-white font-bold border-2"
          style={{
            bottom: "clamp(14px, 3.5vw, 28px)",
            padding: "clamp(13px, 3.2vw, 20px) clamp(22px, 5.5vw, 36px)",
            background: "linear-gradient(135deg, #FF6B9D 0%, #C2185B 100%)",
            borderColor: "#FF8FAE",
            boxShadow: "0 6px 20px rgba(255, 107, 157, 0.3)",
            transform: `translate(calc(-50% + ${yesPos.x}px), ${yesPos.y}px) scale(${yesPos.scale || 1})`,
            fontSize: "clamp(15px, 3.5vw, 20px)"
          }}
          animate={{
            scale: (yesPos.scale || 1) * (hoveredButton === 'yes' ? 1.07 : 1),
            boxShadow: hoveredButton === 'yes' ? '0 10px 30px rgba(255, 107, 157, 0.4)' : '0 6px 20px rgba(255, 107, 157, 0.3)'
          }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onHoverStart={() => setHoveredButton('yes')}
          onHoverEnd={() => setHoveredButton(null)}
          whileTap={{ scale: 0.94 }}
        >
          <motion.span
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
          >
            {yesClicked ? "YEAYYYY 💖" : "Sayang! 💖"}
          </motion.span>
        </motion.button>

        {/* Floating Hearts */}
        <div className="absolute right-3 sm:right-6 bottom-4 sm:bottom-6 pointer-events-none">
          {hearts.map((h) => (
            <motion.span
              key={h.id}
              style={{ 
                position: "absolute",
                fontSize: "clamp(18px, 4vw, 28px)",
                "--hx": h.x + "px" 
              }}
              animate={{
                y: [0, -140],
                opacity: [0, 1, 0],
                scale: [0.4, 1.6, 0.7],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 2.4, 
                delay: parseFloat(h.delay),
                ease: "easeOut"
              }}
            >
              {h.e}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function DateSelection() {
  const [tappedIdx, setTappedIdx] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const { playSuccess } = useSound();
  const { vibrateSuccess } = useVibration();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const tap = (i) => {
    playSuccess();
    vibrateSuccess();
    setTappedIdx(i);
    setSelectedPlace(i);
    setTimeout(() => {
      setTappedIdx(null);
      setShowDatePicker(true);
    }, 600);
  };

  const place = selectedPlace !== null ? PLACES[selectedPlace].n : null;

  return (
    <>
      {!showDatePicker ? (
        <div className="px-4 pt-4 pb-4 relative min-h-screen">
          <motion.section
            className="relative z-10 mt-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="text-center mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.h2 
                className="font-display font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent mb-2"
                style={{ 
                  fontSize: "clamp(18px, 4vw, 32px)",
                  backgroundSize: "200% 200%"
                }}
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Mw Nge Date kemanaa???
              </motion.h2>
              <motion.p 
                className="text-gray-600 font-medium"
                style={{ fontSize: "clamp(12px, 2.5vw, 16px)" }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Pilih satu aja yhh hhhhh
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {PLACES.map((p, i) => (
                <motion.button
                  key={i}
                  onClick={() => tap(i)}
                  className={`relative group rounded-3xl p-6 text-center shadow-lg border-2 transition-all duration-300 ${
                    selectedPlace === i 
                      ? 'border-pink-400 shadow-pink-200' 
                      : 'border-pink-200 hover:border-pink-300'
                  }`}
                  style={{
                    background: selectedPlace === i 
                      ? "linear-gradient(135deg, rgba(255,182,193,0.3), rgba(255,228,236,0.4))"
                      : "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,228,236,0.8))",
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: tappedIdx === i ? -3 : 0
                  }}
                  transition={{ 
                    delay: i * 0.08, 
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -4,
                    boxShadow: "0 12px 25px rgba(255,107,157,0.25)"
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-400 to-rose-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  
                  <motion.div 
                    className="relative z-10"
                    animate={{ 
                      rotate: tappedIdx === i ? [0, 5, -5, 0] : 0,
                      scale: tappedIdx === i ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <div className="text-4xl sm:text-5xl mb-3">{p.e}</div>
                    <div className="text-sm sm:text-base font-bold text-gray-800 leading-tight">
                      {p.n}
                    </div>
                  </motion.div>

                  {selectedPlace === i && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <span className="text-white text-sm">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            <motion.div
              className="flex justify-center mt-8"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <SultanMascot size="lg" emotion="celebrating" />
              </motion.div>
            </motion.div>
          </motion.section>
        </div>
      ) : (
        <DatePicker place={place} />
      )}
    </>
  );
}

function DatePicker({ place }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [tappedDate, setTappedDate] = useState(null);
  const { playSuccess } = useSound();
  const { vibrateSuccess } = useVibration();

  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleDateSelect = (date) => {
    playSuccess();
    vibrateSuccess();
    setTappedDate(date);
    setSelectedDate(date);
    setTimeout(() => {
      setTappedDate(null);
      const formattedDate = `${date} Juli 2026`;
      const url = `https://wa.me/6285805351701?text=${encodeURIComponent(`ALLOOO SAYANGGG, ak mw ${place} ajaa dehh heheee, tanggal ${formattedDate} yahhh!`)}`;
      window.open(url, "_blank");
    }, 600);
  };

  return (
    <div className="px-4 pt-4 pb-4 relative min-h-screen">
      <motion.section
        className="relative z-10 mt-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.h2 
                className="font-display font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent mb-2"
                style={{ 
                  fontSize: "clamp(18px, 4vw, 32px)",
                  backgroundSize: "200% 200%"
                }}
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Pilih Tanggalnya dongg??
              </motion.h2>
              <motion.p 
                className="text-gray-600 font-medium"
                style={{ fontSize: "clamp(12px, 2.5vw, 16px)" }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Juli 2026 - Pilih hari yang kamu mau!
              </motion.p>
        </motion.div>

        <div className="grid grid-cols-5 sm:grid-cols-7 gap-3 max-w-2xl mx-auto">
          {dates.map((date) => (
            <motion.button
              key={date}
              onClick={() => handleDateSelect(date)}
              className={`relative group rounded-2xl p-4 text-center shadow-lg border-2 transition-all duration-300 ${
                selectedDate === date 
                  ? 'border-pink-400 shadow-pink-200' 
                  : 'border-pink-200 hover:border-pink-300'
              }`}
              style={{
                background: selectedDate === date 
                  ? "linear-gradient(135deg, rgba(255,182,193,0.3), rgba(255,228,236,0.4))"
                  : "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,228,236,0.8))",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: tappedDate === date ? -3 : 0
              }}
              transition={{ 
                delay: date * 0.02, 
                duration: 0.4,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -4,
                boxShadow: "0 12px 25px rgba(255,107,157,0.25)"
              }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              
              <motion.div 
                className="relative z-10"
                animate={{ 
                  rotate: tappedDate === date ? [0, 5, -5, 0] : 0,
                  scale: tappedDate === date ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="text-lg sm:text-xl font-bold text-gray-800">
                  {date}
                </div>
              </motion.div>

              {selectedDate === date && (
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <span className="text-white text-xs">✓</span>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

function CelebrationOverlay({ onDone }) {
  const [hearts, setHearts] = useState([]);
  
  useEffect(() => {
    const emojis = ["💕", "💖", "💗"];
    const newHearts = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      e: emojis[Math.floor(Math.random() * emojis.length)],
      x: 15 + Math.random() * 70,
      delay: Math.random() * 0.8,
      size: 16 + Math.random() * 12
    }));
    setHearts(newHearts);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-gradient-to-br from-pink-900/70 via-rose-800/60 to-pink-900/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 pointer-events-none">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute opacity-50"
            style={{ 
              left: `${heart.x}%`,
              fontSize: `${heart.size}px`,
              willChange: "transform, opacity"
            }}
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ 
              y: "-10vh", 
              opacity: [0, 0.6, 0.6, 0],
              scale: [0.2, 1, 1, 0.4]
            }}
            transition={{ 
              duration: 2.8, 
              delay: heart.delay,
              ease: "easeOut"
            }}
          >
            {heart.e}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        style={{ willChange: "transform" }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-2xl pointer-events-none"
          style={{ width: "120%", height: "120%", left: "-10%", top: "-10%" }}
        />
        
        <motion.div
          animate={{ 
            y: [0, -12, 0],
            rotate: [0, 3, -3, 0]
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: "transform" }}
        >
          <SultanMascot size="xl" emotion="celebrating" />
          
          <motion.div
            className="absolute -top-10 left-1/2 -translate-x-1/2 text-4xl pointer-events-none"
            animate={{ 
              y: [0, -20, 0],
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💕
          </motion.div>
          <motion.div
            className="absolute -top-6 -left-8 text-3xl pointer-events-none"
            animate={{ 
              y: [0, -18, 0],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.2 }}
          >
            💖
          </motion.div>
          <motion.div
            className="absolute -top-6 -right-8 text-3xl pointer-events-none"
            animate={{ 
              y: [0, -18, 0],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.4 }}
          >
            💗
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-[calc(50%-220px)]"
        initial={{ scale: 0, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
      >
        <motion.div
          className="bg-white/95 backdrop-blur-sm rounded-full px-8 py-4 shadow-2xl border-2 border-pink-200"
          animate={{ 
            scale: [1, 1.02, 1],
            boxShadow: ["0 8px 25px rgba(255,107,157,0.2)", "0 12px 35px rgba(255,107,157,0.3)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-lg font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            HEHEHEHE I KNOWW BUBB
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2 bg-pink-200/50"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 3, ease: "easeInOut" }}
        onAnimationComplete={onDone}
      >
        <div className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full" />
      </motion.div>
    </motion.div>
  );
}

export default function DatePickerPage() {
  const { current } = useTheme();
  const [showDateSelection, setShowDateSelection] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [enableBackgroundCircles, setEnableBackgroundCircles] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;

    if (prefersReducedMotion || (isMobile && isLowEndDevice) || (isMobile && isLowMemory)) {
      setEnableBackgroundCircles(false);
    }
  }, []);

  const handleYesTriggered = () => {
    setShowCelebration(true);
  };

  const handleCelebrationDone = () => {
    setShowCelebration(false);
    setTimeout(() => setShowDateSelection(true), 300);
  };

  return (
    <div className="page-container" style={{ background: current.bg }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {enableBackgroundCircles && (
          <>
            <motion.div
              className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 blur-xl"
              animate={{ 
                scale: [1, 1.2, 1],
                x: [0, 20, 0],
                y: [0, -20, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-40 right-10 w-40 h-40 bg-rose-200 rounded-full opacity-20 blur-xl"
              animate={{ 
                scale: [1, 1.3, 1],
                x: [0, -30, 0],
                y: [0, 30, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-20 left-1/4 w-36 h-36 bg-pink-300 rounded-full opacity-15 blur-xl"
              animate={{ 
                scale: [1, 1.4, 1],
                x: [0, 40, 0],
                y: [0, -40, 0]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </div>

      <div className="relative z-10 flex flex-col px-4 pt-4 pb-4 overflow-y-auto" style={{ 
        height: "100%",
        paddingBottom: "calc(clamp(70px, 11vh, 90px) + 20px)"
      }}>
        <div className={`flex-1 space-y-4`}>
          {!showDateSelection ? (
            <motion.div 
              className="flex-1 flex items-center justify-center py-8" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ duration: 0.6 }}
            >
              <TrapOfLove onYesTriggered={handleYesTriggered} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <ConfettiEffect active duration={4000} count={50} />
              <DateSelection />
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCelebration && (
          <CelebrationOverlay onDone={handleCelebrationDone} />
        )}
      </AnimatePresence>
    </div>
  );
}