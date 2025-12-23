/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#005a3d',
        'primary-2': '#00a652',
        accent: '#ffc400',
        dark: '#012c5a',
        muted: '#6b7280'
      }
    }
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--color-primary': theme('colors.primary'),
          '--color-primary-2': theme("colors['primary-2']"),
          '--color-accent': theme('colors.accent'),
          '--color-dark': theme('colors.dark'),
          '--color-muted': theme('colors.muted')
        }
      })
    }
  ]
}
