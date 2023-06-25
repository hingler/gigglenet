const path = require("path");

module.exports = {
  entry: {
    'debug/clienttest': "./client/ts/debug/clienttest.ts",
    'debug/servertest': "./client/ts/debug/servertest.ts"
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: "/node_modules/"
      }
    ]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "client/static")
  }
}