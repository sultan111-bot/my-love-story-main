import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { audioManager } from "./utils/audio.js";
import { db } from "./utils/database.js"; 
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { MusicProvider } from "./context/MusicContext.jsx";
import FloatingPetals from "./components/FloatingPetals.jsx";
import Navbar from "./components/Navbar.jsx";
import SultanMascot from "./components/SultanMascot.jsx";
import { usePWARegister } from "./utils/pwa-register.jsx";
import Opening from "./pages/Opening.jsx";
import Home from "./pages/Home.jsx";
import FunMode from "./pages/FunMode.jsx";
import EmotionalCore from "./pages/EmotionalCore.jsx";
import SecretPage from "./pages/SecretPage.jsx";
import DatePickerPage from "./pages/DatePickerPage.jsx";

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

function Layout() {
  usePWARegister();  

  useEffect(() => {
    audioManager.init();
    console.log('✅ Audio manager initialized (manual only)');
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
    <div className="relative h-screen" style={{ background: "var(--theme-bg)" }}>
      <FloatingPetals />

      <div className="relative z-10 h-full">
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
      </div>

      {showNav && (
        <Navbar
          onSecretTrigger={() => {
            if (location.pathname === "/secret") return;
            setSecretIntro(true);
          }}
        />
      )}

      {secretIntro && (
        <div 
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 cursor-pointer"
          onClick={() => {
            setSecretIntro(false);
            navigate("/secret");
          }}
        >
          <div className="text-center text-white">
            <div className="mb-4">
              <div style={{
                animation: "spin 1s ease-in-out infinite",
                display: "inline-block"
              }}>
                <SultanMascot size="xl" emotion="excited" />
              </div>
            </div>
            <p className="text-xl font-bold">Km nemu secret page!</p>
            <p className="text-sm opacity-75 mt-2">Klik anywhere untuk buka...</p>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg) scale(1); }
              50% { transform: rotate(180deg) scale(1.1); }
              100% { transform: rotate(360deg) scale(1); }
            }
          `}</style>
        </div>
      )}
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
