const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./index.js", // Entry point of your app
  target: "node", // Specifies that we're building for Node.js
  externals: [nodeExternals()], // Exclude node_modules
  output: {
    path: path.resolve(__dirname, "dist"), // Output folder
    filename: "bundle.js", // Output file name
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply this rule to .js files
        exclude: /node_modules/, // Ignore node_modules
        use: {
          loader: "babel-loader", // Use Babel to transpile
        },
      },
    ],
  },
  resolve: {
    extensions: [".js"], // Resolve these extensions
  },
  mode: "production", // Change to "development" during development
};
