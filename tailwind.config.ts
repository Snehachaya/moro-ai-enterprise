import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#020817",
        surface: "#081221",
        surfaceElevated: "#0B1628",
        borderSubtle: "rgba(148, 163, 184, 0.18)",
        accent: "#06B6D4",
        accentSoft: "rgba(6, 182, 212, 0.16)",
      },
      boxShadow: {
        glass: "0 24px 80px rgba(0, 0, 0, 0.38)",
        glow: "0 0 36px rgba(6, 182, 212, 0.18)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
