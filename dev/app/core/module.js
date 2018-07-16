/* jshint esversion: 6 */
import angular from "angular";

import ngAnimate from "angular-animate";
import ngSanitize from "angular-sanitize";

/* eslint-disable no-unused-vars */
import userModule from "../user/module.exports";
import routerModule from "../router/module.exports";
import cookiesModule from "../cookies/module.exports";
import modalsModule from "../modals/module.exports";
/* eslint-enable no-unused-vars */

const mod = angular.module("app", [
  ngAnimate,
  ngSanitize,
  "userModule",
  "routerModule",
  "cookiesModule",
  "modalsModule"
 ]);

module.exports = mod;
