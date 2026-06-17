/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        secondary: "#3B82F6",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        app: {
          bg: "#F8FAFC",
          ink: "#0F172A",
          muted: "#64748B",
          line: "#E2E8F0",
        },
      },
      boxShadow: {
        soft: "0 12px 34px rgba(15, 23, 42, 0.08)",
        lift: "0 18px 55px rgba(15, 23, 42, 0.12)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
