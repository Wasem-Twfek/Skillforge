/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Light mode colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Dark mode specific colors that ensure good contrast
        dark: {
          bg: {
            primary: '#121212',
            secondary: '#1e1e1e',
            tertiary: '#2d2d2d',
          },
          text: {
            primary: '#f3f4f6',
            secondary: '#d1d5db',
            muted: '#9ca3af',
          },
          border: {
            default: '#374151',
            hover: '#4b5563',
          },
        },
      },
      animation: {
        blob: "blob 7s infinite",
        blink: "blink 1s step-end infinite",
        'blob-1': 'blob1 10s ease-in-out infinite',
        'blob-2': 'blob2 8s ease-in-out infinite',
        'blob-3': 'blob3 12s ease-in-out infinite',
        'float-up': 'floatUp 5s ease-in-out infinite',
        'float-down': 'floatDown 4s ease-in-out infinite 1s',
        'scroll-down': 'scrollDown 1.5s ease-in-out infinite',
        'float-left-1': 'floatLeft 4s ease-in-out infinite',
        'float-left-2': 'floatLeft 5s ease-in-out infinite 0.1s',
        'float-left-3': 'floatLeft 6s ease-in-out infinite 0.2s',
        'float-left-4': 'floatLeft 7s ease-in-out infinite 0.3s',
        'float-left-5': 'floatLeft 8s ease-in-out infinite 0.4s',
        'float-left-6': 'floatLeft 9s ease-in-out infinite 0.5s',
        'float-right-1': 'floatRight 5s ease-in-out infinite',
        'float-right-2': 'floatRight 6s ease-in-out infinite 0.2s',
        'float-right-3': 'floatRight 7s ease-in-out infinite 0.4s',
        'float-right-4': 'floatRight 8s ease-in-out infinite 0.6s',
        'float-right-5': 'floatRight 9s ease-in-out infinite 0.8s',
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
        blob1: {
          '0%, 100%': { transform: 'translate(0px, 0px)' },
          '50%': { transform: 'translate(15px, 20px)' },
        },
        blob2: {
          '0%, 100%': { transform: 'translate(0px, 0px)' },
          '50%': { transform: 'translate(20px, -30px)' },
        },
        blob3: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        floatUp: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatDown: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(10px)' },
        },
        scrollDown: {
          '0%, 100%': { transform: 'translateY(0px)', opacity: '0.6' },
          '50%': { transform: 'translateY(6px)', opacity: '1' },
        },
        floatLeft: {
          '0%, 100%': { transform: 'translate(0px, 0px)' },
          '50%': { transform: 'translate(10px, -15px)' },
        },
        floatRight: {
          '0%, 100%': { transform: 'translate(0px, 0px)' },
          '50%': { transform: 'translate(-10px, 15px)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // Add transition utilities for smoother theme switching
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
    },
  },
  plugins: [
    // Plugin for grid background patterns
    function({ addUtilities, theme }) {
      const gridPatterns = {
        '.bg-grid-slate-100': {
          backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        },
        '.bg-grid-slate-800': {
          backgroundImage: 'linear-gradient(to right, rgba(51, 65, 85, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(51, 65, 85, 0.3) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        },
      }
      addUtilities(gridPatterns, ['responsive', 'hover'])
    },
  ],
}