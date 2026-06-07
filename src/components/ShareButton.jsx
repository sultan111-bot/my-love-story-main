import { useState } from "react";

export default function ShareButton() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");

  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = "Ada sesuatu untukmu... 💕";

  const tryShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "A Gift For You 🎀", text, url });
        return;
      } catch {
        /* fall through */
      }
    }
    setOpen(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setToast("Copied! ✓");
      setTimeout(() => setToast(""), 1800);
      setOpen(false);
    } catch {
      setToast("Gagal menyalin");
      setTimeout(() => setToast(""), 1800);
    }
  };

  const wa = () => {
    const u = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    window.open(u, "_blank");
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={tryShare}
        className="flex items-center gap-1 bg-white/80 backdrop-blur rounded-full px-3 py-1.5 text-xs shadow-sm text-gray-600"
        aria-label="Share"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" />
        </svg>
        Share
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl p-4 w-full max-w-xs shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="font-display text-lg mb-3" style={{ color: "var(--theme-accent)" }}>Bagikan 💌</div>
            <button onClick={wa} className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-gray-50 text-sm">📱 Kirim via WhatsApp</button>
            <button onClick={copy} className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-gray-50 text-sm">🔗 Copy Link</button>
            <button onClick={() => setOpen(false)} className="w-full text-center py-2 mt-2 text-xs text-gray-400">Batal</button>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] bg-black/80 text-white text-xs px-4 py-2 rounded-full shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
