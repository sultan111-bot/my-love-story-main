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

  const tap = (i) => {
    if (picks.length >= 2) return;
    if (cards[i].flipped || cards[i].matched) return;
    const next = cards.slice();
    next[i] = { ...next[i], flipped: true };
    setCards(next);
    const newPicks = [...picks, i];
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
      <div className="text-center w-full">
        <ConfettiEffect active duration={4000} count={50} />
        <SultanMascot size="md" emotion="celebrating" className="mx-auto sm:hidden" />
        <SultanMascot size="lg" emotion="celebrating" className="mx-auto hidden sm:block md:hidden" />
        <SultanMascot size="xl" emotion="celebrating" className="mx-auto hidden md:block lg:hidden" />
        <SultanMascot size="xl" emotion="celebrating" className="mx-auto hidden lg:block" />
        <h2
          className="font-display mt-4 mb-2"
          style={{
            color: "var(--theme-accent)",
            fontSize: "clamp(18px, 4.5vw, 52px)"
          }}
        >
          Hebat! 🎉
        </h2>
        <p
          className="mt-2 text-gray-700 m-0"
          style={{ fontSize: "clamp(12px, 3vw, 24px)" }}
        >
          {moves} langkah dalam {seconds}s
        </p>
        <div className="flex justify-center mt-6 flex-wrap" style={{ gap: "clamp(10px, 2vw, 32px)" }}>
          <button
            onClick={() => {
              const newPhotos = getShuffledPhotos(8);
              setPhotoPairs([...newPhotos, ...newPhotos]);
              setCards(shuffle([...newPhotos, ...newPhotos]).map((photoUrl, i) => ({ id: i, photoUrl, flipped: false, matched: false })));
              setPicks([]); setMoves(0); setDoneTime(null);
            }}
            className="rounded-full text-white cursor-pointer border-0"
            style={{
              padding: "clamp(10px, 2.5vw, 24px) clamp(16px, 4vw, 48px)",
              fontSize: "clamp(12px, 2.8vw, 24px)",
              background: "linear-gradient(135deg,#FF6B9D,#C2185B)"
            }}
          >
            Main Lagi
          </button>
          <button
            onClick={onExit}
            className="rounded-full bg-gray-200 cursor-pointer border-0"
            style={{
              padding: "clamp(10px, 2.5vw, 24px) clamp(16px, 4vw, 48px)",
              fontSize: "clamp(12px, 2.8vw, 24px)"
            }}
          >
            Keluar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="flex justify-between mb-4"
        style={{ fontSize: "clamp(12px, 3vw, 22px)" }}
      >
        <span>Langkah: <b>{moves}</b></span>
        <span>Waktu: <b>{seconds}s</b></span>
      </div>
      <div
        className="grid grid-cols-4 mx-auto"
        style={{
          gap: "clamp(4px, 1.2vw, 16px)",
          maxWidth: "clamp(240px, 94vw, 680px)"
        }}
      >
        {cards.map((c, i) => (
          <button
            key={c.id}
            onClick={() => tap(i)}
            className="aspect-square flip-card relative border-0 p-0 cursor-pointer"
            disabled={c.matched}
          >
            <div className={`flip-inner ${c.flipped || c.matched ? "flipped" : ""}`}>
              <div
                className="flip-face front flex items-center justify-center text-white font-bold"
                style={{
                  background: "linear-gradient(135deg,#FFB6C1,#FF6B9D)",
                  borderRadius: "clamp(8px, 2vw, 24px)",
                  fontSize: "clamp(20px, 5vw, 52px)"
                }}
              >?</div>
              <div
                className="flip-face back overflow-hidden"
                style={{
                  borderRadius: "clamp(8px, 2vw, 24px)",
                  boxShadow: c.matched ? "0 0 0 4px #6BCB77" : "0 4px 12px rgba(0,0,0,0.12)"
                }}
              >
                <img
                  src={c.photoUrl}
                  alt="Memory card"
                  className="w-full h-full object-cover m-0"
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
