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
      <div className="text-center py-8">
        <ConfettiEffect active duration={4000} count={50} />
        <SultanMascot size="xl" emotion="celebrating" className="mx-auto" />
        <div className="font-display text-2xl mt-4" style={{ color: "var(--theme-accent)" }}>
          Hebat! 🎉
        </div>
        <div className="text-base mt-2 text-gray-700">
          {moves} langkah dalam {seconds}s
        </div>
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={() => {
              const newPhotos = getShuffledPhotos(8);
              setPhotoPairs([...newPhotos, ...newPhotos]);
              setCards(shuffle([...newPhotos, ...newPhotos]).map((photoUrl, i) => ({ id: i, photoUrl, flipped: false, matched: false })));
              setPicks([]); setMoves(0); setDoneTime(null);
            }}
            className="px-5 py-2 rounded-full text-white text-sm"
            style={{ background: "linear-gradient(135deg,#FF6B9D,#C2185B)" }}
          >
            Main Lagi
          </button>
          <button onClick={onExit} className="px-5 py-2 rounded-full bg-gray-200 text-sm">Keluar</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-4 text-sm">
        <span>Langkah: <b>{moves}</b></span>
        <span>Waktu: <b>{seconds}s</b></span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((c, i) => (
          <button
            key={c.id}
            onClick={() => tap(i)}
            className="aspect-square flip-card relative"
            disabled={c.matched}
          >
            <div className={`flip-inner ${c.flipped || c.matched ? "flipped" : ""}`}>
              <div
                className="flip-face front rounded-xl flex items-center justify-center text-2xl text-white font-bold"
                style={{ background: "linear-gradient(135deg,#FFB6C1,#FF6B9D)" }}
              >?</div>
              <div
                className="flip-face back rounded-xl overflow-hidden"
                style={{ boxShadow: c.matched ? "0 0 0 3px #6BCB77" : "0 2px 8px rgba(0,0,0,0.1)" }}
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
