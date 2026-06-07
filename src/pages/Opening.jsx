import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMusic } from "../context/MusicContext.jsx";

export default function Opening() {
  const navigate = useNavigate();
  const { fadeIn } = useMusic();

  useEffect(() => {
    const t1 = setTimeout(() => fadeIn(2000), 4000);
    const t2 = setTimeout(() => navigate("/home"), 4500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [fadeIn, navigate]);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ perspective: 1000, background: "#1a0a14" }}
    >
      {/* Glow background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, #FFE4EC 0%, #FFB6C1 35%, white 70%)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.8, 0.8, 1.2, 1, 3] }}
        transition={{ duration: 2.8, times: [0, 0.65, 0.75, 0.85, 1], ease: "easeInOut" }}
      />

      {/* Left gate */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2"
        style={{
          background:
            "linear-gradient(135deg, #4a2818 0%, #2b1408 40%, #4a2818 70%, #2b1408 100%)",
          borderRight: "4px solid #b8860b",
          boxShadow: "inset -8px 0 16px rgba(0,0,0,0.5)",
          transformOrigin: "left center",
        }}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: -115 }}
        transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="absolute inset-3 border-2 border-yellow-700/60 rounded-md" />
        <div className="absolute inset-6 border border-yellow-600/40 rounded" />
      </motion.div>

      {/* Right gate */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2"
        style={{
          background:
            "linear-gradient(225deg, #4a2818 0%, #2b1408 40%, #4a2818 70%, #2b1408 100%)",
          borderLeft: "4px solid #b8860b",
          boxShadow: "inset 8px 0 16px rgba(0,0,0,0.5)",
          transformOrigin: "right center",
        }}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 115 }}
        transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="absolute inset-3 border-2 border-yellow-700/60 rounded-md" />
        <div className="absolute inset-6 border border-yellow-600/40 rounded" />
      </motion.div>

      {/* Welcome text */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 lg:px-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: [0, 0, 1, 1], y: [20, 20, 0, 0] }}
        transition={{ duration: 4, times: [0, 0.7, 0.85, 1] }}
        style={{ background: "white" }}
      >
        <p className="font-display italic" style={{ fontSize: "clamp(24px, 4vw, 48px)", color: "#C2185B" }}>
          Selamat Ulang Tahun
        </p>
        <p className="font-display font-bold mt-1" style={{ fontSize: "clamp(32px, 6vw, 72px)", color: "#880E4F" }}>
          SITI NUR KHOLIFAH 🎂
        </p>
        <p className="mt-4 text-[#888]" style={{ fontSize: "clamp(14px, 2vw, 24px)" }}>
          Semoga hari ini seindah kamu 💕
        </p>
      </motion.div>
    </div>
  );
}
