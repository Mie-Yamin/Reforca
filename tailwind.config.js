/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'surface-sky': '#0B2545',
        'surface-water': '#134074',
        'mid-depth': '#0A1128',
        'oceanic-deep': '#001F3F',
        'abyssal-trench': '#03071E',
        'abyssal-dark': '#050A14',
        'cyan-glow': '#00E5FF',
        'teal-mint': '#00C9A7',
        'warning-amber': '#FFB703',
        'muted-slate': '#8D99AE',
        'soft-slate': '#E0E1DD',
        'pure-white': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 25px -4px rgba(0, 229, 255, 0.45)',
        'cyan-button': '0 4px 20px -2px rgba(0, 229, 255, 0.5)',
        'teal-glow': '0 0 25px -4px rgba(0, 201, 167, 0.4)',
        'amber-glow': '0 0 25px -4px rgba(255, 183, 3, 0.4)',
      }
    },
  },
  plugins: [],
};
