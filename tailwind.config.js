/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0E1628",
        accent: "#00C853",
        background: "#1A1A1A",
        surface: "#242d3d", // Slightly lighter than background for cards
        "text-primary": "#F3F4F6", // Overriding branding text color for better dark mode contrast
        "text-secondary": "#9CA3AF",
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
