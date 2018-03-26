/* jshint esversion: 6 */

// TODO compile to ES5
// https://github.com/webpack/webpack/issues/1206

import path from "path";
import webpack from "webpack";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import packageJSON from "./package.json";
import postcssFlexbugs from "postcss-flexbugs-fixes";
import postcssLost from "lost";
import postcssImport from "postcss-import";
import postcssNext from "postcss-cssnext";

// const extractSASS = new ExtractTextPlugin("[name].css");
// const extractHTML = new ExtractTextPlugin("[name]/[name].html");

const settings = {
  devtool: "source-map",
  context: path.join(__dirname, "dev"),
  entry: {
    app: [path.join(__dirname, "/dev/index.js"), path.join(__dirname, "/dev/css/index.sass")]
  },
  target: "node",
  resolve: {
    modules: [
      path.resolve("./node_modules")
    ],
    alias: {
      jquery: "jquery/src/jquery",
      angular: "angular/angular.min.js"
    }
  },
  plugins: [
    // extractSASS,
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      "window.$": "jquery"
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        exclude: /(node_modules)|(\.spec\.js$)|(angular\.min\.js$)/,
        use: [
          {
            loader: "babel-loader",
            options: {
              /** For error: the code generator has deoptimised styling
              When set to "auto" compact is set to true on input sizes of >100KB,
              maeaning: Not include superfluous whitespace characters and line terminators
              */
              compact: false,
              presets: ["es2015"],
            }
          },
          {
            loader: "jshint-loader",
          }
        ]
      },
      {
        test: /angular\.min\.js$/,
        loader: "exports-loader?angular"
      },
      {
        test: /\.pug$/,
        use: "pug-loader?pretty"
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "raw-loader"
          }
        ]
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
        ]
      },
      {
        test: /\.sass$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "./app/css",
              name: "[name].css"
            }
          },
          {
            loader: "extract-loader",
            options: {
              publicPath: "../"
            }
          },
          {
            loader: "css-loader",
            options: {
              name: "[name].css",
              sourceMap: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [
                postcssFlexbugs(),
                postcssLost(),
                postcssImport(),
                postcssNext()
              ],
              sourceMap: true
            }
          },
          {
            loader: "sass-loader"
          },
        ]
        // use: extractSASS.extract({
        //   use: [
        //     {
        //       loader: "css-loader",
        //       options: {sourceMap: true}
        //     },
        //     {
        //       loader: "postcss-loader",
        //       options: {
        //         plugins: [
        //           postcssFlexbugs(),
        //           postcssLost(),
        //           postcssImport(),
        //           postcssNext()
        //         ],
        //         sourceMap: true
        //       }
        //     },
        //     {
        //       loader: "sass-loader"
        //     }
        //   ]
        // })
      }
    ]
  }
};

export default settings;
