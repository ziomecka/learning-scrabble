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

const htmlIndexAssets = {
  assets: [path.join("./app/css/index.css")],
  append: true
};
const htmlsOptions = {
  htmlIndex: {
    title: "Let's play scrabble",
    template: path.join("./app/index.pug"),
    chunks: ["app"],
    filename: "./index.html",
    inject: "head",
    // meta: "", // TODO
    // favicon: "",
    // minify: ""
  },
  htmlTitle: {
    template: path.join("./app/home/templates/title.pug"),
    filename: "./index.title.html",
    inject: false
  },
  htmlNavigation: {
    template: path.join("./app/navigation/navigation.pug"),
    filename: "./rooms.navigation.html",
    inject: false
  },
  htmlRooms: {
    template: path.join("./app/rooms/rooms.pug"),
    filename: "./rooms.html",
    inject: false
  },
  htmlAuth: {
    template: path.join("./app/authorization/templates/authorization.pug"),
    filename: "./authorization.html",
    inject: false
  },
  htmlNewuser: {
    template: path.join("./app/newuser/newuser.pug"),
    filename: "./newuser.html",
    inject: false
  },
  htmlNewroom: {
    template: path.join("./app/rooms/newroom/newroom.pug"),
    filename: "./rooms.newroom.html",
    inject: false
  },
  htmlRoom: {
    template: path.join("./app/room/room.pug"),
    filename: "./room.html",
    inject: false
  },
  htmlRoomGame: {
    template: path.join("./app/room/game/room.game.pug"),
    filename: "./room.game.html",
    inject: false
  },
  htmlRoomControls: {
    template: path.join("./app/room/controls/controls.pug"),
    filename: "./room.controls.html",
    inject: false
  },
  htmlRoomSidebar: {
    template: path.join("./app/room/sidebar/room.sidebar.pug"),
    filename: "./room.sidebar.html",
    inject: false
  },
  htmlScrabble: {
    template: path.join("./app/scrabble/scrabble.pug"),
    filename: "./scrabble.html",
    inject: false
  },
  htmlScrabbleControls: {
    template: path.join("./app/scrabble/controls/controls.pug"),
    filename: "./scrabble.controls.html",
    inject: false
  },
  htmlBoard: {
    template: path.join("./app/scrabble/board/templates/board.pug"),
    filename: "./scrabble.board.html",
    inject: false
  },
  htmlField: {
    template: path.join("./app/scrabble/board/templates/field.pug"),
    filename: "./scrabble.field.html",
    inject: false
  }
};

const htmlPlugins = [];

Object.keys(htmlsOptions)
  .forEach(htmlOption => {
    htmlPlugins.push(new HtmlWebpackPlugin(htmlsOptions[htmlOption]));
  });

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
    ...htmlPlugins,
    new HtmlWebpackIncludeAssetsPlugin(htmlIndexAssets),
    new CopyWebpackPlugin(copyOptions)
  ]
});

export default settings;
