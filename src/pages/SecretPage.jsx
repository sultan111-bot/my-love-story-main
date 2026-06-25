import { useState, useEffect, useRef } from "react";
import SultanMascot from "../components/SultanMascot.jsx";
import SpeechBubble from "../components/SpeechBubble.jsx";
import ConfettiEffect from "../components/ConfettiEffect.jsx";
import { useSound } from "../hooks/useSound.js";
import { useVibration } from "../hooks/useVibration.js";
import { useMusic } from "../context/MusicContext.jsx";

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
        paddingBottom: "calc(clamp(70px, 11vh, 90px) + 80px)"
      }}
    >
      <ConfettiEffect active={confetti} duration={1500} count={30} />
      
      <div className="z-10 w-full" style={{ opacity: 1 }}>
        <div className="text-center mb-6">
          <h1 className="font-display text-center" style={{ 
            color: "var(--theme-accent)",
            fontSize: "clamp(20px, 5vw, 32px)",
          }}>
            Jawab yang bener yhhh hehee
          </h1>
        </div>

        <div className="flex justify-center items-center gap-2 mb-6">
          <span style={{ fontSize: "clamp(11px, 2.8vw, 15px)" }} className="text-gray-600 font-medium">
            Pertanyaan {idx + 1}/3
          </span>
          {QUESTIONS.map((_, i) => (
            <span
              key={i}
              className="rounded-full"
              style={{ 
                background: i <= idx ? "#FF6B9D" : "#E0E0E0",
                width: "clamp(10px, 2.5vw, 14px)",
                height: "clamp(10px, 2.5vw, 14px)",
              }}
            />
          ))}
        </div>

        <form
          onSubmit={submit}
          className="mt-5 w-full mx-auto"
          style={{ 
            background: "#FFF5F8",
            borderRadius: "24px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            padding: "clamp(20px, 5vw, 32px)",
            maxWidth: "clamp(280px, 90vw, 600px)",
            border: "2px solid #FFE0E9"
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
              background: "#FFFFFF",
              color: "#333"
            }}
            onFocus={(e) => e.target.style.borderColor = "#FF6B9D"}
            onBlur={(e) => e.target.style.borderColor = "#FFE0E9"}
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-xl text-white font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              background: "linear-gradient(135deg, #FF6B9D 0%, #C2185B 100%)",
              padding: "clamp(12px, 3vw, 18px)",
              fontSize: "clamp(13px, 3.2vw, 17px)",
            }}
          >
            Submit
          </button>
        </form>

        <div className="flex items-start gap-3 mt-6 justify-center">
          <div className="animate-bounce-slow" style={{ animationDuration: "2s" }}>
            <SultanMascot size="md" emotion={sultanState.emotion} />
          </div>
          <div style={{ marginTop: 15, maxWidth: "clamp(180px, 55vw, 260px)" }}>
            <SpeechBubble side="right" showPointer={false}>{sultanState.speech}</SpeechBubble>
          </div>
        </div>
      </div>
    </div>
  );
}

