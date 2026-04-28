/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 400: "#9f8fff", 500: "#7c6aff", 600: "#5b4fcf", 700: "#4338b0" },
        accent:  { green: "#06d6a0", red: "#ff6b6b", yellow: "#ffd166" },
        dark:    { 900: "#0a0a14", 800: "#0f0f1e", 700: "#16162a", 600: "#1e1e35" },
      },
      fontFamily: { sans: ["Outfit", "sans-serif"], mono: ["JetBrains Mono", "monospace"] },
      backgroundImage: {
        "glass": "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
      },
    },
  },
  plugins: [],
};
