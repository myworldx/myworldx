const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],

  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        default: 'minmax(200px, 300px) 1fr minmax(200px, 300px)',
      },
      borderRadius: {
        xl: `calc(var(--radius) + 4px)`,
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },

  plugins: [require('tailwindcss-animated')],
}