function GiftBox({ onOpen }) {
  const [opened, setOpened] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const { playSuccess, playCelebration } = useSound();
  const { vibrateSuccess } = useVibration();

  const handleOpen = () => {
    playSuccess();
    vibrateSuccess();
    setConfetti(true);
    setOpened(true);
    setTimeout(() => setConfetti(false), 4000);
    setTimeout(() => onOpen(), 1500);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        paddingLeft: "clamp(12px, 4vw, 24px)",
        paddingRight: "clamp(12px, 4vw, 24px)",
        paddingTop: "clamp(20px, 5vw, 40px)",
        paddingBottom: "calc(clamp(70px, 11vh, 90px) + 80px)",
        background: "var(--theme-bg)"
      }}
    >
      <ConfettiEffect active={confetti} duration={4000} count={50} />
      
      <div className="z-10 w-full text-center" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h1 
          className="font-display font-bold mb-8"
          style={{ 
            color: "var(--theme-accent)",
            fontSize: "clamp(24px, 6vw, 36px)",
          }}
        >
          Ini Hadiah Untukmu! 🎁
        </h1>
        
        <div className="flex justify-center mb-6">
          <SultanMascot size="lg" emotion="excited" />
        </div>
        
        <p 
          className="mb-10 text-gray-600"
          style={{ fontSize: "clamp(14px, 3.5vw, 18px)" }}
        >
          Tekan kotaknya untuk membuka! ✨
        </p>
        
        <div 
          className={`relative mx-auto transition-all duration-700 ${opened ? "scale-110 opacity-50" : "hover:scale-105 cursor-pointer"}`}
          style={{
            width: "clamp(180px, 50vw, 280px)",
            height: "clamp(180px, 50vw, 280px)"
          }}
          onClick={!opened ? handleOpen : undefined}
        >
          {/* Kotak Hadiah */}
          <div 
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #FF6B9D 0%, #C2185B 100%)",
              boxShadow: "0 10px 40px rgba(255, 107, 157, 0.4)"
            }}
          />
          
          {/* Pita */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2"
            style={{
              width: "25%",
              height: "100%",
              background: "linear-gradient(90deg, #FFB6C1 0%, #FF6B9D 50%, #FFB6C1 100%)"
            }}
          />
          
          <div 
            className="absolute top-0 left-0 w-full h-1/4"
            style={{
              background: "linear-gradient(0deg, #FFB6C1 0%, #FF6B9D 50%, #FFB6C1 100%)"
            }}
          />
          
          {/* Pita tengah */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "clamp(50px, 15vw, 70px)",
              height: "clamp(50px, 15vw, 70px)",
              background: "linear-gradient(135deg, #FFB6C1 0%, #FF6B9D 100%)",
              borderRadius: "50%",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
            }}
          >
            <span 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ fontSize: "clamp(24px, 6vw, 32px)" }}
            >
              ❤️
            </span>
          </div>
          
          {/* Efek glow */}
          {!opened && (
            <div 
              className="absolute inset-0 rounded-2xl animate-pulse"
              style={{
                boxShadow: "0 0 30px rgba(255, 107, 157, 0.6)"
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function HiddenContent() {
  const videoRef = useRef(null);
  const { fadeIn, fadeOut, playing } = useMusic();
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Preload video ketika komponen mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.preload = "auto";
      videoRef.current.load();
    }
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ 
        paddingTop: "clamp(16px, 4vw, 32px)",
        paddingBottom: "calc(clamp(70px, 11vh, 90px) + 40px)",
        paddingLeft: "clamp(12px, 4vw, 24px)",
        paddingRight: "clamp(12px, 4vw, 24px)",
        background: "var(--theme-bg)"
      }}
    >
      <div className="w-full" style={{ maxWidth: "clamp(280px, 95vw, 900px)", margin: "0 auto" }}>
        <div className="text-center mb-4">
          <h2 
            className="font-display font-bold"
            style={{ 
              color: "var(--theme-accent)",
              fontSize: "clamp(20px, 5vw, 36px)",
            }}
          >
            Pesan Spesial Untukmu 💕
          </h2>
        </div>

        <div className="relative">
          {/* Loading state sebelum video siap */}
          {!videoLoaded && (
            <div 
              className="absolute inset-0 flex items-center justify-center rounded-2xl z-10"
              style={{
                background: "#FFF5F8",
                paddingBottom: "56.25%"
              }}
            >
              <div className="text-center" style={{ marginTop: "50%" }}>
                <div 
                  className="animate-bounce-slow mb-4"
                  style={{ fontSize: "clamp(32px, 8vw, 48px)" }}
                >
                  🎬
                </div>
                <p 
                  className="text-gray-600"
                  style={{ fontSize: "clamp(12px, 3vw, 16px)" }}
                >
                  Memuat video...
                </p>
              </div>
            </div>
          )}

          <div 
            className="relative rounded-xl overflow-hidden shadow-lg"
            style={{ 
              border: "2px solid #FFE0E9"
            }}
          >
            <div className="relative" style={{ paddingBottom: "56.25%" }}>
              <video
                ref={videoRef}
                src="/video_hbd.mp4"
                controls
                playsInline
                preload="auto"
                className={`absolute top-0 left-0 w-full h-full ${videoLoaded ? "object-cover" : "object-contain"}`}
                style={{
                  background: "#FFF5F8",
                }}
                onCanPlay={() => setVideoLoaded(true)}
                onLoadedData={() => setVideoLoaded(true)}
                onPlay={() => {
                  if (playing) {
                    fadeOut();
                  }
                }}
                onPause={() => {
                  fadeIn();
                }}
                onEnded={() => {
                  fadeIn();
                }}
              />
            </div>
          </div>
        </div>

        <p 
          className="text-center text-gray-600 mt-4"
          style={{ fontSize: "clamp(11px, 2.8vw, 15px)" }}
        >
          Klik play untuk menonton! ✨
        </p>
      </div>
    </div>
  );
}

export default function SecretPage() {
  const [step, setStep] = useState('quiz'); // 'quiz' -> 'gift' -> 'video'

  useEffect(() => {
    const hasUnlocked = localStorage.getItem("secret-unlocked") === "true";
    if (hasUnlocked) {
      setStep('video');
    }
  }, []);

  const handleQuizDone = () => {
    localStorage.setItem("secret-unlocked", "true");
    setStep('gift');
  };

  const handleGiftOpen = () => {
    setStep('video');
  };

  if (step === 'quiz') return <Quiz onDone={handleQuizDone} />;
  if (step === 'gift') return <GiftBox onOpen={handleGiftOpen} />;
  return <HiddenContent />;
}
