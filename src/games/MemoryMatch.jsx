import { useEffect, useMemo, useState } from "react";
import SultanMascot from "../components/SultanMascot.jsx";
import ConfettiEffect from "../components/ConfettiEffect.jsx";
import { getShuffledPhotos } from "../constants/photos.js";

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryMatch({ onExit }) {
  const [photoPairs, setPhotoPairs] = useState(() => {
    const photos = getShuffledPhotos(8);
    return [...photos, ...photos];
  });
  const [cards, setCards] = useState(() =>
    shuffle(photoPairs).map((photoUrl, i) => ({ id: i, photoUrl, flipped: false, matched: false }))
  );
  const [picks, setPicks] = useState([]);
  const [moves, setMoves] = useState(0);
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(Date.now());
  const [doneTime, setDoneTime] = useState(null);

  useEffect(() => {
    if (doneTime) return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [doneTime]);

  const allMatched = cards.every((c) => c.matched);

  useEffect(() => {
    if (allMatched && !doneTime) setDoneTime(Date.now() - start);
  }, [allMatched, start, doneTime]);

  const tap = (idx) => {
    if (picks.length >= 2) return;
    if (cards[idx].flipped || cards[idx].matched) return;
    const next = cards.slice();
    next[idx] = { ...next[idx], flipped: true };
    setCards(next);
    const newPicks = [...picks, idx];
    setPicks(newPicks);
    if (newPicks.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newPicks;
      if (next[a].photoUrl === next[b].photoUrl) {
        setTimeout(() => {
          setCards((cs) => cs.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
          setPicks([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((cs) => cs.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c)));
          setPicks([]);
        }, 800);
      }
    }
  };

  const elapsed = doneTime ?? now - start;
  const seconds = Math.floor(elapsed / 1000);

  if (allMatched) {
    return (
      <div className="text-center py-6 sm:py-8 md:py-12 mb-2">
        <ConfettiEffect active duration={4000} count={50} />
        <SultanMascot size="md" emotion="celebrating" className="mx-auto sm:hidden" />
        <SultanMascot size="lg" emotion="celebrating" className="mx-auto hidden sm:block md:hidden" />
        <SultanMascot size="xl" emotion="celebrating" className="mx-auto hidden md:block lg:hidden" />
        <SultanMascot size="xl" emotion="celebrating" className="mx-auto hidden lg:block" />
        <div className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-4 sm:mt-5 md:mt-7" style={{ color: "var(--theme-accent)" }}>
          Hebat! 🎉
        </div>
        <div className="text-base sm:text-lg md:text-xl lg:text-2xl mt-2 sm:mt-3 md:mt-4 text-gray-700">
          {moves} langkah dalam {seconds}s
        </div>
        <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 md:mt-10">
          <button
            onClick={() => {
              const newPhotos = getShuffledPhotos(8);
              setPhotoPairs([...newPhotos, ...newPhotos]);
              setCards(shuffle([...newPhotos, ...newPhotos]).map((photoUrl, i) => ({ id: i, photoUrl, flipped: false, matched: false })));
              setPicks([]); setMoves(0); setDoneTime(null);
            }}
            className="px-5 sm:px-7 md:px-10 py-3 sm:py-4 md:py-5 rounded-full text-white text-sm sm:text-base md:text-lg lg:text-xl"
            style={{ background: "linear-gradient(135deg,#FF6B9D,#C2185B)" }}
          >
            Main Lagi
          </button>
          <button onClick={onExit} className="px-5 sm:px-7 md:px-10 py-3 sm:py-4 md:py-5 rounded-full bg-gray-200 text-sm sm:text-base md:text-lg lg:text-xl">Keluar</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm md:text-lg lg:text-xl">
        <span>Langkah: <b>{moves}</b></span>
        <span>Waktu: <b>{seconds}s</b></span>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 max-w-full sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto">
        {cards.map((c, i) => (
          <button
            key={c.id}
            onClick={() => tap(i)}
            className="aspect-square flip-card relative"
            disabled={c.matched}
          >
            <div className={`flip-inner ${c.flipped || c.matched ? "flipped" : ""}`}>
              <div
                className="flip-face front rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold"
                style={{ background: "linear-gradient(135deg,#FFB6C1,#FF6B9D)" }}
              >?</div>
              <div
                className="flip-face back rounded-xl sm:rounded-2xl overflow-hidden"
                style={{ boxShadow: c.matched ? "0 0 0 4px #6BCB77" : "0 4px 14px rgba(0,0,0,0.14)" }}
              >
                <img 
                  src={c.photoUrl} 
                  alt="Memory card" 
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
