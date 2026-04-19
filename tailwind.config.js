/** @type {import('tailwindcss').Config} */
export default {
 content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      primary: "#6142b7",
      accent: "#c948d9",
    },
    fontFamily: {
      sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      display: ['Sora', 'Poppins', 'system-ui', 'sans-serif'],
    },
    animation: {
      'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      'bounce-slow': 'bounce 2s infinite',
    },
    backgroundImage: {
      'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    },
  },
},
  plugins: [],
}