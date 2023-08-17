/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: theme => ({
        'home-bg-img': "url('./images/7a3dcf7fbc1a4a1da14a034b81260672.avif')",
        'profile-bg-img': "url('./images/profile-bg.png')",

      })
  },
  plugins: [],
}
}
