const path = require("path");

const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";

module.exports = {
  mode: process.env.NODE_ENV,

  entry: {
    background: "./src/background/index.ts",
  },

  output: {
    path: path.join(__dirname, "bin"),
  },

  devtool: isDev ? "source-map" : false,

  resolve: {
    extensions: [".wasm", ".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
  },

  module: {
    rules: [
      // {
      //   test: /\.[tj]s$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: "babel-loader",
      //   },
      // },
      {
        // not on test files
        test: /^[^.]+\.tsx?$/,
        // exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },

  plugins: [
    // remove old build files before run (prod only!)
    new CleanWebpackPlugin({
      dry: isDev,
      cleanOnceBeforeBuildPatterns: ["**/*"],
    }),

    // copy static files
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/manifest.json", to: "" },
        {
          from: "src/public",
          to: "public",
        },
        {
          from: "img/extension",
          to: "img"
        }
      ],
    }),

    // add banner at top of file
    new webpack.BannerPlugin({
      banner: `hash:[hash], builtAt:${Date.now()}, isDev:${
        isDev ? "true" : "false"
      }`,
      entryOnly: true,
    }),
  ],
};
