/* jshint esversion: 6 */
import ngRoute from "angular-route";
import uiRouter from "@uirouter/angularjs";
import cookiesModule from "../cookies/cookies";

angular.module("authorizationModule", [
  ngRoute,
  uiRouter,
  "cookiesModule"
]);
