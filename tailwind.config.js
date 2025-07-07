/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F57C00',
          light: '#FF9800',
          dark: '#E65100',
        },
      },
    },
  },
  plugins: [],
};