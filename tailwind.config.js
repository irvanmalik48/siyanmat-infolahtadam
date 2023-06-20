/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        celtic: {
          50: "#edfaeb",
          100: "#d4f4d3",
          200: "#adebab",
          300: "#7bdc7a",
          400: "#50cb51",
          500: "#32b035",
          600: "#248c28",
          700: "#206b24",
          800: "#1e5622",
          900: "#183b1b",
          950: "#0b280e",
        },
        supernova: {
          50: "#fffee7",
          100: "#fffcc1",
          200: "#fff686",
          300: "#ffe941",
          400: "#ffd70d",
          500: "#ffc700",
          600: "#d19100",
          700: "#a66702",
          800: "#89500a",
          900: "#74410f",
          950: "#442204",
        },
      },
    },
  },
  plugins: [],
  important: true,
};
