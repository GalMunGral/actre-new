module.exports = {
  entry: "./src/index",
  contentBase: "./public",
  extensions: [".ts", ".tsx", ".js", ".jsx"],
  loaders: [{ test: /\.jsx$/, use: ["replay/loader"] }],
};
