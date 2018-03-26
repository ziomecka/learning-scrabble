/* jshint esversion: 6 */
angular
.module("newuserModule")
.controller("newuserController", [
  "$scope",
  "$rootScope",
  "$location",
  "$state",
  "clientService",
  "authorizationService",
  "clientEvents",
  ($scope, $rootScope, $location, $state, clientService, authorizationService, clientEvents) => {
  const me = $scope;
  let loginNotUnique = false;
  me.login = "";
  me.password = "";

  me.createUser = data => clientService.emit(clientEvents.reqNewuser, data);
  me.loginUser = () => authorizationService.go("authorization");
  clientService.on("auth: login already exists", () => loginNotUnique = true);

  clientService.on("auth: user created", () => {
    $rootScope.user = me.login;
    $rootScope.authorized = true;
    authorizationService.go({login: me.login});
  });
}]);
