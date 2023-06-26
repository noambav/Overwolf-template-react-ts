/* eslint-disable no-undef */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const OverwolfPlugin = require("./overwolf.webpack");

module.exports = (env) => ({
  mode: "production",
  entry: {
    background: "./src/windows/background/background.js",
    desktop: "./src/windows/desktop/desktop.js",
    in_game: "./src/windows/in_game/in_game.js",
    second_monitor: "./src/windows/second_monitor/second_monitor.js",
  },
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "[name]/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "img/[name].[ext]", // set the output path and filename for the svg files
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: "svg-inline-loader",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"], // Add .ts and .tsx to the list of supported extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/windows/background/background.html",
      filename: "background/background.html",
      chunks: ["background"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/windows/desktop/desktop.html",
      filename: "desktop/desktop.html",
      chunks: ["desktop"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/windows/in_game/in_game.html",
      filename: "in_game/in_game.html",
      chunks: ["in_game"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/windows/second_monitor/second_monitor.html",
      filename: "second_monitor/second_monitor.html",
      chunks: ["second_monitor"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "manifest.json", to: "" },
        { from: "icons", to: "icons" },
      ],
    }),
    new OverwolfPlugin(env),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],
});
