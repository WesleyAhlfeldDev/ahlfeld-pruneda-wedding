/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Marcellus"', 'Georgia', 'serif'],
        sans: ['"Nunito"', 'sans-serif'],
      },
      colors: {
        blush: {
          50: '#fdf6f0',
          100: '#faebd7',
          200: '#f5d5b8',
          300: '#edb98a',
          400: '#e09660',
          500: '#d4784a',
        },
        plum: {
          50: '#f8f4f8',
          100: '#ede0ed',
          200: '#d9bfda',
          300: '#be92bf',
          400: '#9f6aa1',
          500: '#7d4e80',
          600: '#5e3660',
          700: '#4a2a4c',
          800: '#3a2039',
          900: '#2a162a',
        },
        sage: {
          100: '#e8ede8',
          200: '#c8d5c8',
          300: '#a3b8a3',
          400: '#7d9a7d',
          500: '#5a7a5a',
        },
        cream: '#faf7f2',
        parchment: '#f5f0e8',
      },
    },
  },
  plugins: [],
}
