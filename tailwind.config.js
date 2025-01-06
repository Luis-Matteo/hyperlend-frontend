const colors = ['f7931a', '497493', '97fce0'];

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': 'url(../src/assets/img/share-img/hero-background.svg)',
      },
      spacing: {
        2.5: '0.7rem',
      },
      boxShadow: {
        custom: '0 0 15px #252525',
        bottom: '0 2px 0 0 #1D52A088',
        '3xl': '0 0 20px 10px #252525',
        '4xl': '0px 0px 40px 20px #252525',
        'inner-2xl': '0px 0px 24px 0px #FFFFFF1F inset',
        'inner-3xl': '0px -13px 36.5px 0px #CAEAE54D inset',
      },
      fontFamily: {
        lufga: ['Lufga', 'sans-serif'],
        nexa: ['Nexa', 'sans-serif'],
      },
      colors: {
        primary: '#050F0D',
        'primary-light': '#071311',
        'primary-hover': '#172422',
        secondary: '#CAEAE5',
        gray: '#4F4F4F',
        'gray-dark': '#081A16',
        'gray-light': '#D9D9D9',
        grey: '#1A1D1E',
        'grey-light': '#E1E1E1',
        success: '#2DC24E',
        warning: '#FFD542',
        error: '#FF4245',
        // tier colors
        bronze: '#D7B68E',
        nova: '#DFE7EA',
        guardian: '#AEEAB9',
        eagle: '#A7CFF8',
        elite: '#FF4430'

      },
      blur: {
        xs: '2px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  safelist: colors.map((e) => `to-[#${e}40]`),
  plugins: [require('tailwindcss-animate')],
};
