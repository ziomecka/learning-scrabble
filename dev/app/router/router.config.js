/* jshint esversion: 6 */
// TODO what if url address is incorrect
angular
  .module("routerModule")
  .config([
    "$routeProvider",
    "$locationProvider",
    "$stateProvider",
    "routerStates",
    ($routeProvider, $locationProvider, $stateProvider, routerStates) => {
      const home = {
        url: "/",
        resolve: {
          authorizeCookie: require("./resolve/resolve.home.authorizecookie")
        },
      };

      const authorization = {
        url: "/authorization",
        templateUrl: "../authorization.html",
        controller: require("../authorization/controllers/authorization.controller"),
        resolve: {
          fromApp: require("./resolve/resolve.authorization.fromhome")
        }
      };

      const newuser = {
        url: "/newuser",
        templateUrl: "../newuser.html",
        controller: require("../newuser/newuser.controller"),
        resolve: {
          loadNewUserModule: require("./resolve/resolve.authorization.load.newuser.module")
        }
      };

      const games = {
        abstract: true,
        template: "<ui-view/>",
        resolve: {
          authorizeCookie: require("./resolve/resolve.home.authorizecookie")
          // user: require("./resolve/resolve.games.user"), // TODO out because done in cookies?
        }
      };

      const gamesRooms = {
        url: "/rooms",
        resolve: {
          roomsList: require("./resolve/resolve.rooms.roomslist"),
        },
        views: {
          "": {
            templateUrl: "../rooms.html",
            controller: require("../rooms/rooms.controller")
          },
          [`navigation@${routerStates.rooms}`]: {
            templateUrl: "../rooms.navigation.html",
            controller: require("../navigation/navigation.controller")
          },
          [`newroom@${routerStates.rooms}`]: {
            templateUrl: "../rooms.newroom.html",
            controller: require("../rooms/newroom/newroom.controller")
          }
        }
      };

      const gamesRoom = {
        url: "/rooms/room/:roomId",
        resolve: {
          roomData: require("./resolve/resolve.room.roomdata"),
          narrowTitle: require("./resolve/resolve.room.narrowtitle")
        },
        params: {
          newroom: false
        },
        views: {
          "": {
            templateUrl: "../room.html",
            controller: require("../room/room.controller")
          },
          [`roomsidebar@${routerStates.room}`]: {
            templateUrl: "../room.sidebar.html",
            controller: require("../room/sidebar/room.sidebar.controller")
          }
        }
      };

      $routeProvider.otherwise({templateUrl: "../index.html"});

      $stateProvider.state(routerStates.home, home);
      $stateProvider.state(routerStates.authorization, authorization);
      $stateProvider.state(routerStates.newuser, newuser);
      $stateProvider.state(routerStates.games, games);
      $stateProvider.state(routerStates.rooms, gamesRooms);
      $stateProvider.state(routerStates.room, gamesRoom);

      $locationProvider.html5Mode({enabled: true});
    }
  ]);
