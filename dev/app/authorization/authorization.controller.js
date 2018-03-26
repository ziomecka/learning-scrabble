/* jshint esversion: 6 */
angular
.module("authorizationModule")
.controller("authorizationController", [
  "$scope",
  "$rootScope",
  "$location",
  "$state",
  "clientService",
  "authorizationService",
  ($scope, $rootScope, $location, $state, clientService, authorizationService) => {
  const me = $scope;
  me.loginDoesNotExist = false;
  me.passwordIncorrect = false;
  me.login = "";
  me.password = "";

  me.loginUser = data => clientService.emit("auth: authorize user", data);

  clientService.on("auth: login does not exist", () => {
    me.loginDoesNotExist = true;
  });

  clientService.on("auth: authorized", () => {
    $rootScope.user = me.login;
    $rootScope.authorized = true;
    authorizationService.go({login: me.login});
  });

  // TODO
  clientService.on("auth: incorrect password", () => {
    me.passwordIncorrect = true;
  });
}]);
