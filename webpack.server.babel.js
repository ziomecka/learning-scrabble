/* jshint esversion: 6 */

// TODO compile to ES5
// https://github.com/webpack/webpack/issues/1206

import path from "path";
import webpack from "webpack";
import fs from "fs";

/** Externals assume a browser environment,
    so require("foo") is turned into foo(global variable).
    The require should be kept.
    This is possible by creating an object with a key/value of each module name,
    and prefixing the value with "commonjs".
    Below: read the list of directories inside node_modules and give to externals.
    'Src: https://jlongster.com/Backend-Apps-with-Webpack--Part-I'
    */
const nodeModules = {};
fs.readdirSync("node_modules")
  .filter(x => [".bin"].indexOf(x) === -1)
  .forEach(mod => nodeModules[mod] = "commonjs " + mod);

const settings = {
  devtool: "source-map",
  context: path.join(__dirname, "server"),
  entry: {
    server: path.join(__dirname, "/app/server/server.js")
  },
  output: {
    path: path.resolve(__dirname, "bundle"),
    filename: "./[name].js"
  },
  externals: nodeModules,
  target: "node",
  node: {
    __filename: false,
    __dirname: false
  },
  resolve: {
    modules: [
      path.resolve("./node_modules")
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      io: "socket.io-client"
    })
  ],
  module: {
    // noParse: [/(socket.io-client)/],
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        exclude: /(node_modules)|(\.spec\.js$)/,
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
    ]
  }
};

export default settings;
