import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // SICKSAINT 1990s Underground Luxury Editorial Palette
        brand: {
          bg: '#08090D', surface: '#101219', surfaceElevated: '#171A23', card: '#141720', cardHover: '#1B1E29',
          text: '#E8E8EC', textMuted: '#9699A6', textSubtle: '#696D7B', border: '#292C36', borderSubtle: '#1E2029', borderLight: '#414553',
          accent: '#A31F3D', accentHover: '#C22B4C', burgundy: '#A31F3D', burgundyMuted: '#521727', paper: '#D9D7DC', ink: '#08090D', red: '#C22B4C',
        },
        paper: {
          light: '#D9D7DC', card: '#141720', dark: '#08090D', darkCard: '#141720', border: '#292C36', darkBorder: '#292C36',
        },
        ink: {
          primary: '#E8E8EC', secondary: '#9699A6', muted: '#696D7B', darkPrimary: '#E8E8EC', darkSecondary: '#9699A6', darkMuted: '#696D7B',
        },
        signal: {
          red: '#A31F3D', gold: '#B7B9C2', accent: '#A31F3D',
        },
      },
      fontFamily: {
        serif: ['"Bodoni Moda"', '"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        bodoni: ['"Bodoni Moda"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Helvetica Neue"', 'Inter', 'Arial', '-apple-system', 'sans-serif'],
        condensed: ['Oswald', '"Archivo Narrow"', '"Helvetica Condensed"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Editorial magazine display sizes — 90s Vogue / Forbes scale
        'display-2xl': ['7.5rem', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
        'display-xl': ['5.5rem', { lineHeight: '0.96', letterSpacing: '-0.035em' }],
        'display-lg': ['4rem', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
        'display-md': ['2.75rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        editorial: '0.04em',
        condensed: '0.14em',
        widest: '0.24em',
        ultra: '0.36em',
      },
      spacing: {
        'prose-width': '65ch',
      },
      boxShadow: {
        // Strict editorial minimalism: zero neon glow, subtle depth only
        'card-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'ticker-slide': 'tickerSlide 40s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        tickerSlide: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
