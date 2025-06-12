// postcss.config.js
module.exports = {
  plugins: {
    'postcss-import': {},        // allows @import
    '@tailwindcss/postcss': {},  // the new Tailwind v4 PostCSS plugin
    autoprefixer: {},            // vendor prefixes
  },
};
