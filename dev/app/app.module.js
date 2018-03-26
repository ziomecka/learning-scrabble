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

import authorizationModule from "./authorization/authorization";
import newuserModule from "./newuser/newuser";
import newroomModule from "./newroom/newroom";
import roomsModule from "./rooms/rooms";
import roomModule from "./room/room";

angular.module("app")
.run(["$trace", function($trace) {$trace.enable("TRANSITION");}])
.value("route", domain);

// .factory("_", ["$window", lodashFactory])
// import has from "lodash/has";
// import lodashFactory from "./core/lodash.factory";
