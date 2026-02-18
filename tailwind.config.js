/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        accent2: 'var(--accent-2)',
        accent3: 'var(--accent-3)',
        panel: 'var(--panel)',
        panelBorder: 'var(--panel-border)',
      },
      boxShadow: {
        glow: '0 0 20px var(--shadow-glow)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
}
