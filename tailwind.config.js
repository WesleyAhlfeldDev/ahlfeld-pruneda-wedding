/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cinzel"', 'Georgia', 'serif'],
        sans: ['"Nunito"', 'sans-serif'],
      },
      colors: {
        // Forest greens — for success/check states
        sage: {
          100: '#0f2010',
          200: '#1a3a1a',
          300: '#2d5a2d',
          400: '#4a8a4a',
          500: '#6ab56a',
          600: '#90d090',
        },
        // Twilight purples — main brand color (light values = readable text, dark = backgrounds)
        plum: {
          50:  '#f0ebff',  // very light lavender — primary text on dark bg
          100: '#ddd0ff',  // light lavender
          200: '#c4aaff',  // medium lavender
          300: '#a882e8',  // soft purple
          400: '#8a60cc',  // medium purple
          500: '#6e44aa',  // main brand purple
          600: '#5a3490',  // deeper purple
          700: '#3d2260',  // dark purple
          800: '#261540',  // very dark purple
          900: '#150d28',  // near black purple
        },
        // Moon silver — secondary text
        moon: {
          100: '#e8edf5',
          200: '#c8d4e8',
          300: '#a0b0cc',
          400: '#7888a8',
          500: '#505e7a',
          600: '#323c55',
          700: '#1e2538',
          800: '#131820',
        },
        // Dark backgrounds
        forest: {
          300: '#2a3245',
          400: '#1e2638',
          500: '#161d2e',
          600: '#111622',
          700: '#0c1018',
          800: '#080c12',
        },
        // Amber/gold accents
        blush: {
          50:  '#fff4e0',
          100: '#ffe0b0',
          200: '#ffc870',
          300: '#e8a840',
          400: '#c88820',
          500: '#a86800',
          600: '#6a4000',
        },
        cream: '#0c1018',
        parchment: '#161d2e',
      },
    },
  },
  plugins: [],
}
