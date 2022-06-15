module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'black': '#171717',
        'green': '#79f6d7',
        'gray-dark' : '#212a31',
        'gray-mid': '#2c353a',
        'gray-light': '#353e43',
        'white': '#ffffff',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
