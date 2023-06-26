/* eslint-disable no-undef */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: "./src/windows/desktop/desktop.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  devServer: {
    port: 8080,
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
      template: "./src/windows/desktop/desktop.html",
      filename: "index.html",
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
      "process.env.ENDPOINT": JSON.stringify("http://localhost"),
      "process.env.PORT": JSON.stringify("25526"),
      "process.env.SPOTIFY_CLIENT_ID": JSON.stringify(
        "013dc5ed9d0543c295cb6c4fbf6fa210"
      ),
      "process.env.DISCORD_CLIENT_ID": JSON.stringify("1099786127205994606"),
      //CLIENT_ID = "1085278907575574608"; // Mello
      //CLIENT_ID = "1099786127205994606"; // Testing bot
    }),
  ],
};
