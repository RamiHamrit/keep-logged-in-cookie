// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{ejs,html}"],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // Blue for buttons
        secondary: '#4b5563', // Gray for secondary
        danger: '#dc2626', // Red for logout
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};