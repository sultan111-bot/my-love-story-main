import { createContext, useContext, useEffect, useState } from "react";

const THEMES = {
  pink: { bg: "#FFE4EC", petal: "rgba(255, 182, 193, 0.7)", accent: "#C2185B", soft: "#FFB6C1" },
  blue: { bg: "#E4F0FF", petal: "rgba(180, 210, 255, 0.7)", accent: "#1565C0", soft: "#B3D4FF" },
  yellow: { bg: "#FFFBE4", petal: "rgba(255, 235, 180, 0.8)", accent: "#C28F18", soft: "#FFE9A8" },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "pink";
    return localStorage.getItem("hbd-theme") || "pink";
  });

  useEffect(() => {
    const t = THEMES[theme] || THEMES.pink;
    document.documentElement.style.setProperty("--theme-bg", t.bg);
    document.documentElement.style.setProperty("--theme-petal", t.petal);
    document.documentElement.style.setProperty("--theme-accent", t.accent);
    document.documentElement.style.setProperty("--theme-accent-soft", t.soft);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t.bg);
    localStorage.setItem("hbd-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES, current: THEMES[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export { THEMES };
