import { useMusic } from "../context/MusicContext.jsx";

/** Floating music controller (alternative to navbar toggle). Currently navbar handles the toggle. */
export default function MusicPlayer() {
  const { playing, toggle } = useMusic();
  return (
    <button
      onClick={toggle}
      className="fixed top-3 right-3 z-50 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow flex items-center justify-center text-base"
      aria-label="Toggle music"
    >
      {playing ? "🎵" : "🔇"}
    </button>
  );
}
