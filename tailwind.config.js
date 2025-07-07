/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Work Sans', 'sans-serif'],
      },
      fontSize: {
        'xxs': '10px',
      },
      colors: {
        'disabledPrimary': '#AFAFAF',
        'primary': '#121212',
        'primary-100': '#E8F0E9',
        'primary-700': '#3E5741',
        'borderTertiary': '#EEEEEE',
        'secondary': '#F6F6F6',
        'secondary-two': "#545454",
        'borderSecondary': '#E2E2E2',
        'tertiary': '#757575',
        'default': '#4B6A4F',
        'textDark': '#463E59'
      }
    },
  },
  plugins: [],
} 