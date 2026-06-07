export default function SpeechBubble({ children, className = "", side = "left", style = {}, showPointer = true }) {
  return (
    <div
      className={`relative inline-block bg-white rounded-2xl px-3 py-2 shadow-md text-sm text-gray-700 ${className}`}
      style={style}
    >
      {children}
      {showPointer && (
        <span
          className="absolute w-3 h-3 bg-white rotate-45"
          style={{
            bottom: -5,
            [side === "left" ? "left" : "right"]: 16,
            boxShadow: "2px 2px 4px rgba(0,0,0,0.05)",
          }}
        />
      )}
    </div>
  );
}
