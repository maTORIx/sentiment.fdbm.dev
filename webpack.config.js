const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    theme: './src/theme.js'
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'public/')
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  }
};
