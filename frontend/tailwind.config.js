/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#E5C158',
          500: '#D4AF37',
          600: '#C59A77',
          700: '#B38761',
          800: '#8C6643',
        },
        roseGold: {
          300: '#F0D5C3',
          400: '#E2B89D',
          500: '#C59A77',
          600: '#A97C5B',
        },
        dark: {
          950: '#0B0B0D',
          900: '#121215',
          850: '#18181C',
          800: '#222228',
          700: '#2D2D36',
          600: '#3F3F4C',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(197, 154, 119, 0.35)',
        'gold-sm': '0 0 10px rgba(197, 154, 119, 0.2)',
      }
    },
  },
  plugins: [],
};
