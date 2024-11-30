const path = require('path');

module.exports = {
  entry: './src/server.ts',           // Entry point of your application
  target: 'node',                     // Specifies that the target is Node.js
  mode: 'production',                 // or 'development' for development mode
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
    extensions: ['.ts', '.js']        // Resolve these extensions
  },
  output: {
    filename: 'bundle.js',            // Output file name
    path: path.resolve(__dirname, 'dist') // Output directory ('dist' folder)
  }
};
