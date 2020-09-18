const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const merge = require("webpack-merge");
const commonConfig = require("./webpack.common");

module.exports = (env) =>
  merge(commonConfig(env), {
    mode: "production",
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.(png|svg|ico)$/,
          use: {
            loader: "url-loader",
            options: {
              limit: 5 * 1024,
              outputPath: "images",
              name: "[name].[contenthash].[ext]",
            },
          },
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        minSize: 5000,
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      }),
      new OptimizeCssAssetsPlugin(),
    ],
  });
