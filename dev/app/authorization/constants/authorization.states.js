/* jshint esversion: 6 */
angular
  .module("authorizationModule")
  .constant("authorizationStates", new Map([
    ["waiting", "waiting"],
    ["failureLogin", "failureLogin"],
    ["failurePassword", "failurePassword"],
    ["success", "success"]
  ]));
