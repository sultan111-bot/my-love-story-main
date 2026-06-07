import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ["Lato", "system-ui", "sans-serif"],
      },
      colors: {
        rose: {
          deep: "#C2185B",
          dark: "#880E4F",
          soft: "#FFB6C1",
          bright: "#FF6B9D",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
