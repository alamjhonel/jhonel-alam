/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep base palette — near-black / charcoal / deep navy
        base: {
          900: '#04060a',
          800: '#070a10',
          700: '#0b0f16',
          600: '#11161f',
          500: '#171d28',
          400: '#212936',
        },
        ink: {
          DEFAULT: '#e6edf3',
          soft: '#aeb9c6',
          faint: '#6b7787',
          ghost: '#3b4553',
        },
        // Accent is driven by a CSS variable so the theme toggle can swap it
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          soft: 'rgb(var(--accent) / 0.14)',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--accent) / 0.35), 0 0 24px -6px rgb(var(--accent) / 0.45)',
        panel: '0 20px 60px -30px rgba(0,0,0,0.9)',
      },
      keyframes: {
        'pulse-node': {
          '0%,100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        blink: {
          '0%,49%': { opacity: '1' },
          '50%,100%': { opacity: '0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-node': 'pulse-node 2.4s ease-in-out infinite',
        blink: 'blink 1s step-end infinite',
        scan: 'scan 6s linear infinite',
        'fade-up': 'fade-up 0.4s ease-out both',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
