const path = require('path');

module.exports = {
  entry: './src/index.js', // Main JavaScript file
  output: {
    filename: 'bundle.js', // Bundled JavaScript file
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  module: {
    rules: [
      {
        test: /\.scss$/, // Match .scss files
        use: ['style-loader', 'css-loader', 'sass-loader'], // Process Sass to CSS
      },
    ],
  },
  mode: 'development', // Use 'production' for optimized builds
};
