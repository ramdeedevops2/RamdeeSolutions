/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Swiss editorial: paper, ink, one accent.
           Driven by CSS variables so the theme can invert at runtime.
           <alpha-value> keeps Tailwind's /opacity modifiers working. */
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        paper: 'rgb(var(--c-paper) / <alpha-value>)',
        grey: {
          1: 'rgb(var(--c-grey-1) / <alpha-value>)',
          2: 'rgb(var(--c-grey-2) / <alpha-value>)',
          3: 'rgb(var(--c-grey-3) / <alpha-value>)',
        },
        /* sampled from the Ramdee Solutions mark */
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        /* brand wordmark — falls back to the display serif until the
           licensed Nevera files are added to /public/fonts */
        brand: ['Nevera', '"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
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
