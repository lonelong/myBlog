import type { Config } from 'tailwindcss'

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
        primary: {
          DEFAULT: '#0a0a0a',
          light: '#ffffff',
        },
        secondary: {
          DEFAULT: '#111111',
          light: '#f5f5f5',
        },
        card: {
          DEFAULT: '#1a1a1a',
          light: '#ffffff',
        },
        accent: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
        },
        border: {
          DEFAULT: '#2a2a2a',
          light: '#e5e5e5',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Noto Sans SC', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
