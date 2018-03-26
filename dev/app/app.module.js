/* jshint esversion: 6 */
import angular from "angular";
import ngRoute from "angular-route";
import uiRouter from "@uirouter/angularjs";

const domain = "http://localhost:5000";


angular.module("app", [
  ngRoute,
  uiRouter,
  "authorizationModule",
  "newuserModule",
  "newroomModule",
  "roomsModule",
  "roomModule"
 ]);


import authorizationModule from "./authorization/authorization.module";
import authorizationConfig from "./authorization/authorization.config";
import authorizationComponent from "./authorization/authorization.component";
import authorizationService from "./authorization/authorization.service";
import authorizationController from "./authorization/authorization.controller";
import authorizationErrorHandler from "./authorization/authorization.errorhandler";

import newuserModule from "./newuser/newuser";
// import newuserComponent from "./newuser/newuser.component";
// import newuserController from "./newuser/newuser.controller";

import newroomModule from "./newroom/newroom";
// import newroomComponent from "./newroom/newroom.component";
// import newroomController from "./newroom/newroom.controller";

import roomsModule from "./rooms/rooms.module";
import roomsComponent from "./rooms/rooms.component";
import roomsController from "./rooms/rooms.controller";

import roomModule from "./room/room";
// import roomModule from "./room/room.module";
// import roomComponent from "./room/room.component";
// import roomController from "./room/room.controller";

// import scrabbleModule from "../scrabble/scrabble";
// import scrabbleDefaults from "./scrabble/scrabble.defaults";
// import scrabbleService from "./scrabble/scrabble.service";
// import scrabbleViewService from "./scrabble/scrabble.view.service";

angular.module("app")
.run(["$trace", function($trace) {$trace.enable("TRANSITION");}])
.value("route", domain);

  // .factory("_", ["$window", lodashFactory])
  //  .directive("verifypass", ["$scope", verifypassDirective])"
  // import has from "lodash/has";
  // import verifypassDirective from "./authorization/verifypass.directive";
  // import lodashFactory from "./core/lodash.factory";
