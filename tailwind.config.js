/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair", "serif"],
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
