const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
  entry: {
    "data-pick": "./src/index.js",
    "data-pick.min": "./src/index.js"
  },
  output: {
    filename: "[name].js",
    library: "DataPick",
    libraryTarget: "umd",
    libraryExport: "default",
    // 解决 node environment (commonjs) 的问题  见 issues https://github.com/webpack/webpack/issues/6784
    globalObject: "typeof self !== 'undefined' ? self : this"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/
      })
    ]
  }
};
