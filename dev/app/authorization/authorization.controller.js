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
  "clientEvents",
  ($scope, $rootScope, $location, $state, clientService, authorizationService, clientEvents) => {
    const me = $scope;
    me.resNoLogin = false;
    me.resAuthorizeFailed = false;
    me.buttonsDisabled = false;
    me.login = "";
    me.password = "";

    me.loginUser = data => {
      clientService.emit(clientEvents.reqAuthorize, data);
      me.resNoLogin = false;
      me.resAuthorizeFailed = false;
      me.buttonsDisabled = true;
    };

    clientService.on(clientEvents.resAuthorizeSuccess, () => {
      $rootScope.user = me.login;
      $rootScope.authorized = true;
      authorizationService.go({login: me.login});
    });

    clientService.on(clientEvents.resNoLogin, () => {
      me.buttonsDisabled = false;
      me.resNoLogin = true;
    });

    clientService.on(clientEvents.resAuthorizeFailed, () => {
      me.buttonsDisabled = false;
      me.resAuthorizeFailed = true;
    });
  }
]);
