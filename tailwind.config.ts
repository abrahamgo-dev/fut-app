import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coal: "#0A0B0A",
        "coal-deep": "#000000",
        bone: "#F3F3EF",
        volt: "#B6FF3B",
        "volt-dim": "#83B82A",
        graphite: "#8C8C86",
        ink: "#0A0A0A",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        "grid-lines": "repeating-linear-gradient(90deg, rgba(243,243,239,0.035) 0px, rgba(243,243,239,0.035) 2px, transparent 2px, transparent 64px)",
      },
    },
  },
  plugins: [],
};

export default config;
