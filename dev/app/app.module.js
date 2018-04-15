/* jshint esversion: 6 */
import angular from "angular";

import userModule from "./user/user.module.exports";
import routerModule from "./router/router.module.exports";
import roomsModule from "./rooms/rooms.module.exports";
import roomModule from "./room/room.module.exports";

import oclazyload from "oclazyload";

const mod = angular.module("app", [
  "oc.lazyLoad",
  "userModule",
  "routerModule",
  "roomsModule",
  "roomModule"
 ]);

module.exports = mod;
