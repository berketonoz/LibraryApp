module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current", // or specify a Node.js version
        },
      },
    ],
    "@babel/preset-typescript",
  ],
};
