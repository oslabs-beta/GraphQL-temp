const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/index.js",
  mode: process.env.NODE_ENV || "development",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
  },

  module: {
    rules: [
      {
        test: /\.sql$/,
        use: "raw-loader",
      },
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },

      {
        test: /\.s?css/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images/",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
    }),
    new Dotenv({
      path: path.resolve(__dirname, "../server/.env"), // Path to .env file in the server folder
      safe: true, // Load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
    }),
  ],
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, "build"),
      publicPath: "/",
    },
    port: 8000,
    proxy: [
      {
        context: ["/api"],
        target: "http://localhost:3000",
      },
    ],
  },
};
