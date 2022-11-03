/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      gridTemplateColumns: {
        responsive: "repeat(auto-fill,minmax(240px,1fr))",
      },
      colors: {
        "custom-light-dark": "#27292a",
        "custom-black": "#18191a",
        "dark-gray": "#333",
      },
    },
  },
  plugins: [],
};
