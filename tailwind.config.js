/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        lufga: ['Lufga', 'sans-serif'],
      },
      colors: {
        primary: '#050F0D',
        'primary-light': '#071311',
        secondary: '#CAEAE5',
        gray: '#4F4F4F',
        grey: '#1A1D1E',
      },
    },
  },
  plugins: [],
};
