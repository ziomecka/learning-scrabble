/* jshint esversion: 6 */
// TODO what if url address is incorrect
angular
  .module("authorizationModule")
  .config([
    "$routeProvider",
    "$locationProvider",
    "$stateProvider",
    "authorizationStates",
    ($routeProvider, $locationProvider, $stateProvider, authorizationStates) => {

      const home = {
        url: "/",
        resolve: {
          authorizeCookie: require("./resolve/resolve.home.authorizecookie")
        },
      };

      const authorization = {
        url: "/authorization",
        templateUrl: "../authorization.html",
        controller: require("./authorization.controller"),
        resolve: {
          fromApp: require("./resolve/resolve.authorization.fromhome")
        }
      };

      const newuser = {
        url: "/newuser",
        templateUrl: "../newuser.html",
        controller: require("../newuser/newuser.controller")
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
          [`navigation@${authorizationStates.rooms}`]: {
            templateUrl: "../navigation.html",
            controller: require("../navigation/navigation.controller")
          },
          [`newroom@${authorizationStates.rooms}`]: {
            templateUrl: "../newroom.html",
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
        views: {
          "": {
            templateUrl: "../room.html",
            controller: require("../room/room.controller")
          },
          [`roomsidebar@${authorizationStates.room}`]: {
            templateUrl: "../room.sidebar.html",
            controller: require("../room/sidebar/room.sidebar.controller")
          }
        }
      };

      $routeProvider.otherwise({templateUrl: "../index.html"});

      $stateProvider.state(authorizationStates.home, home);
      $stateProvider.state(authorizationStates.authorization, authorization);
      $stateProvider.state(authorizationStates.newuser, newuser);
      $stateProvider.state(authorizationStates.games, games);
      $stateProvider.state(authorizationStates.rooms, gamesRooms);
      $stateProvider.state(authorizationStates.room, gamesRoom);

      $locationProvider.html5Mode({enabled: true});
    }
  ]);
