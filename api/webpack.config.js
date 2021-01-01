const serverlessWebpack = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: serverlessWebpack.lib.entries,
  target: "node",

  // Since aws-sdk is not compatible with webpack, we exclude all node dependencies
  externals: [nodeExternals()],

  // Run babel on all .js files and skip those in node_modules
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: __dirname,
        exclude: /node_modules/
      }
    ],
  }
};
