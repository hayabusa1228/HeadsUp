/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: theme => ({
        'home-bg-img': "url('./images/cite-bg.jpg')",
        'poker-table-bg-img': "url('./images/poker_table_bg.png')",

      })
  },
  plugins: [],
}
}
