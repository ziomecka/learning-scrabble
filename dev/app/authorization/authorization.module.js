/* jshint esversion: 6 */
import ngRoute from "angular-route";
import uiRouter from "@uirouter/angularjs";
import ngAnimate from "angular-animate";
import ngCookies from "angular-cookies";

import cookiesModule from "../cookies/cookies.module.exports";

const mod = angular.module("authorizationModule", [
  ngRoute,
  uiRouter,
  ngAnimate,
  ngCookies,
  "cookiesModule"
]);

module.exports = mod;
