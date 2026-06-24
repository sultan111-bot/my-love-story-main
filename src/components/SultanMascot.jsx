import { useMemo } from "react";

const SIZE_MAP = { sm: 40, md: 80, lg: 140, xl: 200 };

/**
 * Si Sultan — chibi orange cat, pure SVG.
 * Props: emotion, size ('sm'|'md'|'lg'|'xl'), className
 */
export default function SultanMascot({
  emotion = "idle",
  size = "md",
  className = "",
  style = {},
}) {
  const px = SIZE_MAP[size] || SIZE_MAP.md;
  const idleClass = emotion === "idle" ? "sultan-float" : "";
  const spinClass = emotion === "excited" ? "spin-once" : "";

  // Eyes per emotion
  const eyes = useMemo(() => renderEyes(emotion), [emotion]);
  const mouth = useMemo(() => renderMouth(emotion), [emotion]);
  const blush = ["happy", "shy", "celebrating", "hug"].includes(emotion);

  return (
    <div
      className={`relative inline-block ${idleClass} ${spinClass} ${className}`}
      style={{ width: px, height: px, ...style }}
      aria-label={`Sultan ${emotion}`}
    >
      {/* Floating decorations */}
      {emotion === "surprised" && (
        <div
          className="absolute font-bold"
          style={{ top: -px * 0.18, left: "50%", transform: "translateX(-50%)", color: "#FF6B6B", fontSize: px * 0.28 }}
        >
          !
        </div>
      )}
      {emotion === "worried" && (
        <div className="absolute" style={{ top: px * 0.05, right: px * 0.05, fontSize: px * 0.18 }}>💧</div>
      )}
      {emotion === "excited" && (
        <>
          <div className="absolute" style={{ top: 0, left: 0, fontSize: px * 0.22 }}>✨</div>
          <div className="absolute" style={{ top: px * 0.05, right: 0, fontSize: px * 0.18 }}>✨</div>
          <div className="absolute" style={{ bottom: 0, left: px * 0.1, fontSize: px * 0.18 }}>✨</div>
        </>
      )}
      {emotion === "celebrating" && (
        <>
          <div className="absolute" style={{ top: -px * 0.1, left: "10%", fontSize: px * 0.2 }}>🎊</div>
          <div className="absolute" style={{ top: -px * 0.1, right: "10%", fontSize: px * 0.2 }}>🎉</div>
        </>
      )}
      {emotion === "sad" && (
        <div className="absolute" style={{ top: px * 0.32, left: px * 0.22, fontSize: px * 0.12 }}>💧</div>
      )}

      <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: "visible" }}>
        {/* Tail */}
        <g
          className={
            emotion === "happy" || emotion === "celebrating"
              ? "tail-wag"
              : emotion === "smug"
              ? "tail-flick"
              : ""
          }
          style={{ transformOrigin: "60px 145px" }}
        >
          <path
            d={
              emotion === "sad"
                ? "M60 150 Q 30 180 25 195"
                : "M60 150 Q 20 130 15 90"
            }
            stroke="#FF8C42"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Body */}
        <ellipse cx="100" cy="135" rx="48" ry="42" fill="#FF8C42" />
        {/* Belly */}
        <ellipse cx="100" cy="148" rx="30" ry="24" fill="#FFB347" />

        {/* Legs */}
        <ellipse cx="78" cy="172" rx="12" ry="10" fill="#FF8C42" />
        <ellipse cx="122" cy="172" rx="12" ry="10" fill="#FF8C42" />

        {/* Arms (paws) */}
        {emotion === "hug" ? (
          <>
            <ellipse cx="50" cy="125" rx="14" ry="10" fill="#FF8C42" transform="rotate(-30 50 125)" />
            <ellipse cx="150" cy="125" rx="14" ry="10" fill="#FF8C42" transform="rotate(30 150 125)" />
          </>
        ) : emotion === "celebrating" || emotion === "excited" ? (
          <>
            <ellipse cx="60" cy="100" rx="10" ry="14" fill="#FF8C42" />
            <ellipse cx="140" cy="100" rx="10" ry="14" fill="#FF8C42" />
          </>
        ) : (
          <>
            <ellipse cx="65" cy="145" rx="10" ry="12" fill="#FF8C42" />
            <ellipse cx="135" cy="145" rx="10" ry="12" fill="#FF8C42" />
          </>
        )}

        {/* Head */}
        <g>
          {/* Ears */}
          <polygon points="55,55 70,20 90,55" fill="#FF8C42" />
          <polygon points="60,52 72,32 85,52" fill="#FFFFFF" />
          <polygon points="145,55 130,20 110,55" fill="#FF8C42" />
          <polygon points="140,52 128,32 115,52" fill="#FFFFFF" />

          {/* Face */}
          <ellipse cx="100" cy="75" rx="48" ry="42" fill="#FF8C42" />

          {/* Inner face lighter */}
          <ellipse cx="100" cy="85" rx="32" ry="24" fill="#FFB347" opacity="0.6" />

          {/* Eyes */}
          {eyes}

          {/* Blush */}
          {blush && (
            <>
              <circle cx="68" cy="92" r="6" fill="#FF6B9D" opacity="0.55" />
              <circle cx="132" cy="92" r="6" fill="#FF6B9D" opacity="0.55" />
            </>
          )}

          {/* Nose */}
          <path d="M96 88 L100 92 L104 88 Z" fill="#3B1F0F" />

          {/* Mouth */}
          {mouth}

          {/* Whiskers */}
          <line x1="55" y1="92" x2="35" y2="88" stroke="#3B1F0F" strokeWidth="1.5" />
          <line x1="55" y1="98" x2="35" y2="100" stroke="#3B1F0F" strokeWidth="1.5" />
          <line x1="145" y1="92" x2="165" y2="88" stroke="#3B1F0F" strokeWidth="1.5" />
          <line x1="145" y1="98" x2="165" y2="100" stroke="#3B1F0F" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function renderEyes(emotion) {
  switch (emotion) {
    case "happy":
      return (
        <>
          <path d="M75 78 Q 82 70 89 78" stroke="#3B1F0F" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M111 78 Q 118 70 125 78" stroke="#3B1F0F" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    case "surprised":
      return (
        <>
          <circle cx="82" cy="78" r="8" fill="#FFFFFF" stroke="#3B1F0F" strokeWidth="2" />
          <circle cx="82" cy="78" r="3" fill="#3B1F0F" />
          <circle cx="118" cy="78" r="8" fill="#FFFFFF" stroke="#3B1F0F" strokeWidth="2" />
          <circle cx="118" cy="78" r="3" fill="#3B1F0F" />
        </>
      );
    case "worried":
      return (
        <>
          <path d="M75 80 Q 82 86 89 80" stroke="#3B1F0F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M111 80 Q 118 86 125 80" stroke="#3B1F0F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      );
    case "shy":
      return (
        <>
          <path d="M75 78 Q 82 72 89 78" stroke="#3B1F0F" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M111 78 Q 118 72 125 78" stroke="#3B1F0F" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    case "smug":
      return (
        <>
          <path d="M74 78 L 90 78" stroke="#3B1F0F" strokeWidth="3" strokeLinecap="round" />
          <path d="M110 78 L 126 78" stroke="#3B1F0F" strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case "sad":
      return (
        <>
          <text x="74" y="84" fill="#3B1F0F" fontSize="16" fontWeight="bold">T</text>
          <text x="112" y="84" fill="#3B1F0F" fontSize="16" fontWeight="bold">T</text>
        </>
      );
    case "hug":
      return (
        <>
          <text x="74" y="84" fontSize="16">❤</text>
          <text x="112" y="84" fontSize="16">❤</text>
        </>
      );
    case "celebrating":
    case "excited":
      return (
        <>
          <path d="M75 78 Q 82 70 89 78" stroke="#3B1F0F" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M111 78 Q 118 70 125 78" stroke="#3B1F0F" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    case "idle":
    default:
      return (
        <>
          <ellipse cx="82" cy="78" rx="5" ry="6" fill="#3B1F0F" />
          <ellipse cx="118" cy="78" rx="5" ry="6" fill="#3B1F0F" />
          <circle cx="84" cy="76" r="1.5" fill="#FFFFFF" />
          <circle cx="120" cy="76" r="1.5" fill="#FFFFFF" />
        </>
      );
  }
}

function renderMouth(emotion) {
  switch (emotion) {
    case "happy":
    case "hug":
    case "celebrating":
      return <path d="M92 100 Q 100 110 108 100" stroke="#3B1F0F" strokeWidth="2" fill="none" strokeLinecap="round" />;
    case "excited":
      return <ellipse cx="100" cy="103" rx="6" ry="5" fill="#3B1F0F" />;
    case "surprised":
      return <ellipse cx="100" cy="103" rx="4" ry="5" fill="#3B1F0F" />;
    case "smug":
      return <path d="M94 100 Q 102 106 110 98" stroke="#3B1F0F" strokeWidth="2" fill="none" strokeLinecap="round" />;
    case "worried":
      return <path d="M92 104 Q 100 98 108 104" stroke="#3B1F0F" strokeWidth="2" fill="none" strokeLinecap="round" />;
    case "sad":
      return <path d="M92 106 Q 100 100 108 106" stroke="#3B1F0F" strokeWidth="2" fill="none" strokeLinecap="round" />;
    case "shy":
      return <path d="M94 102 Q 100 106 106 102" stroke="#3B1F0F" strokeWidth="2" fill="none" strokeLinecap="round" />;
    case "idle":
    default:
      return <path d="M94 100 Q 100 104 106 100" stroke="#3B1F0F" strokeWidth="2" fill="none" strokeLinecap="round" />;
  }
}
