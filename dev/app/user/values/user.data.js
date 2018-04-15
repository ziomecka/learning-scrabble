/* jshint esversion: 6 */
angular
  .module("userModule")
  .value("userData", {
    login: undefined,
    roomId: undefined,
    authorized: false
  });
