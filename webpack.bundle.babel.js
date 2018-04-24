/* jshint esversion: 6 */
// TODO change names of html files
import merge from "webpack-merge";
import common from "./webpack.common.babel";
import HtmlWebpackPlugin  from "html-webpack-plugin";
import HtmlWebpackIncludeAssetsPlugin  from "html-webpack-include-assets-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";
import webpack from "webpack";

const htmlsOptions = {
  htmlIndex: {
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
  },
  htmlTitle: {
    template: path.join("./app/app/templates/title.pug"),
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
    template: path.join("./app/authorization/authorization.pug"),
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
    template: path.join("./app/room/controls/room.controls.pug"),
    filename: "./room.controls.html",
    inject: false
  },
  htmlRoomSidebar: {
    template: path.join("./app/room/sidebar/room.sidebar.pug"),
    filename: "./room.sidebar.html",
    inject: false
  },
  htmlScrabble: {
    template: path.join("./app/scrabble/core/scrabble.pug"),
    filename: "./scrabble.html",
    inject: false
  },
  htmlScrabbleControls: {
    template: path.join("./app/scrabble/player/controls/controls.pug"),
    filename: "./scrabble.controls.html",
    inject: false
  },
  htmlScrabbleSidebar: {
    template: path.join("./app/scrabble/core/sidebar/sidebar.pug"),
    filename: "./scrabble.sidebar.html",
    inject: false
  },
  htmlScrabblePlayer: {
    template: path.join("./app/scrabble/player/player.pug"),
    filename: "./scrabble.player.html",
    inject: false
  },
  htmlScrabbleRack: {
    template: path.join("./app/scrabble/player/rack/rack.pug"),
    filename: "./scrabble.rack.html",
    inject: false
  },
  htmlBoard: {
    template: path.join("./app/scrabble/core/board/templates/board.pug"),
    filename: "./scrabble.board.html",
    inject: false
  },
  htmlField: {
    template: path.join("./app/scrabble/core/field/field.pug"),
    filename: "./scrabble.field.html",
    inject: false
  },
  htmlTile: {
    template: path.join("./app/scrabble/core/tile/tile.pug"),
    filename: "./scrabble.tile.html",
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
  }
];

const settings = merge (common, {
  output: {
    path: path.resolve(__dirname, "bundle"),
    filename: "./app/[name].bundle.js"
  },
  target: "web", // To get CommonsChunkPlugin work
  plugins: [
    ...htmlPlugins,
    new CopyWebpackPlugin(copyOptions),
    new webpack.optimize.CommonsChunkPlugin({
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
    }),
  ]
});

export default settings;
