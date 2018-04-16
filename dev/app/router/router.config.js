/* jshint esversion: 6 */
// TODO what if url address is incorrect
angular
  .module("routerModule")
  .config(($routeProvider, $locationProvider, $stateProvider, routerStates) => {
    "ngInject";

    const home = {
      url: "/",
      templateUrl: "../index.html",
      controller: require("../home/app.controller"),
      controllerAs: "appCtrl",
      resolve: {
        authorizeCookie: require("./resolve/resolve.home.authorizecookie")
      }
    };

    const authorization = {
      url: "authorization",
      resolve: {
        loadAuthorizationModule: require("./resolve/resolve.load.authorization.module"),
        fromApp: require("./resolve/resolve.fromhome")
      },
      views: {
        "main": {
          templateUrl: "../authorization.html",
          controller: require("../authorization/controllers/authorization.controller"),
          controllerAs: "authorizationCtrl",
        }
      }
    };

    const newuser = {
      url: "newuser",
      resolve: {
        loadNewUserModule: require("./resolve/resolve.load.newuser.module")
      },
      views: {
        "main": {
          templateUrl: "../newuser.html",
          controller: require("../newuser/newuser.controller"),
        }
      }
    };

    const games = {
      abstract: true,
      resolve: {
        authorizeCookie: require("./resolve/resolve.home.authorizecookie")
        // user: require("./resolve/resolve.games.user"), // TODO out because done in cookies?
      },
      views: {
        "main": {
          template: "<ui-view/>"
        }
      }
    };

    const gamesRooms = {
      url: "rooms",
      resolve: {
        loadRoomsModule: require("./resolve/resolve.load.rooms.module"),
        roomsList: require("./resolve/resolve.rooms.roomslist")
      },
      views: {
        "": {
          templateUrl: "../rooms.html",
          controller: require("../rooms/rooms.controller"),
          controllerAs: "roomsCtrl"
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
      url: "rooms/room/:roomId",
      resolve: {
        loadRoomModule: require("./resolve/resolve.load.room.module"),
        // roomData: require("./resolve/resolve.room.roomdata"),
        // narrowTitle: require("./resolve/resolve.room.narrowtitle")
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
);
