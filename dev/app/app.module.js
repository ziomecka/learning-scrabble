/* jshint esversion: 6 */
import angular from "angular";

import authorizationModule from "./authorization/authorization.module.exports";
import roomsModule from "./rooms/rooms.module.exports";
import roomModule from "./room/room.module.exports";

import oclazyload from "oclazyload";

const mod = angular.module("app", [
  "oc.lazyLoad",
  "authorizationModule",
  "roomsModule",
  "roomModule"
 ]);

module.exports = mod;
