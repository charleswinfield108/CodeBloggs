/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#8D88EA",
        "primary-dark": "#6C63D9",
        "accent": "#2ED3B7",
        "cb-bg": "#F6F7FF",
        "cb-text": "#1F2340",
        "cb-border": "#E3E6F5",
      },
    },
  },
  plugins: [],
}


