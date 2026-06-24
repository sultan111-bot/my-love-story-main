import { useNavigate, useLocation } from "react-router-dom";
import { useMusic } from "../context/MusicContext.jsx";
import SultanMascot from "./SultanMascot.jsx";
import { useEffect, useState } from "react";
import { useSound } from "../hooks/useSound.js";
import { useVibration } from "../hooks/useVibration.js";
import { motion } from "framer-motion";

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
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 lg:top-0 lg:bottom-auto desktop-navbar"
    >
      <div className="navbar-inner">
        {ITEMS.map((it, index) => {
          const active = location.pathname === it.path;
          return (
            <motion.button
              key={it.path}
              onClick={() => handleNavigate(it.path)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative flex flex-col items-center justify-center flex-1 gap-1 py-2 lg:gap-2"
              aria-label={it.label}
            >
              <motion.span
                animate={active ? { y: -3 } : { y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-xl sm:text-2xl lg:text-3xl"
                style={{
                  filter: active ? "drop-shadow(0 0 8px rgba(194,24,91,0.4))" : "grayscale(0.2)",
                }}
              >
                {it.icon}
              </motion.span>
              <motion.span
                className="text-[10px] sm:text-[11px] lg:text-xs font-semibold"
                style={{
                  color: active ? "var(--theme-accent)" : "#888",
                  fontWeight: active ? 700 : 50,
                }}
              >
                {it.label}
              </motion.span>
              {active && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute -bottom-1 w-8 h-1 rounded-full"
                  style={{ background: "var(--theme-accent)" }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </motion.button>
          );
        })}

        <motion.button
          onClick={() => {
            toggle();
            playClick();
            vibrateClick();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center justify-center flex-1 gap-1 py-2 lg:gap-2"
          aria-label={playing ? "Pause music" : "Play music"}
        >
          <motion.span
            animate={playing ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.5, repeat: playing ? Infinity : 0, repeatDelay: 2 }}
            className="text-xl sm:text-2xl lg:text-3xl"
          >
            {playing ? "🎵" : "🔇"}
          </motion.span>
          <span className="text-[10px] sm:text-[11px] lg:text-xs font-semibold text-gray-500">
            Musik
          </span>
        </motion.button>

        <motion.button
          onClick={handleSecretTrigger}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative flex items-end justify-center flex-1"
          aria-label="?"
        >
          <motion.div
            animate={{
              y: [0, -4, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <SultanMascot size="sm" emotion="idle" className="ear-wiggle" />
            {sparkle && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.8, 1] }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -top-1 -right-1 text-base sparkle-blink"
              >
                ✨
              </motion.span>
            )}
          </motion.div>
        </motion.button>
      </div>
    </motion.nav>
  );
}
