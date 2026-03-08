/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        whiskey: {
          dark: '#1a0a00',
          DEFAULT: '#c8973a',
          light: '#e8d5b0',
        },
      },
    },
  },
  plugins: [],
};
