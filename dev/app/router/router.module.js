/* jshint esversion: 6 */
import ngRoute from "angular-route";
import uiRouter from "@uirouter/angularjs";
import oclazyload from "oclazyload";

const mod = angular.module("routerModule", [
  ngRoute,
  uiRouter,
  "oc.lazyLoad"
]);

module.exports = mod;
