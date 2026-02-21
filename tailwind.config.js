/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        kimi: {
          DEFAULT: '#262760',
          light: '#3d3d8a',
          dark: '#1a1a40',
        },
        gold: {
          DEFAULT: '#eea65e',
          light: '#f5c78a',
          dark: '#d48a3e',
        },
        navy: {
          DEFAULT: '#0F172A',
          light: '#1E293B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 0 20px rgba(238, 166, 94, 0.3)',
        'gold-lg': '0 0 30px rgba(238, 166, 94, 0.4)',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s infinite',
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(212, 175, 55, 0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
