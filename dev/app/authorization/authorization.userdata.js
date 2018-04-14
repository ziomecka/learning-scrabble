/* jshint esversion: 6 */
angular
  .module("authorizationModule")
  .value("authorizationUserData", {
    login: undefined,
    roomId: undefined,
    authorized: false
  });
