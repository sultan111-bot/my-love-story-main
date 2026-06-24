import { useEffect, useMemo, useState } from "react";
import SultanMascot from "../components/SultanMascot.jsx";
import ConfettiEffect from "../components/ConfettiEffect.jsx";
import { getRandomPhoto } from "../constants/photos.js";

// 0 represents the empty space.
const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0];

function isSolvable(arr) {
  // For 3x3 (odd width), solvable iff inversion count is even.
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
    <div>
      <ConfettiEffect active={solved} duration={4000} count={50} />
      <div className="text-center text-xs sm:text-base md:text-lg lg:text-xl mb-3 sm:mb-4 md:mb-5">Langkah: <b>{moves}</b></div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5 max-w-[220px] sm:max-w-sm md:max-w-md lg:max-w-2xl mx-auto">
        {tiles.map((v, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            disabled={v === 0}
            className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden transition-all"
            style={{
              background: v === 0 ? "transparent" : "white",
              boxShadow: v === 0 ? "none" : solved ? "0 0 0 3px #6BCB77" : "0 4px 12px rgba(0,0,0,0.12)",
              transitionDuration: "0.15s",
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
        <div className="text-center mt-5 sm:mt-7 md:mt-10">
          <SultanMascot size="md" emotion="celebrating" className="mx-auto sm:hidden" />
          <SultanMascot size="lg" emotion="celebrating" className="mx-auto hidden sm:block md:hidden" />
          <SultanMascot size="xl" emotion="celebrating" className="mx-auto hidden md:block lg:block" />
          <div className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-2 sm:mt-3 md:mt-5" style={{ color: "var(--theme-accent)" }}>
            Selamat! 🎉
          </div>
        </div>
      )}

      <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 md:mt-10 mb-2">
        <button
          onClick={() => {
            setPuzzleImage(getRandomPhoto());
            setTiles(shuffleSolvable());
            setMoves(0);
          }}
          className="px-5 sm:px-7 md:px-10 py-2.5 sm:py-3.5 md:py-4 rounded-full text-white text-sm sm:text-base md:text-lg lg:text-xl"
          style={{ background: "linear-gradient(135deg,#FF6B9D,#C2185B)" }}
        >
          Acak Lagi
        </button>
        <button onClick={onExit} className="px-5 sm:px-7 md:px-10 py-2.5 sm:py-3.5 md:py-4 rounded-full bg-gray-200 text-sm sm:text-base md:text-lg lg:text-xl">Keluar</button>
      </div>
    </div>
  );
}
