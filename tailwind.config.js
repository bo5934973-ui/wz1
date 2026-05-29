/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Segoe UI",
          "sans-serif"
        ]
      },
      colors: {
        ink: "#161616",
        mute: "#6e6e73",
        paper: "#f5f5f7",
        line: "#d8d8de"
      },
      boxShadow: {
        soft: "0 28px 90px rgba(20, 20, 25, 0.10)",
        hairline: "inset 0 0 0 1px rgba(255,255,255,0.55)"
      }
    }
  },
  plugins: []
};
