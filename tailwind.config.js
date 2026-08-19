/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Swiss editorial: paper, ink, one accent */
        ink: '#0A0A0A',
        paper: '#F2F0EB',
        grey: {
          1: '#8A8A85',
          2: '#5C5C58',
          3: '#2A2A28',
        },
        /* sampled from the Ramdee Solutions mark */
        accent: '#F65F5F',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Neue Haas Grotesk"', '"Inter Tight"', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      transitionTimingFunction: {
        swiss: 'cubic-bezier(.16,1,.3,1)',
        io: 'cubic-bezier(.65,0,.35,1)',
      },
      maxWidth: {
        shell: '1600px',
      },
      keyframes: {
        marquee: { to: { transform: 'translateX(calc(-100% - var(--gap)))' } },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
      },
      animation: {
        marquee: 'marquee 42s linear infinite',
        blink: 'blink 1.6s steps(1) infinite',
      },
    },
  },
  plugins: [],
};
