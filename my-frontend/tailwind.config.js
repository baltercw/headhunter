// my-frontend/tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Noto Sans TC', 'sans-serif'],
        'noto': ['Noto Sans TC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}