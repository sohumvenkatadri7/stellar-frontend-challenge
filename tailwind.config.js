/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Archivo Black"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'sans': ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        background: 'oklch(0.18 0.02 260)',
        foreground: 'oklch(0.98 0.005 250)',
        card: 'oklch(0.25 0.03 262 / 0.55)',
        'card-foreground': 'oklch(0.98 0.005 250)',
        popover: 'oklch(0.22 0.03 262)',
        'popover-foreground': 'oklch(0.98 0.005 250)',
        primary: {
          DEFAULT: 'oklch(0.84 0.18 95)',
          foreground: 'oklch(0.12 0.02 260)',
        },
        secondary: {
          DEFAULT: 'oklch(0.3 0.04 262)',
          foreground: 'oklch(0.98 0.005 250)',
        },
        muted: {
          DEFAULT: 'oklch(0.26 0.03 262)',
          foreground: 'oklch(0.72 0.02 255)',
        },
        accent: {
          DEFAULT: 'oklch(0.7 0.22 320)',
          foreground: 'oklch(0.98 0.005 250)',
        },
        destructive: {
          DEFAULT: 'oklch(0.68 0.24 22)',
          foreground: 'oklch(0.98 0.005 250)',
        },
        success: {
          DEFAULT: 'oklch(0.78 0.2 145)',
          foreground: 'oklch(0.12 0.02 260)',
        },
        warning: {
          DEFAULT: 'oklch(0.82 0.18 70)',
          foreground: 'oklch(0.12 0.02 260)',
        },
        border: 'oklch(0.02 0 0)',
        input: 'oklch(1 0 0 / 0.08)',
        ring: 'oklch(0.84 0.18 95)',
        sidebar: 'oklch(0.2 0.025 260 / 0.7)',
        'sidebar-foreground': 'oklch(0.98 0.005 250)',
        'sidebar-primary': 'oklch(0.84 0.18 95)',
        'sidebar-primary-foreground': 'oklch(0.12 0.02 260)',
        'sidebar-accent': 'oklch(0.3 0.04 262)',
        'sidebar-accent-foreground': 'oklch(0.98 0.005 250)',
        'sidebar-border': 'oklch(0.02 0 0)',
        'sidebar-ring': 'oklch(0.84 0.18 95)',
      },
      boxShadow: {
        brutal: '6px 6px 0 0 oklch(0.02 0 0)',
        'brutal-sm': '3px 3px 0 0 oklch(0.02 0 0)',
        'brutal-lg': '10px 10px 0 0 oklch(0.02 0 0)',
        'brutal-primary': '6px 6px 0 0 oklch(0.84 0.18 95)',
        'brutal-accent': '6px 6px 0 0 oklch(0.7 0.22 320)',
      },
      animation: {
        spin: 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}