/* jshint esversion: 6 */

angular
.module("app")
.controller("appController", [
  "$scope",
  "$rootScope",
  "clientService",
  "authorizationService",
  "clientEvents",
  ($scope, $rootScope, clientService, authorizationService, clientEvents) => {
  let me = $scope;
  me.user = "";
  me.$watch("authorized", newValue => me.authorized = newValue);
  me.authorized = authorizationService.authorized;
  me.guest = $rootScope.guest;
  me.logout = () => authorizationService.clear();
  clientService.on(clientEvents.resConnected, data => console.log("I'm connected"));
  clientService.on("disconnect", () => console.log("I have been disconnected"));
  //clientService.getSocket().removeAllListeners();
}]);
