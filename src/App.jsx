import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { audioManager } from "./utils/audio.js";
import { db } from "./utils/database.js"; 
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { MusicProvider } from "./context/MusicContext.jsx";
import FloatingPetals from "./components/FloatingPetals.jsx";
import Navbar from "./components/Navbar.jsx";
import { usePWARegister } from "./utils/pwa-register.jsx";
import PWAHeader from "./components/PWAHeader.jsx";
import Opening from "./pages/Opening.jsx";
import Home from "./pages/Home.jsx";
import FunMode from "./pages/FunMode.jsx";
import EmotionalCore from "./pages/EmotionalCore.jsx";
import SecretPage from "./pages/SecretPage.jsx";
import DatePickerPage from "./pages/DatePickerPage.jsx";
import SultanMascot from "./components/SultanMascot.jsx";
import SpeechBubble from "./components/SpeechBubble.jsx";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-6">
      <div>
        <div className="font-display text-3xl mb-2" style={{ color: "var(--theme-accent)" }}>404</div>
        <div className="text-sm text-gray-500">Halaman tidak ditemukan</div>
      </div>
    </div>
  );
}

function SecretIntroOverlay({ onDone }) {
  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0, y: 200 }}
        animate={{ scale: 1, y: 0, rotate: 720 }}
        transition={{ duration: 1, type: "spring", stiffness: 200, damping: 20 }}
        className="relative"
      >
        <SultanMascot size="xl" emotion="excited" />
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -60, opacity: [0, 1, 0] }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute left-1/2 -translate-x-1/2 top-10 text-3xl"
        >
          💋
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.1, 1], opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "calc(50% + 130px)" }}
      >
        <SpeechBubble>Kamu nemuin aku! Ada hadiah rahasia nih... 🎁</SpeechBubble>
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 3.5, ease: "linear" }}
        onAnimationComplete={onDone}
        className="absolute bottom-0 h-1 bg-rose-bright"
      />
    </motion.div>
  );
}

function Layout() {
  usePWARegister();  

  useEffect(() => {
    // Initialize audio manager
    audioManager.init();
    console.log('✅ Audio manager initialized');
  }, []);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        await db.init();
        console.log('✅ Database initialized');
      } catch (error) {
        console.error('❌ Database init error:', error);
      }
    };
    initDatabase();
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const [secretIntro, setSecretIntro] = useState(false);
  const noNavRoutes = ["/", "/opening"];
  const showNav = !noNavRoutes.includes(location.pathname);

  return (
    <div className="relative h-screen overflow-hidden book-perspective" style={{ background: "var(--theme-bg)", contain: 'strict' }}>
      <FloatingPetals />

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1.0] }}
          style={{ transformOrigin: "left center", transformStyle: "preserve-3d", contain: 'layout style paint' }}
          className="relative z-10"
        >
          <Routes location={location}>
            <Route path="/" element={<Opening />} />
            <Route path="/opening" element={<Opening />} />
            <Route path="/home" element={<Home />} />
            <Route path="/fun" element={<FunMode />} />
            <Route path="/surat" element={<EmotionalCore />} />
            <Route path="/secret" element={<SecretPage />} />
            <Route path="/date" element={<DatePickerPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {showNav && <div className="h-safe-nav" />}
        </motion.div>
      </AnimatePresence>

      {showNav && (
        <Navbar
          onSecretTrigger={() => {
            if (location.pathname === "/secret") return;
            setSecretIntro(true);
          }}
        />
      )}

      <AnimatePresence>
        {secretIntro && (
          <SecretIntroOverlay
            onDone={() => {
              setSecretIntro(false);
              navigate("/secret");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MusicProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </MusicProvider>
    </ThemeProvider>
  );
}
