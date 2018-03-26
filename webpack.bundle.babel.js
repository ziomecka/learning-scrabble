/* jshint esversion: 6 */
import merge from "webpack-merge";
import common from "./webpack.common.babel";
import HtmlWebpackPlugin  from "html-webpack-plugin";
import HtmlWebpackIncludeAssetsPlugin  from "html-webpack-include-assets-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";
import webpack from "webpack";

const htmlIndex = {
  title: "Welcome",
  myPageHeader: "Scrabble",
  template: path.join("./app/index.pug"),
  // assets: {
  //   style: path.join("./css/index.css")
  // },
  chunks: ["app"],
  filename: "./index.html",
  inject: "head"
};

const htmlIndexAssets = {
  assets: [path.join("./app/css/index.css")],
  append: true
};

const htmlRooms = {
  title: "Scrabble room",
  myPageHeader: "Let's play scrabble",
  template: path.join("./app/rooms/rooms.pug"),
  filename: "./rooms.html",
  inject: false
};

const htmlAuth = {
  title: "Scrabble room",
  myPageHeader: "Let's play scrabble",
  template: path.join("./app/authorization/authorization.pug"),
  filename: "./authorization.html",
  inject: false
};

const htmlNewUser = {
  title: "Scrabble room",
  myPageHeader: "Let's play scrabble",
  template: path.join("./app/newuser/newuser.pug"),
  filename: "./newuser.html",
  inject: false
};

const htmlNewRoom = {
  title: "Scrabble room",
  myPageHeader: "Let's play scrabble",
  template: path.join("./app/newroom/newroom.pug"),
  filename: "./newroom.html",
  inject: false
};

const htmlRoom = {
  title: "Scrabble room",
  myPageHeader: "Let's play scrabble",
  template: path.join("./app/room/room.pug"),
  filename: "./room.html",
  inject: false
};

const copyOptions = [
  {
    from: "./server/",
    to: "../bundle/server"
  },
  {
    from: "./css/*.css",
    to: "../bundle/css"
  }
];

const settings = merge (common, {
  output: {
    path: path.resolve(__dirname, "bundle"),
    filename: "./app/app.bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin(htmlIndex),
    new HtmlWebpackPlugin(htmlRoom),
    new HtmlWebpackPlugin(htmlRooms),
    new HtmlWebpackPlugin(htmlAuth),
    new HtmlWebpackPlugin(htmlNewUser),
    new HtmlWebpackPlugin(htmlNewRoom),
    new HtmlWebpackIncludeAssetsPlugin(htmlIndexAssets),
    new CopyWebpackPlugin(copyOptions)
  ]
});

export default settings;
