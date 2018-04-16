/* jshint esversion: 6 */
import angular from "angular";

import ngAnimate from "angular-animate";

import userModule from "./user/user.module.exports";
import routerModule from "./router/router.module.exports";
import cookiesModule from "./cookies/cookies.module.exports";

const mod = angular.module("app", [
  ngAnimate,
  "userModule",
  "routerModule",
  "cookiesModule"
 ]);

module.exports = mod;
