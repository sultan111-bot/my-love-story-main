import { useEffect, useMemo, useState } from "react";
import SultanMascot from "../components/SultanMascot.jsx";
import ConfettiEffect from "../components/ConfettiEffect.jsx";
import { getRandomPhoto } from "../constants/photos.js";

const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0];

function isSolvable(arr) {
  const a = arr.filter((x) => x !== 0);
  let inv = 0;
  for (let i = 0; i < a.length; i++)
    for (let j = i + 1; j < a.length; j++) if (a[i] > a[j]) inv++;
  return inv % 2 === 0;
}

function shuffleSolvable() {
  while (true) {
    const a = SOLVED.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    if (isSolvable(a) && a.some((v, i) => v !== SOLVED[i])) return a;
  }
}

export default function PuzzleSlider({ onExit }) {
  const [puzzleImage, setPuzzleImage] = useState(() => getRandomPhoto());
  const [tiles, setTiles] = useState(shuffleSolvable);
  const [moves, setMoves] = useState(0);

  const solved = useMemo(() => tiles.every((v, i) => v === SOLVED[i]), [tiles]);

  const tap = (i) => {
    if (solved) return;
    const empty = tiles.indexOf(0);
    const er = Math.floor(empty / 3), ec = empty % 3;
    const r = Math.floor(i / 3), c = i % 3;
    if ((r === er && Math.abs(c - ec) === 1) || (c === ec && Math.abs(r - er) === 1)) {
      const next = tiles.slice();
      [next[empty], next[i]] = [next[i], next[empty]];
      setTiles(next);
      setMoves((m) => m + 1);
    }
  };

  return (
    <div className="w-full">
      <ConfettiEffect active={solved} duration={4000} count={50} />
      <div
        className="text-center mb-4"
        style={{ fontSize: "clamp(12px, 3vw, 22px)" }}
      >
        Langkah: <b>{moves}</b>
      </div>
      <div
        className="grid grid-cols-3 mx-auto"
        style={{
          gap: "clamp(4px, 1.2vw, 18px)",
          maxWidth: "clamp(220px, 94vw, 600px)"
        }}
      >
        {tiles.map((v, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            disabled={v === 0}
            className="aspect-square overflow-hidden transition-all border-0 p-0 cursor-pointer"
            style={{
              borderRadius: "clamp(8px, 2vw, 24px)",
              background: v === 0 ? "transparent" : "white",
              boxShadow: v === 0 ? "none" : solved ? "0 0 0 4px #6BCB77" : "0 4px 12px rgba(0,0,0,0.12)",
              transitionDuration: "0.15s"
            }}
          >
            {v !== 0 && (
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${puzzleImage})`,
                  backgroundSize: "300% 300%",
                  backgroundPosition: `${((v - 1) % 3) * 50}% ${Math.floor((v - 1) / 3) * 50}%`
                }}
              />
            )}
          </button>
        ))}
      </div>

      {solved && (
        <div className="text-center mt-6">
          <SultanMascot size="md" emotion="celebrating" className="mx-auto sm:hidden" />
          <SultanMascot size="lg" emotion="celebrating" className="mx-auto hidden sm:block md:hidden" />
          <SultanMascot size="xl" emotion="celebrating" className="mx-auto hidden md:block lg:block" />
          <h3
            className="font-display mt-3 mb-0"
            style={{
              color: "var(--theme-accent)",
              fontSize: "clamp(18px, 4.5vw, 52px)"
            }}
          >
            Selamat! 🎉
          </h3>
        </div>
      )}

      <div className="flex justify-center mt-6 flex-wrap" style={{ gap: "clamp(10px, 2vw, 32px)" }}>
        <button
          onClick={() => {
            setPuzzleImage(getRandomPhoto());
            setTiles(shuffleSolvable());
            setMoves(0);
          }}
          className="rounded-full text-white cursor-pointer border-0"
          style={{
            padding: "clamp(10px, 2.5vw, 24px) clamp(16px, 4vw, 48px)",
            fontSize: "clamp(12px, 2.8vw, 24px)",
            background: "linear-gradient(135deg,#FF6B9D,#C2185B)"
          }}
        >
          Acak Lagi
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
