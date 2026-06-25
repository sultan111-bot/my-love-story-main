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
    <nav className="desktop-navbar">
      <div className="navbar-inner">
        {ITEMS.map((it, index) => {
          const active = location.pathname === it.path;
          return (
            <button
              key={it.path}
              onClick={() => handleNavigate(it.path)}
              className="relative flex flex-col items-center justify-center flex-1 gap-1 py-2 lg:gap-2 transition-transform"
              style={{ transform: "scale(1)" }}
              onMouseEnter={(e) => { e.target.style.transform = "scale(1.1)" }}
              onMouseLeave={(e) => { e.target.style.transform = "scale(1)" }}
              onMouseDown={(e) => { e.target.style.transform = "scale(0.9)" }}
              onMouseUp={(e) => { e.target.style.transform = "scale(1.1)" }}
              aria-label={it.label}
            >
              <span
                className="text-xl sm:text-2xl lg:text-3xl"
                style={{
                  filter: active ? "drop-shadow(0 0 8px rgba(194,24,91,0.4))" : "grayscale(0.2)",
                  transform: active ? "translateY(-3px)" : "translateY(0)",
                  transition: "all 0.2s ease"
                }}
              >
                {it.icon}
              </span>
              <span
                className="text-[10px] sm:text-[11px] lg:text-xs font-semibold"
                style={{
                  color: active ? "var(--theme-accent)" : "#888",
                  fontWeight: active ? 700 : 50,
                }}
              >
                {it.label}
              </span>
              {active && (
                <div
                  className="absolute -bottom-1 w-8 h-1 rounded-full"
                  style={{ 
                    background: "var(--theme-accent)",
                    opacity: 1,
                    transform: "scale(1)",
                    transition: "all 0.3s ease"
                  }}
                />
              )}
            </button>
          );
        })}

        <button
          onClick={() => {
            toggle();
            playClick();
            vibrateClick();
          }}
          className="flex flex-col items-center justify-center flex-1 gap-1 py-2 lg:gap-2 transition-transform"
          style={{ transform: "scale(1)" }}
          onMouseEnter={(e) => { e.target.style.transform = "scale(1.1)" }}
          onMouseLeave={(e) => { e.target.style.transform = "scale(1)" }}
          onMouseDown={(e) => { e.target.style.transform = "scale(0.9)" }}
          onMouseUp={(e) => { e.target.style.transform = "scale(1.1)" }}
          aria-label={playing ? "Pause music" : "Play music"}
        >
          <span
            className={`text-xl sm:text-2xl lg:text-3xl ${playing ? 'animate-spin-slow' : ''}`}
            style={{ animationDuration: "2s" }}
          >
            {playing ? "🎵" : "🔇"}
          </span>
          <span className="text-[10px] sm:text-[11px] lg:text-xs font-semibold text-gray-500">
            Musik
          </span>
        </button>

        <button
          onClick={handleSecretTrigger}
          className="relative flex items-end justify-center flex-1 transition-transform"
          style={{ transform: "scale(1)" }}
          onMouseEnter={(e) => { e.target.style.transform = "scale(1.1)" }}
          onMouseLeave={(e) => { e.target.style.transform = "scale(1)" }}
          onMouseDown={(e) => { e.target.style.transform = "scale(0.9)" }}
          onMouseUp={(e) => { e.target.style.transform = "scale(1.1)" }}
          aria-label="?"
        >
          <div
            className="relative animate-bounce-slow"
            style={{ animationDuration: "2s" }}
          >
            <SultanMascot size="sm" emotion="idle" className="ear-wiggle" />
            {sparkle && (
              <span
                className="absolute -top-1 -right-1 text-base sparkle-blink"
              >
                ✨
              </span>
            )}
          </div>
        </button>
      </div>
    </nav>
  );
}
