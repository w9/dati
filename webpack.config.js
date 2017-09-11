const path = require('path');

module.exports = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'app'),
        ],
        exclude: [
          path.resolve(__dirname, 'app/demo-files'),
        ],
        loader: 'babel-loader',
        options: {
          presets: ['env'],
        },
      },
    ],
  },
};
