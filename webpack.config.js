const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "public"),
    publicPath: "/public/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "/src", "index.html"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // .js and .jsx files
        exclude: /node_modules/, // excluding the node_modules folder
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sa|sc|c)ss$/, // styles files
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|gif|svg|eot|woff2?|ttf|svg)(\?.*)?$/,
        loader: "file-loader",
        options: {
          name: "/[name].[ext]",
        },
      },
    ],
  },
  resolve: {
    alias: {
      "axios/lib": path.resolve(__dirname, "./node_modules/axios/lib"),
    },
  },
};
