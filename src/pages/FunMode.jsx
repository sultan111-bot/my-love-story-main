import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SultanMascot from "../components/SultanMascot.jsx";
import SpeechBubble from "../components/SpeechBubble.jsx";
import ConfettiEffect from "../components/ConfettiEffect.jsx";
import { useShakeDetection } from "../hooks/useShakeDetection.js";
import GameModal from "../modals/GameModal.jsx";
import MemoryMatch from "../games/MemoryMatch.jsx";
import PuzzleSlider from "../games/PuzzleSlider.jsx";
import QuizGame from "../games/QuizGame.jsx";
import { useSound } from "../hooks/useSound.js";
import { useVibration } from "../hooks/useVibration.js";

  // === KONFIGURASI MOOD tracker ===
// Mudah di调整: ubah emoji, label, dan response sesuai keinginan
const moodConfig = {
  title: "Gimana Mood Kamu Tudeyyy??",
  defaultQuestion: "Tudeyy kamu gimana moodnya Bubb? Pilih yaawww",
  shakeResponse: "WUAAAAAA GILSSSS",
  moods: [
    { emoji: "😊", label: "Senang", response: "YEAYYY KM LAGI SENENGGG YAAA HEPIII HEPIII" },
    { emoji: "😔", label: "Sedih", response: "whyy sayangg, km kenapaa bubb??" },
    { emoji: "😴", label: "Ngantuk", response: "HAHAHAHAHAHA pelorr ihh kebiasaann yhh ngantukan" },
    { emoji: "😡", label: "Marah", response: "hmzzz.... marah kenapaa... takoett" },
    { emoji: "🥱", label: "Bosen", response: "boring yaa... sama ihh ak juga lagi boring, gimana klo call an?? hehe" },
    { emoji: "😐", label: "Biasa Aja", response: "yahhh nothing speciall yaaa, ywdaa dehh" }
    // Tambah mood baru di sini jika perlu
  ]
};

// === KONFIGURASI MINI GAMES ===
// Mudah di调整: ubah nama game dan emoji
const gamesConfig = {
  title: "Mini Games 🎯",
  games: [
    { id: "quiz", name: "Quiz Game", emoji: "🧠", Component: QuizGame },
    { id: "memory", name: "Memory Match", emoji: "🎴", Component: MemoryMatch },
    { id: "puzzle", name: "Puzzle Slider", emoji: "🧩", Component: PuzzleSlider }
  ]
};

function MoodDetector() {
  const [shakeState, setShakeState] = useState(null);
  const [confettiOn, setConfettiOn] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const { playCelebration } = useSound();

  useShakeDetection(() => {
    playCelebration();
    setShakeState(true);
    setConfettiOn(true);
    setTimeout(() => setConfettiOn(false), 1500);
  });  
  setTimeout(() => setShakeState(null), 2500);

  let emotion = "shy";
  let speech = moodConfig.defaultQuestion;
  
  if (shakeState) {
    emotion = "surprised";
    speech = moodConfig.shakeResponse;
  } else if (selectedMood) {
    emotion = "happy";
    speech = selectedMood.response;
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <div className="font-display text-lg mb-3" style={{ color: "var(--theme-accent)" }}>
        {moodConfig.title}
      </div>
      <div className="flex items-center gap-3 mb-4">
        <SultanMascot size="md" emotion={emotion} />
        <div className="flex-1">
          <SpeechBubble showPointer={false}>{speech}</SpeechBubble>
        </div>
      </div>
      
      {!selectedMood && (
        <div className="grid grid-cols-3 gap-2">
          {moodConfig.moods.map((mood, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedMood(mood);
                playCelebration();
                setConfettiOn(true);
                setTimeout(() => setConfettiOn(false), 1500);
              }}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-xs text-gray-600">{mood.label}</span>
            </button>
          ))}
        </div>
      )}
      
      <ConfettiEffect active={confettiOn} duration={1500} count={20} />
    </div>
  );
}

const GAMES = gamesConfig.games;

export default function FunMode() {
  const [game, setGame] = useState(null);
  const { playClick } = useSound();
  const { vibrateClick } = useVibration();

  const handleGameClick = (g) => {
    playClick();
    vibrateClick();
    setGame(g);
  };

  return (
    <div className="h-screen flex flex-col px-4 pt-4 lg:px-8 lg:pt-8">
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 lg:space-y-6 pb-20 lg:pb-8">
        <div className="max-w-4xl mx-auto w-full">
          <MoodDetector />
        </div>

        <div className="max-w-4xl mx-auto w-full">
          <div className="font-display text-lg lg:text-xl mb-2 lg:mb-4" style={{ color: "var(--theme-accent)" }}>
            {gamesConfig.title}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
            {GAMES.map((g) => (
              <div
                key={g.id}
                className="bg-white rounded-2xl p-4 lg:p-6 shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl lg:text-4xl mb-1 lg:mb-2">{g.emoji}</div>
                <div className="font-semibold text-sm lg:text-base mb-2 lg:mb-4 text-gray-800">{g.name}</div>
                <button
                  onClick={() => handleGameClick(g)}
                  className="px-4 py-1.5 lg:px-6 lg:py-2 rounded-full text-white text-xs lg:text-sm font-medium hover:scale-105 transition-transform"
                  style={{ background: "linear-gradient(135deg, #FF6B9D, #C2185B)" }}
                >
                  Main!
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {game && (
          <GameModal title={game.name} onClose={() => setGame(null)}>
            <game.Component onExit={() => setGame(null)} />
          </GameModal>
        )}
      </AnimatePresence>
    </div>
  );
}
