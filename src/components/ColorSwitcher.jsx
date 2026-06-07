import { useTheme } from "../context/ThemeContext.jsx";

const ORDER = [
  { key: "pink", color: "#FFB6C1" },
  { key: "blue", color: "#B3D4FF" },
  { key: "yellow", color: "#FFE9A8" },
];

export default function ColorSwitcher({ className = "" }) {
  const { theme, setTheme } = useTheme();
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {ORDER.map((o) => (
        <button
          key={o.key}
          onClick={() => setTheme(o.key)}
          aria-label={`Theme ${o.key}`}
          className="w-5 h-5 rounded-full border-2 border-white transition-transform hover:scale-110"
          style={{
            background: o.color,
            boxShadow:
              theme === o.key
                ? "0 0 0 2px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)"
                : "0 2px 6px rgba(0,0,0,0.15)",
          }}
        />
      ))}
    </div>
  );
}
