/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFD700", // RubberDuck Electric Yellow
        accent: "#FFD700",
        background: "#0F1115", // Deep Space Charcoal
        surface: "#1A1D23", // Midnight Slate
        border: "#2D3139",
        "text-primary": "#F3F4F6",
        "text-secondary": "#9CA3AF",
        cyber: "#00F5FF", // Cyber Cyan
      },
      fontFamily: {
        sans: ['"Inter"', "sans-serif"],
      },
      boxShadow: {
        premium: "0 0 50px rgba(0, 0, 0, 0.5)",
        "accent-lg": "0 0 20px rgba(255, 215, 0, 0.2)",
        "accent-xl": "0 0 30px rgba(255, 215, 0, 0.4)",
        "cyber-sm": "0 0 15px rgba(0, 245, 255, 0.1)",
      },
    },
  },
  plugins: [],
};
