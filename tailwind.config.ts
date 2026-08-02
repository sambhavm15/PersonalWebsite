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
        ink: "#0E0E10",
        paper: "#F5F1E8",
        accent: "#FF4D3D",
        muted: "#8A8578",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["clamp(3rem, 10vw, 8rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        display: ["clamp(2.25rem, 6vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
      },
      spacing: {
        gutter: "clamp(1.25rem, 5vw, 5rem)",
      },
      maxWidth: {
        editorial: "84rem",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        rotateWord: {
          "0%, 20%": { transform: "translateY(0)", opacity: "1" },
          "25%, 45%": { transform: "translateY(-100%)", opacity: "0" },
          "50%, 100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
