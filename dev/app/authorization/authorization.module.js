/* jshint esversion: 6 */
import ngAnimate from "angular-animate";
import ngCookies from "angular-cookies";

import cookiesModule from "../cookies/cookies.module.exports";

const mod = angular.module("authorizationModule", [
  ngAnimate,
  ngCookies,
  "cookiesModule"
]);

module.exports = mod;
