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
      <div className="text-center text-sm mb-3">Langkah: <b>{moves}</b></div>
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {tiles.map((v, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            disabled={v === 0}
            className="aspect-square rounded-xl overflow-hidden transition-all"
            style={{
              background: v === 0 ? "transparent" : "white",
              boxShadow: v === 0 ? "none" : solved ? "0 0 0 3px #6BCB77" : "0 4px 10px rgba(0,0,0,0.1)",
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
        <div className="text-center mt-6">
          <SultanMascot size="lg" emotion="celebrating" className="mx-auto" />
          <div className="font-display text-xl mt-2" style={{ color: "var(--theme-accent)" }}>
            Selamat! 🎉
          </div>
        </div>
      )}

      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={() => { 
            setPuzzleImage(getRandomPhoto());
            setTiles(shuffleSolvable()); 
            setMoves(0); 
          }}
          className="px-5 py-2 rounded-full text-white text-sm"
          style={{ background: "linear-gradient(135deg,#FF6B9D,#C2185B)" }}
        >
          Acak Lagi
        </button>
        <button onClick={onExit} className="px-5 py-2 rounded-full bg-gray-200 text-sm">Keluar</button>
      </div>
    </div>
  );
}
