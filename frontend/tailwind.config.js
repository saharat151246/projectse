/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00C853",
        accent: "#FFB300",
        danger: "#FF3D00",
      },
    },
  },
  plugins: [],
}