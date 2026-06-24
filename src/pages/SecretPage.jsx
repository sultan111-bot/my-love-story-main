import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SultanMascot from "../components/SultanMascot.jsx";
import SpeechBubble from "../components/SpeechBubble.jsx";
import ConfettiEffect from "../components/ConfettiEffect.jsx";
import { useSound } from "../hooks/useSound.js";
import { useVibration } from "../hooks/useVibration.js";

const QUESTIONS = [
  { q: "Dimana pertama kali kita jalan bener bener cuma berdua???", a: "Geprek Mas boy" },
  { q: "Apa yang ak bener bener gabisa tapi ak mw bisa??", a: "Menggambar" },
  { q: "Apa Kegiatan yang pertama kali ak ikutin?? (dari kecil)", a: "Atletik" },
];

function Quiz({ onDone }) {
  const [idx, setIdx] = useState(0);
  const [val, setVal] = useState("");
  const [wrong, setWrong] = useState(0);
  const [shake, setShake] = useState(false);
  const [sultanState, setSultanState] = useState({ emotion: "worried", speech: "Ak percaya km tw kok..." });
  const [confetti, setConfetti] = useState(false);
  const { playSuccess, playError, playCelebration } = useSound();
  const { vibrateSuccess, vibrateError } = useVibration();

  const cur = QUESTIONS[idx];

  const buildHint = (answer, revealed) => {
    if (revealed <= 0) return answer.replace(/./g, "_ ").trim();
    return answer
      .split("")
      .map((ch, i) => (i < revealed ? ch : "_"))
      .join(" ");
  };

  const submit = (e) => {
    e?.preventDefault();
    const ans = (cur.a || "").toLowerCase().trim();
    const guess = val.toLowerCase().trim();
    const correct = ans && guess && (guess.includes(ans) || ans.includes(guess));

    if (correct || wrong >= 5) {
      // Auto-pass after 5 wrong
      playSuccess();
      vibrateSuccess();
      setSultanState({ emotion: "celebrating", speech: "YEAYYYY" });
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1500);
      setTimeout(() => {
        if (idx + 1 < QUESTIONS.length) {
          setIdx(idx + 1);
          setVal("");
          setWrong(0);
          setSultanState({ emotion: "worried", speech: "Lanjuttt~" });
        } else {
          playCelebration();
          onDone();
        }
      }, 1200);
    } else {
      playError();
      vibrateError();
      const next = wrong + 1;
      setWrong(next);
      setShake(true);
      setTimeout(() => setShake(false), 400);
      if (next >= 5) {
        setSultanState({ emotion: "smug", speech: "HMZZZ... ywdaa laa lanjut ajhhh" });
        setTimeout(() => submit(), 1500);
      } else {
        setSultanState({
          emotion: "sad",
          speech: `Petunjuk: ${buildHint(cur.a || "", next - 1)}`,
        });
      }
    }
  };

  return (
    <div className="px-4 pt-4 pb-8">
      <ConfettiEffect active={confetti} duration={1500} count={30} />
      <h1 className="font-display text-2xl text-center" style={{ color: "var(--theme-accent)" }}>
        Jawab yang bener yhhh hehee
      </h1>

      <div className="flex justify-center items-center gap-2 mt-4">
        <span className="text-xs text-gray-500">Pertanyaan {idx + 1}/3</span>
        {QUESTIONS.map((_, i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: i <= idx ? "#FF6B9D" : "#ddd" }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.form
          key={idx}
          onSubmit={submit}
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-md p-5 mt-5"
        >
          <div className="text-base font-bold text-gray-800 mb-3">{cur.q}</div>
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-pink-400 ${shake ? "shake-x" : ""}`}
            placeholder="Tulis jawabanmu..."
          />
          <button
            type="submit"
            className="mt-3 w-full py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: "linear-gradient(135deg,#FF6B9D,#C2185B)" }}
          >
            Submit
          </button>
        </motion.form>
      </AnimatePresence>

      <div className="flex items-start gap-2 mt-4">
        <SultanMascot size="md" emotion={sultanState.emotion} />
        <div style={{ marginTop: 10, maxWidth: 200 }}>
          <SpeechBubble side="right" showPointer={false}>{sultanState.speech}</SpeechBubble>
        </div>
      </div>
    </div>
  );
}

function HiddenContent() {
  const [confetti, setConfetti] = useState(true);
  const [sparkles, setSparkles] = useState([]);
  useState(() => setTimeout(() => setConfetti(false), 4000));

  // CONFIGURATION - Easy to adjust positioning with pixels
  const POSITION_CONFIG = {
    title: {
      marginBottom: 24,
      fontSize: "text-3xl sm:text-4xl"
    },
    video: {
      marginTop: 24,
      maxWidth: 896,
      aspectRatio: "56.25%"
    },
    container: {
      paddingTop: 16,
      paddingBottom: 24,
      paddingHorizontal: 16
    },
    sparkles: {
      count: 5,
      size: "text-xl",
      spread: 0.8
    }
  };

  const animationConfig = {
    high: { sparkleCount: 5, enableBackgroundCircles: true },
    medium: { sparkleCount: 3, enableBackgroundCircles: true },
    low: { sparkleCount: 1, enableBackgroundCircles: false }
  };

  // Detect performance mode
  const [perfMode, setPerfMode] = useState('high');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;

    if (prefersReducedMotion) {
      setPerfMode('low');
    } else if ((isMobile && isLowEndDevice) || (isMobile && isLowMemory)) {
      setPerfMode('low');
    } else if (isMobile || isLowEndDevice || isLowMemory) {
      setPerfMode('medium');
    }
  }, []);

  const currentConfig = animationConfig[perfMode];

  useEffect(() => {
    // Create floating sparkles using config
    const count = currentConfig.sparkleCount;
    const newSparkles = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
    setSparkles(newSparkles);
  }, [currentConfig.sparkleCount]);

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ 
        paddingTop: `${POSITION_CONFIG.container.paddingTop}px`,
        paddingBottom: `${POSITION_CONFIG.container.paddingBottom}px`,
        paddingLeft: `${POSITION_CONFIG.container.paddingHorizontal}px`,
        paddingRight: `${POSITION_CONFIG.container.paddingHorizontal}px`
      }}
    >
      <ConfettiEffect active={confetti} duration={4000} count={50} />
      
      {/* Floating sparkles - configurable distribution */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className={`absolute ${POSITION_CONFIG.sparkles.size} pointer-events-none z-5`}
          style={{ 
            left: `${10 + (sparkle.left * POSITION_CONFIG.sparkles.spread)}%`, // Configurable spread
            top: `${20 + Math.random() * 60}%` // Avoid edges
          }}
          initial={{ y: "100vh", opacity: 0, scale: 0 }}
          animate={{ 
            y: "-20vh", 
            opacity: [0, 1, 0.8, 0],
            scale: [0, 1, 1.2, 0.8],
            rotate: [0, 360]
          }}
          transition={{ 
            duration: sparkle.duration, 
            delay: sparkle.delay,
            repeat: Infinity,
            ease: "easeOut"
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* Animated background circles - only on high/medium performance */}
      {currentConfig.enableBackgroundCircles && (
        <>
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-pink-300 rounded-full opacity-20 blur-2xl"
            animate={{
              scale: [1, 1.5, 1],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300 rounded-full opacity-20 blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, 40, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/4 w-36 h-36 bg-yellow-300 rounded-full opacity-15 blur-2xl"
            animate={{
              scale: [1, 1.4, 1],
              x: [0, 60, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Vignette overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.15) 100%)",
        }}
      />

      {/* Sultan mascot with animation */}
      <motion.div 
        className="absolute top-6 right-6 z-20"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <SultanMascot size="md" emotion="celebrating" />
      </motion.div>

      {/* Main content container */}
      <div 
        className="relative z-10 w-full mx-auto" 
        style={{ maxWidth: `${POSITION_CONFIG.video.maxWidth}px` }}
      >
        {/* Animated title */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 200 }}
          className="text-center flex flex-col items-center justify-center"
          style={{ marginBottom: `${POSITION_CONFIG.title.marginBottom}px` }}
        >
          <motion.h2 
            className={`font-display ${POSITION_CONFIG.title.fontSize} font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2`}
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ backgroundSize: "200% 200%" }}
          >
             Pesan Spesial Untukmu 
          </motion.h2>
          <motion.p
            className="text-gray-600 text-sm"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Sesuatu yang spesial hanya untuk kamu~ 💕
          </motion.p>
        </motion.div>

        {/* Video container with configurable aspect ratio */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          className="relative"
          style={{ marginTop: `${POSITION_CONFIG.video.marginTop}px` }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-3xl opacity-30 blur-xl"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Video container */}
          <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
            {/* Configurable aspect ratio wrapper */}
            <div className="relative" style={{ paddingBottom: POSITION_CONFIG.video.aspectRatio }}>
              <video
                src="[VIDEO_URL_PLACEHOLDER]"
                controls
                autoPlay
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
                poster=""
                style={{
                  background: "linear-gradient(135deg,#FFB6C1,#9C27B0)",
                }}
              />
            </div>
            
            {/* Decorative elements */}
            <motion.div
              className="absolute -top-3 -left-3 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center text-white text-sm shadow-lg"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💕
            </motion.div>
            <motion.div
              className="absolute -top-3 -right-3 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-white text-sm shadow-lg"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              🌟
            </motion.div>
            <motion.div
              className="absolute -bottom-3 -left-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white text-sm shadow-lg"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
            >
              ✨
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SecretPage() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const hasUnlocked = localStorage.getItem("secret-unlocked") === "true";
    setUnlocked(hasUnlocked);
  }, []);

  const handleUnlock = () => {
    setUnlocked(true);
    localStorage.setItem("secret-unlocked", "true");
  };

  return unlocked ? <HiddenContent /> : <Quiz onDone={handleUnlock} />;
}
