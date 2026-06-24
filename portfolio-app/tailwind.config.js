/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        pixel: '4px 3px 0 #000',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
