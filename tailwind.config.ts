import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm ivory whites — the canvas of the brand
        ivory: "#FCFAF5",
        cream: "#F6F1E7",
        sand: "#EFE8D8",
        // Ink + neutrals
        ink: "#1E1B16",
        charcoal: "#3A362E",
        stone: "#8A8172",
        // Metallic golds — used sparingly as the signature accent
        gold: "#B8912F",
        "gold-soft": "#C9A94A",
        "gold-deep": "#8A6D1F",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["clamp(2.75rem, 8vw, 6rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        display: ["clamp(2rem, 5vw, 3.5rem)", { lineHeight: "1.08", letterSpacing: "-0.01em" }],
      },
      letterSpacing: {
        luxe: "0.22em",
      },
      spacing: {
        gutter: "clamp(1.25rem, 5vw, 5rem)",
      },
      maxWidth: {
        editorial: "84rem",
      },
      backgroundImage: {
        "gold-sheen":
          "linear-gradient(100deg, #8A6D1F 0%, #C9A94A 35%, #F0DFA8 50%, #C9A94A 65%, #8A6D1F 100%)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
