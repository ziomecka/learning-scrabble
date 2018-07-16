/* jshint esversion: 6 */
import merge from "webpack-merge";
import common from "./webpack.common.babel";
import {BundleAnalyzerPlugin as BundleAnalyzerPlugin} from "webpack-bundle-analyzer";
import path from "path";

const settings = merge(common, {
  output: {
    path: path.resolve(__dirname, "bundle"),
    filename: "./app/analyse.bundle.js"
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static"
    })
  ]
});

export default settings;
