/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-blue': {
          100: '#e6f7ff',
          200: '#b3e6ff',
          300: '#80d4ff',
          400: '#4dc3ff',
          500: '#1ab2ff',
          600: '#0095e6',
          700: '#0077b3',
          800: '#005980',
          900: '#003b4d',
        },
      },
    },
  },
  plugins: [],
}
