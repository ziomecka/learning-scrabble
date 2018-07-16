/* jshint esversion: 6 */
import webpack from "webpack";
import merge from "webpack-merge";
import common from "./webpack.common.babel";

import HtmlWebpackPlugin  from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import CleanWebpackPlugin from "clean-webpack-plugin";
import CleanLogs from "clean-up-extract-text-plugin-output";

import path from "path";
import prepareTemplates from "./prepare.templates.plugin";

const indexOptions = {
  title: "Let's play scrabble",
  template: path.join("./app/index.pug"),
  chunks: ["app", "vendors"],
  inject: true,
  chunksSortMode: (a, b) => {
    return (a.names[0] < b.names[0])? 1 : -1;
  }
  // meta: "", // TODO
  // favicon: "",
  // minify: ""
};

const copyOptions = [
  {
    from: "./server/",
    to: "../bundle/server"
  }
];

const stats = {
  assets: false,
  assetsSort: "!size",
  chunks: true, // Add chunk information
  chunkModules: true, // Add built modules information to chunk information
  chunkOrigins: true, // Add the origins of chunks and chunk merging info
  chunksSort: "!size",
  colors: true, // `webpack --colors` equivalent
  depth: true, // Display the distance from the entry point for each module
  entrypoints: true, // Display the entry points with the corresponding bundles
  env: true, // Add --env information
  errors: true,
  errorDetails: false,
  modules: true, // Add built modules information
  performance: true,   // Show performance hint when file size exceeds `performance.maxAssetSize`
  providedExports: true, // Show the exports of the modules
  publicPath: true, // Add public path information
  reasons: true, // Add information about the reasons why modules are included
  source: true, // Add the source code of modules
  timings: true, // Add timing information
  usedExports: true, // Show which exports of a module are used
  warnings: true
};

const cleanWebackPlugin = () => {
  /** try because error thrown if run when nodemon runs */
  try {
    return new CleanWebpackPlugin(["bundle"]);
  } catch (err) {
    /* eslint-disable no-console */
    console.log("clean-webpack-plugin: bundle has NOT been removed.");
    /* eslint-enable no-console */
    return null;
  }
};

const commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
  name: "vendors",
  chunks: ["vendors", "app"],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          chunks: ["vendors", "app"],
          name: "vendors",
          priority: 10,
          enforce: true,
          minChunks: function (module) {
            return module.context && module.context.includes("node_modules");
          }
        },
        app: {
          chunks: ["vendors", "app"],
          name: "app"
        }
      }
    }
  }
});

const preapareConfig = htmlPlugins => {
  return merge (common, {
    output: {
      path: path.resolve(__dirname, "bundle"),
      filename: "./app/[name].bundle.js"
    },
    target: "web", // Needed to get CommonsChunkPlugin work
    stats: stats,
    plugins: [
      cleanWebackPlugin,
      new HtmlWebpackPlugin(indexOptions),
      ...htmlPlugins,
      new CopyWebpackPlugin(copyOptions),
      commonsChunkPlugin,
      new CleanLogs() // Remove unnecessary logs https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/97
    ]
  });
};

let promise = new Promise(res => {
  prepareTemplates("./dev/app/", HtmlWebpackPlugin, templates => {
    res(preapareConfig(templates));
  });
});

export default promise;
