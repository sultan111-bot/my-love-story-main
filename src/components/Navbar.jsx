import { useNavigate, useLocation } from "react-router-dom";
import { useMusic } from "../context/MusicContext.jsx";
import SultanMascot from "./SultanMascot.jsx";
import { useEffect, useState } from "react";
import { useSound } from "../hooks/useSound.js";
import { useVibration } from "../hooks/useVibration.js";

const ITEMS = [
  { path: "/home", icon: "🏠", label: "Home" },
  { path: "/fun", icon: "🎮", label: "Fun" },
  { path: "/surat", icon: "💌", label: "Surat" },
  { path: "/date", icon: "💑", label: "Date" },
];

export default function Navbar({ onSecretTrigger }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { playing, toggle } = useMusic();
  const [sparkle, setSparkle] = useState(false);
  const { playClick, playSuccess } = useSound();
  const { vibrateClick, vibrateSuccess } = useVibration();

  useEffect(() => {
    const id = setInterval(() => setSparkle((s) => !s), 5000);
    return () => clearInterval(id);
  }, []);

  const handleNavigate = (path) => {
    playClick();
    vibrateClick();
    navigate(path);
  };

  const handleSecretTrigger = () => {
    playSuccess();
    vibrateSuccess();
    onSecretTrigger();
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 lg:fixed lg:top-0 lg:bottom-auto desktop-navbar"
      style={{
        background: "var(--theme-bg)",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderRadius: "0 0 24px 24px",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
        height: "64px",
        paddingBottom: "env(safe-area-inset-bottom)",
        zIndex: 999999,
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        transform: "translate3d(0,0,0)",
        boxSizing: "border-box",
      }}
    >
      <div className="flex items-center justify-around h-16 px-2 lg:px-4 desktop-nav-content" style={{ height: "64px" }}>
        {ITEMS.map((it) => {
          const active = location.pathname === it.path;
          return (
            <button
              key={it.path}
              onClick={() => handleNavigate(it.path)}
              className="flex flex-col items-center justify-center flex-1 gap-0.5 py-1 lg:gap-1 lg:py-2"
              aria-label={it.label}
            >
              <span className="text-xl lg:text-2xl" style={{ filter: active ? "none" : "grayscale(0.2)" }}>{it.icon}</span>
              <span className="text-[10px] lg:text-xs font-medium" style={{ color: active ? "var(--theme-accent)" : "#888" }}>
                {it.label}
              </span>
            </button>
          );
        })}

        <button
          onClick={() => {
            toggle();
            playClick();
            vibrateClick();
          }}
          className="flex flex-col items-center justify-center flex-1 gap-0.5 py-1 lg:gap-1 lg:py-2"
          aria-label={playing ? "Pause music" : "Play music"}
        >
          <span className="text-xl lg:text-2xl">{playing ? "🎵" : "🔇"}</span>
          <span className="text-[10px] lg:text-xs font-medium text-gray-500">Musik</span>
        </button>

        {/* Sultan secret trigger */}
        <button
          onClick={handleSecretTrigger}
          className="relative flex items-end justify-center flex-1"
          aria-label="?"
          style={{ height: 64 }}
        >
          <div className="relative" style={{ transform: "translateY(-14px)" }}>
            <SultanMascot size="sm" emotion="idle" className="ear-wiggle" />
            {sparkle && (
              <span className="absolute -top-1 -right-1 text-xs sparkle-blink">✨</span>
            )}
          </div>
        </button>
      </div>
    </nav>
  );
}
