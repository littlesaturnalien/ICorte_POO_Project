const path = require('path');

module.exports = {
  webpack: {
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom')
    }
  },
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')]
    }
  }
};
