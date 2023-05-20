/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/client/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      colors: {
        tni: {
          gold: "#FFC700",
          accented: "#2D6D32",
          dark: "#225226",
          darker: "#1A3F1D",
        },
      },
      backgroundImage: {
        camo: "url('/artwork.svg')",
      },
    },
  },
  plugins: [],
};
