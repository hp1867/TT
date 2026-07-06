import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#04060a',
          900: '#070a12',
          800: '#0b101c',
          700: '#11182a',
          600: '#1a2238',
        },
        neon: {
          cyan: '#00f0ff',
          blue: '#3b82ff',
          violet: '#7a5cff',
          pink: '#ff5cf2',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(ellipse at center, rgba(0,240,255,0.10), transparent 60%)',
        'neon-grad':
          'linear-gradient(135deg, #00f0ff 0%, #3b82ff 50%, #7a5cff 100%)',
      },
      boxShadow: {
        glow: '0 0 24px rgba(0,240,255,0.35), 0 0 60px rgba(59,130,255,0.25)',
        card: '0 30px 80px -20px rgba(0,240,255,0.25)',
      },
      animation: {
        'spin-slow': 'spin 14s linear infinite',
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%,100%': {
            boxShadow:
              '0 0 0 0 rgba(0,240,255,0.6), 0 0 30px rgba(0,240,255,0.4)',
          },
          '50%': {
            boxShadow:
              '0 0 0 18px rgba(0,240,255,0), 0 0 60px rgba(0,240,255,0.6)',
          },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
