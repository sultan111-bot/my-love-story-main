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
    const correct = ans && guess === ans;

    if (correct) {
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
      setSultanState({
        emotion: "sad",
        speech: `Salah! Petunjuk: ${buildHint(cur.a || "", Math.min(next, cur.a.length))}`,
      });
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        paddingLeft: "clamp(12px, 4vw, 24px)",
        paddingRight: "clamp(12px, 4vw, 24px)",
        paddingTop: "clamp(20px, 5vw, 40px)",
        paddingBottom: "calc(clamp(80px, 12vh, 100px) + 80px + 4rem)"
      }}
    >
      <ConfettiEffect active={confetti} duration={1500} count={30} />
      
      {/* Decorative Background Circles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            background: "#FF6B9D",
            width: "clamp(150px, 40vw, 300px)",
            height: "clamp(150px, 40vw, 300px)",
            top: "-10%",
            left: "-10%"
          }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            background: "#C2185B",
            width: "clamp(120px, 35vw, 250px)",
            height: "clamp(120px, 35vw, 250px)",
            bottom: "10%",
            right: "-5%"
          }}
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -15, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <motion.div
        className="z-10 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center mb-6"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut",
            repeatType: "loop"
          }}
        >
          <h1 className="font-display text-center" style={{ 
            color: "var(--theme-accent)",
            fontSize: "clamp(20px, 5vw, 32px)",
            textShadow: "0 2px 10px rgba(255, 107, 157, 0.3)"
          }}>
            Jawab yang bener yhhh hehee
          </h1>
        </motion.div>

        <div className="flex justify-center items-center gap-2 mb-6">
          <span style={{ fontSize: "clamp(11px, 2.8vw, 15px)" }} className="text-gray-600 font-medium">
            Pertanyaan {idx + 1}/3
          </span>
          {QUESTIONS.map((_, i) => (
            <motion.span
              key={i}
              className="rounded-full"
              style={{ 
                background: i <= idx ? "#FF6B9D" : "#E0E0E0",
                width: "clamp(10px, 2.5vw, 14px)",
                height: "clamp(10px, 2.5vw, 14px)",
                boxShadow: i <= idx ? "0 0 10px rgba(255, 107, 157, 0.5)" : "none"
              }}
              initial={false}
              animate={{
                scale: i === idx ? [1, 1.2, 1] : 1
              }}
              transition={{ duration: i === idx ? 1 : 0, repeat: i === idx ? Infinity : 0 }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={idx}
            onSubmit={submit}
            initial={{ x: 80, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -80, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            className="mt-5 w-full mx-auto"
            style={{ 
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              padding: "clamp(20px, 5vw, 32px)",
              maxWidth: "clamp(280px, 90vw, 600px)"
            }}
          >
            <div 
              style={{ 
                fontSize: "clamp(15px, 3.8vw, 20px)",
                color: "#333",
                marginBottom: "clamp(16px, 4vw, 24px)",
                lineHeight: 1.5
              }} 
              className="font-bold"
            >
              {cur.q}
            </div>
            <input
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className={`w-full rounded-xl outline-none transition-all duration-200 ${shake ? "shake-x" : ""}`}
              placeholder="Tulis jawabanmu..."
              style={{ 
                padding: "clamp(12px, 3vw, 18px)",
                fontSize: "clamp(13px, 3.2vw, 17px)",
                border: "2px solid #FFE0E9",
                background: "#FFF5F8",
                color: "#333"
              }}
              onFocus={(e) => e.target.style.borderColor = "#FF6B9D"}
              onBlur={(e) => e.target.style.borderColor = "#FFE0E9"}
            />
            <button
              type="submit"
              className="mt-4 w-full rounded-xl text-white font-semibold transition-all duration-200 hover:scale-102 active:scale-98"
              style={{ 
                background: "linear-gradient(135deg, #FF6B9D 0%, #C2185B 100%)",
                padding: "clamp(12px, 3vw, 18px)",
                fontSize: "clamp(13px, 3.2vw, 17px)",
                boxShadow: "0 4px 15px rgba(255, 107, 157, 0.4)"
              }}
            >
              Submit
            </button>
          </motion.form>
        </AnimatePresence>

        <div className="flex items-start gap-3 mt-6 justify-center">
          <motion.div
            animate={{ 
              y: [0, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <SultanMascot size="md" emotion={sultanState.emotion} />
          </motion.div>
          <div style={{ marginTop: 15, maxWidth: "clamp(180px, 55vw, 260px)" }}>
            <SpeechBubble side="right" showPointer={false}>{sultanState.speech}</SpeechBubble>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function HiddenContent() {
  const [confetti, setConfetti] = useState(true);
  const [sparkles, setSparkles] = useState([]);
  useState(() => setTimeout(() => setConfetti(false), 4000));

  // CONFIGURATION - Responsive with clamp()
  const CONFIG = {
    title: {
      marginBottom: "clamp(18px, 4.5vw, 44px)",
      fontSize: "clamp(22px, 5.5vw, 40px)"
    },
    video: {
      marginTop: "clamp(18px, 4.5vw, 44px)",
      maxWidth: "clamp(260px, 90vw, 850px)",
      aspectRatio: "56.25%"
    },
    container: {
      paddingTop: "clamp(24px, 6vw, 48px)",
      paddingBottom: "calc(clamp(80px, 12vh, 100px) + 80px + 5rem)", // For bottom navbar
      paddingHorizontal: "clamp(14px, 4.5vw, 28px)"
    },
    sparkles: {
      count: 6,
      size: "clamp(18px, 4.5vw, 30px)",
      spread: 0.85
    }
  };

  // Performance detection (kept for backward compatibility)
  const [perfMode] = useState('high');

  useEffect(() => {
    // Create floating sparkles - lightweight
    const newSparkles = Array.from({ length: CONFIG.sparkles.count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 4 + Math.random() * 3,
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <div 
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ 
        paddingTop: CONFIG.container.paddingTop,
        paddingBottom: CONFIG.container.paddingBottom,
        paddingLeft: CONFIG.container.paddingHorizontal,
        paddingRight: CONFIG.container.paddingHorizontal
      }}
    >
      <ConfettiEffect active={confetti} duration={4000} count={50} />
      
      {/* Decorative Background - Lightweight */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute rounded-full blur-3xl opacity-15"
          style={{
            background: "linear-gradient(135deg, #FF6B9D, #FFB6C1)",
            width: "clamp(180px, 45vw, 360px)",
            height: "clamp(180px, 45vw, 360px)",
            top: "-15%",
            left: "-10%"
          }}
          animate={{
            scale: [1, 1.08, 1],
            x: [0, 25, 0],
            y: [0, -15, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute rounded-full blur-3xl opacity-15"
          style={{
            background: "linear-gradient(135deg, #C2185B, #9C27B0)",
            width: "clamp(140px, 40vw, 300px)",
            height: "clamp(140px, 40vw, 300px)",
            bottom: "5%",
            right: "-5%"
          }}
          animate={{
            scale: [1, 1.12, 1],
            x: [0, -20, 0],
            y: [0, 10, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />

        {/* Soft vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, transparent 55%, rgba(0,0,0,0.08) 100%)",
          }}
        />
      </div>
      
      {/* Floating sparkles */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute pointer-events-none z-5"
          style={{ 
            left: `${8 + (sparkle.left * CONFIG.sparkles.spread)}%`,
            top: `${15 + Math.random() * 70}%`,
            fontSize: CONFIG.sparkles.size
          }}
          initial={{ y: "120vh", opacity: 0, scale: 0 }}
          animate={{ 
            y: "-30vh", 
            opacity: [0, 1, 0.9, 0],
            scale: [0, 1, 1.1, 0.9],
            rotate: [0, 180, 360]
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

      {/* Sultan Mascot */}
      <motion.div 
        className="absolute z-20"
        style={{
          top: "clamp(14px, 3.5vw, 28px)",
          right: "clamp(14px, 3.5vw, 28px)"
        }}
        animate={{
          y: [0, -8, 0],
          rotate: [0, 4, -4, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOutSine",
          repeatType: "loop"
        }}
      >
        <SultanMascot size="md" emotion="celebrating" />
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 w-full" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: CONFIG.video.maxWidth }}
      >
        {/* Title Section */}
        <motion.div
          initial={{ scale: 0, rotate: -120 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 180 }}
          className="text-center mb-8"
          style={{ marginBottom: CONFIG.title.marginBottom }}
        >
          <motion.h2 
            className="font-display font-bold mb-3"
            style={{ 
              background: "linear-gradient(135deg, #FF6B9D 0%, #C2185B 50%, #9C27B0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: CONFIG.title.fontSize,
              textShadow: "0 2px 20px rgba(255, 107, 157, 0.25)"
            }}
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Pesan Spesial Untukmu 
          </motion.h2>
          <motion.p
            className="text-gray-600"
            style={{ fontSize: "clamp(13px, 3.2vw, 20px)" }}
            animate={{ opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Sesuatu yang spesial hanya untuk kamu~ 💕
          </motion.p>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9, type: "spring" }}
          className="relative"
          style={{ marginTop: CONFIG.video.marginTop }}
        >
          {/* Glow Background */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-35 blur-xl"
            style={{
              background: "linear-gradient(135deg, #FF6B9D, #C2185B, #9C27B0)"
            }}
            animate={{
              scale: [1, 1.06, 1],
              opacity: [0.3, 0.45, 0.3]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Video Container */}
          <div 
            className="relative rounded-3xl overflow-hidden shadow-2xl"
            style={{ 
              border: "3px solid rgba(255, 255, 255, 0.35)",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(8px)"
            }}
          >
            {/* Aspect Ratio Wrapper */}
            <div className="relative" style={{ paddingBottom: CONFIG.video.aspectRatio }}>
              <video
                src="[VIDEO_URL_PLACEHOLDER]"
                controls
                autoPlay
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
                poster=""
                style={{
                  background: "linear-gradient(135deg, #FFB6C1 0%, #9C27B0 100%)",
                }}
              />
            </div>
            
            {/* Decorative Badges */}
            <motion.div
              className="absolute rounded-full flex items-center justify-center text-white shadow-lg"
              style={{
                top: "clamp(-10px, -2.5vw, -14px)",
                left: "clamp(-10px, -2.5vw, -14px)",
                width: "clamp(32px, 8vw, 44px)",
                height: "clamp(32px, 8vw, 44px)",
                fontSize: "clamp(14px, 3.5vw, 18px)",
                background: "linear-gradient(135deg, #FF6B9D, #FF8FAE)"
              }}
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, 8, -8, 0]
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              💕
            </motion.div>
            
            <motion.div
              className="absolute rounded-full flex items-center justify-center text-white shadow-lg"
              style={{
                top: "clamp(-10px, -2.5vw, -14px)",
                right: "clamp(-10px, -2.5vw, -14px)",
                width: "clamp(32px, 8vw, 44px)",
                height: "clamp(32px, 8vw, 44px)",
                fontSize: "clamp(14px, 3.5vw, 18px)",
                background: "linear-gradient(135deg, #C2185B, #D44B8B)"
              }}
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, -8, 8, 0]
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            >
              🌟
            </motion.div>
            
            <motion.div
              className="absolute rounded-full flex items-center justify-center text-white shadow-lg"
              style={{
                bottom: "clamp(-10px, -2.5vw, -14px)",
                left: "clamp(-10px, -2.5vw, -14px)",
                width: "clamp(32px, 8vw, 44px)",
                height: "clamp(32px, 8vw, 44px)",
                fontSize: "clamp(14px, 3.5vw, 18px)",
                background: "linear-gradient(135deg, #FFD166, #FFE5A8)"
              }}
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, 12, -12, 0]
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            >
              ✨
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
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
