/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wimbledonPurple: '#60269E',
        wimbledonGreen: '#009B5A',
      },
    },
  },
  plugins: [],
};
