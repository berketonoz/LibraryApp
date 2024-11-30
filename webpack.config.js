// webpack.config.js

const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/server.ts',
  target: 'node', // Important for Node.js apps
  externals: [nodeExternals()], // Exclude node_modules
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,                // Matches .ts files
        use: 'babel-loader',          // Use Babel loader for transpilation
        exclude: /node_modules/       // Exclude dependencies
      }
    ]
  },
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
