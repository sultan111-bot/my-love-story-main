import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SultanMascot from "../components/SultanMascot.jsx";
import SpeechBubble from "../components/SpeechBubble.jsx";
import ConfettiEffect from "../components/ConfettiEffect.jsx";
import ShareButton from "../components/ShareButton.jsx";

// June 26, 2026 00:00:00 WIB (UTC+7) → 2026-06-25T17:00:00Z
const TARGET = new Date("2026-06-25T17:00:00Z").getTime();

function getRemaining() {
  const diff = TARGET - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    done: false,
  };
}

const pad = (n) => String(n).padStart(2, "0");

export default function Gatekeeper() {
  const navigate = useNavigate();
  const [t, setT] = useState(getRemaining);
  const [celebrate, setCelebrate] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setT((prev) => {
        const next = getRemaining();
        if (!prev.done && next.done && !celebrate) {
          setCelebrate(true);
          setTimeout(() => setShowSplash(true), 1000);
          setTimeout(() => setSplashComplete(true), 4000);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [celebrate]);

  const active = t.done;

  const cards = useMemo(
    () => [
      { v: t.d, label: "DAYS" },
      { v: t.h, label: "HOURS" },
      { v: t.m, label: "MINUTES" },
      { v: t.s, label: "SECONDS", pulse: true },
    ],
    [t]
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10 relative">
      {/* Splash Screen Ultra-Spesial */}
      {showSplash && !splashComplete && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200 pointer-events-none">
          <div className="text-center">
            <SultanMascot size="xl" emotion="excited" />
            <h2
              className="font-display mt-6 mb-4"
              style={{ 
                fontSize: "clamp(32px, 8vw, 56px)", 
                color: "#C2185B",
                animation: "fadeInUp 1s ease-out"
              }}
            >
              SELAMAT ULANG TAHUN!
            </h2>
            <p 
              style={{ 
                fontSize: "clamp(16px, 4vw, 24px)", 
                color: "#88153E" 
              }}
            >
              Sayangku 🎂❤️
            </p>
            <div className="mt-8 text-4xl animate-bounce">
              ✨🎁✨
            </div>
          </div>
          <style>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}

      <div className="absolute top-3 right-3 z-30">
        <ShareButton />
      </div>

      <h1
        className="font-display text-center"
        style={{ fontSize: "clamp(24px, 6vw, 42px)", color: "#C2185B", letterSpacing: 2 }}
      >
        A Gift For You
      </h1>
      <p className="mt-1 text-center text-[#888]" style={{ fontSize: "clamp(12px, 2.5vw, 16px)" }}>
        Menghitung hari untuk hari istimewamu 🎀
      </p>

      <div className="flex items-end justify-center gap-2 mt-8 flex-wrap">
        {cards.map((c, idx) => (
          <div key={c.label} className="flex items-end">
            <div
              className={`bg-white rounded-2xl shadow-md text-center ${c.pulse ? "soft-pulse" : ""}`}
              style={{
                padding: "clamp(12px, 2vw, 16px)",
                minWidth: "clamp(60px, 15vw, 80px)"
              }}
            >
              <div className="font-bold tabular-nums" style={{ fontSize: "clamp(24px, 6vw, 36px)", color: "#C2185B", lineHeight: 1 }}>
                {pad(c.v)}
              </div>
              <div className="mt-1 uppercase" style={{ fontSize: "clamp(8px, 1.5vw, 12px)", color: "#aaa", letterSpacing: 1 }}>
                {c.label}
              </div>
            </div>
            {idx < cards.length - 1 && <span className="px-1.5 text-[#C2185B] font-bold pb-4">·</span>}
          </div>
        ))}
      </div>

      <button
        disabled={!active}
        onClick={() => active && navigate("/opening")}
        className={`mt-10 rounded-full font-semibold transition-all duration-1000 btn-responsive ${
          active
            ? "text-white pulse-glow"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
        style={
          active
            ? { background: "linear-gradient(135deg, #FF6B9D, #C2185B)" }
            : {}
        }
      >
        {active ? "Saatnya Dibuka! ✨" : "Buka Hadiah 🎁"}
      </button>

      {/* Sultan corner */}
      {!celebrate && !showSplash && (
        <div className="fixed bottom-6 right-4 z-20 flex items-end gap-2">
          <div style={{ marginBottom: 60 }}>
            <SpeechBubble>Sabar ya, rahasianya masih disimpan rapat! 🐱</SpeechBubble>
          </div>
          <SultanMascot size="md" emotion="happy" />
        </div>
      )}

      {/* Midnight celebration */}
      {celebrate && !showSplash && (
        <div className="fixed inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          <SultanMascot size="xl" emotion="celebrating" />
          <div className="mt-3">
            <SpeechBubble>SELAMAT ULANG TAHUN SAYANGKU!! 🎂🎉</SpeechBubble>
          </div>
        </div>
      )}
      <ConfettiEffect active={celebrate} duration={7000} count={80} />
    </div>
  );
}
