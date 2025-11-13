/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // ✅ Required for Tailwind v4
    autoprefixer: {},           // ✅ For vendor prefixes
  },
};

export default config;
