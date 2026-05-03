import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        mint: '#10b981',
        ember: '#f97316',
        panel: '#111827'
      }
    }
  },
  plugins: []
};

export default config;
