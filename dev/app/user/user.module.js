/* jshint esversion: 6 */
import authorizationModule from "../authorization/authorization.module.exports";

const mod = angular.module("userModule", [
  "authorizationModule"
]);

module.exports = mod;
