/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent_steel: "RGB(137, 168, 178)",
        accent_sky: "#B3C8CF",
        primary_sand: "#E5E1DA",
        primary_ivory: "#F1F0E8",
        primary_charcoal: "#2A2A2A",
      },
      fontFamily: {
        geist: ["Geist Mono", "sans-serif"],
        nunito: ["Nunito Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
