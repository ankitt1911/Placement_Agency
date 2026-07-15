/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a"
        },
        portal: {
          canvas: "#f5f7fb",
          border: "#dfe6ef",
          ink: "#26395b",
          muted: "#7586a2",
          blush: "#ffe8ec",
          blushBorder: "#ffd3db",
          pink: "#ff1f5f",
          lavender: "#f0ebff",
          purple: "#8159f5",
          mint: "#dbeafe",
          teal: "#2563eb",
          sky: "#eff6ff",
          amber: "#fff5d8",
          orange: "#ff9f1c"
        }
      }
    }
  },
  plugins: []
};
