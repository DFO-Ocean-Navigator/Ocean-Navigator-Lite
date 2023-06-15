const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "public"),
    publicPath: "/public/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "/src", "index.html"),
    }),
    new MiniCssExtractPlugin(),
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
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
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
  optimization: {
    splitChunks: {
      cacheGroups: {
        reactVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|react-bootstrap|react-bootstrap-icons)[\\/]/,
          name: "vendor-react",
          chunks: "all",
        },
      },
    },
  },
  resolve: {
    alias: {
      "axios/lib": path.resolve(__dirname, "./node_modules/axios/lib"),
    },
  },
};
