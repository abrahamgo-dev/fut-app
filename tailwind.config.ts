import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // rgb(var(...) / <alpha-value>) instead of flat hex so these tokens
        // can be re-pointed per color-scheme (see [data-admin-theme="light"]
        // in globals.css) without touching every className that uses them.
        coal: "rgb(var(--color-coal) / <alpha-value>)",
        "coal-deep": "rgb(var(--color-coal-deep) / <alpha-value>)",
        bone: "rgb(var(--color-bone) / <alpha-value>)",
        volt: "rgb(var(--color-volt) / <alpha-value>)",
        "volt-dim": "rgb(var(--color-volt-dim) / <alpha-value>)",
        graphite: "rgb(var(--color-graphite) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
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
