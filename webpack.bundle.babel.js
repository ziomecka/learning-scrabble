/* jshint esversion: 6 */
// TODO: html spec correct
// TODO change names of html files
import merge from "webpack-merge";
import common from "./webpack.common.babel";
import HtmlWebpackPlugin  from "html-webpack-plugin";
import HtmlWebpackIncludeAssetsPlugin  from "html-webpack-include-assets-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";
import webpack from "webpack";

const htmlIndex = {
  title: "Let's play scrabble",
  template: path.join("./app/index.pug"),
  chunks: ["app"],
  filename: "./index.html",
  inject: "head",
  // meta: "", // TODO
  // favicon: "",
  // minify: ""
};

const htmlIndexAssets = {
  assets: [path.join("./app/css/index.css")],
  append: true
};

const htmlTitle = {
  template: path.join("./app/constants/title/title.pug"),
  filename: "./index.title.html",
  inject: false
};

const htmlNavigation = {
  template: path.join("./app/navigation/navigation.pug"),
  filename: "./rooms.navigation.html",
  inject: false
};

const htmlRoomSidebar = {
  template: path.join("./app/room/sidebar/room.sidebar.pug"),
  filename: "./room.sidebar.html",
  inject: false
};

const htmlRoomControls = {
  template: path.join("./app/room/controls/controls.pug"),
  filename: "./room.controls.html",
  inject: false
};

const htmlRooms = {
  template: path.join("./app/rooms/rooms.pug"),
  filename: "./rooms.html",
  inject: false
};

const htmlAuth = {
  template: path.join("./app/authorization/authorization.pug"),
  filename: "./authorization.html",
  inject: false
};

const htmlNewuser = {
  template: path.join("./app/newuser/newuser.pug"),
  filename: "./newuser.html",
  inject: false
};

const htmlNewroom = {
  template: path.join("./app/rooms/newroom/newroom.pug"),
  filename: "./rooms.newroom.html",
  inject: false
};

const htmlRoom = {
  template: path.join("./app/room/room.pug"),
  filename: "./room.html",
  inject: false
};

const htmlControlsRound = {
  template: path.join("./scrabble/controls/round/round.pug"),
  filename: "./room.controls.round.html",
  inject: false
};

const htmlControlsExchange = {
  template: path.join("./scrabble/controls/exchange/exchange.pug"),
  filename: "./room.controls.exchange.html",
  inject: false
};

const htmlControlsVerify = {
  template: path.join("./scrabble/controls/verify/verify.pug"),
  filename: "./room.controls.verify.html",
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
    filename: "./app/[name].bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin(htmlIndex),
    new HtmlWebpackPlugin(htmlTitle),
    new HtmlWebpackPlugin(htmlNavigation),
    new HtmlWebpackPlugin(htmlRoom),
    new HtmlWebpackPlugin(htmlRoomSidebar),
    new HtmlWebpackPlugin(htmlRooms),
    new HtmlWebpackPlugin(htmlAuth),
    new HtmlWebpackPlugin(htmlNewuser),
    new HtmlWebpackPlugin(htmlNewroom),
    new HtmlWebpackPlugin(htmlRoomControls),
    new HtmlWebpackPlugin(htmlControlsRound),
    new HtmlWebpackPlugin(htmlControlsExchange),
    new HtmlWebpackPlugin(htmlControlsVerify),
    new HtmlWebpackIncludeAssetsPlugin(htmlIndexAssets),
    new CopyWebpackPlugin(copyOptions)
  ]
});

export default settings;
