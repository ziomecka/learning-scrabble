/* jshint esversion: 6 */
import path from "path";
import webpack from "webpack";

/** Plugins */
import ExtractTextPlugin from "extract-text-webpack-plugin";

/** CSS */
import postcssFlexbugs from "postcss-flexbugs-fixes";
import postcssLost from "lost";
import postcssImport from "postcss-import";
import postcssNext from "postcss-cssnext";

const settings = {
  devtool: "source-map",
  context: path.join(__dirname, "dev"),
  entry: {
    app: [path.join(__dirname, "/dev/index.js")],
    vendors: [
      "angular",
      "@uirouter/angularjs",
      "angular-animate",
      "angular-cookies",
      "angular-route",
      "oclazyload"
    ]
  },
  target: "node",
  resolve: {
    extensions: [".js", ".sass"],
    modules: [
      path.resolve("./node_modules")
    ],
    alias: {
    }
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "./index.css"
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
            loader: "ng-annotate-loader"
          },
          {
            loader: "babel-loader?cacheDirectory=false",
            options: {
              compact: false,
              presets: ["env"]
            }
          },
          {
            loader: "jshint-loader",
          }
        ]
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
        test: /\.sass$/,
        use:
          ExtractTextPlugin.extract({
          fallback: "style-loader",
            use: [
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
              }
            ]
          })
      }
    ]
  }
};

export default settings;
