/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        washiBase: "#0c0d10",
        inkBlack: "#08090a",
        diluteWash: "#1f232b",
        panelBg: "#0e1014",
        riceBone: "#e6e4dd",
        crimson: "#dc2626",
        amber: "#d97706",
      },
      fontFamily: {
        serif: ['Cinzel', '"Noto Serif"', '"Playfair Display"', 'Georgia', 'serif'],
        editorial: ['"Noto Serif"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
