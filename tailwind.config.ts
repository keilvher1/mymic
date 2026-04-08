import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neon Nocturne Design System
        primary: {
          DEFAULT: '#7C3AED',
          light: '#A78BFA',
          dark: '#5B21B6',
        },
        secondary: {
          DEFAULT: '#06B6D4',
          light: '#67E8F9',
          dark: '#0891B2',
        },
        tertiary: {
          DEFAULT: '#FF2D55',
          light: '#FF6B8A',
          dark: '#CC0033',
        },
        surface: {
          DEFAULT: '#1A1A2E',
          light: '#25253D',
          dark: '#0F0F12',
          card: '#1E1E35',
        },
        neon: {
          purple: '#7C3AED',
          cyan: '#06B6D4',
          pink: '#FF2D55',
          blue: '#3B82F6',
        },
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'Pretendard', 'sans-serif'],
        body: ['Be Vietnam Pro', 'Pretendard', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 50%, #FF2D55 100%)',
        'gradient-card': 'linear-gradient(135deg, #1E1E35 0%, #25253D 100%)',
        'gradient-purple': 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 5px #7C3AED, 0 0 10px #7C3AED' },
          '50%': { boxShadow: '0 0 20px #7C3AED, 0 0 40px #7C3AED' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
