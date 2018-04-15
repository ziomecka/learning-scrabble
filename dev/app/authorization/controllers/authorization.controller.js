/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "authorizationLoginService",
  "routerStates",
  "routerGoService",
  function ($scope, authorizationLoginService, routerStates, routerGoService) {
    const me = $scope;

    me.login = "";
    me.password = "";

    me.loginData = authorizationLoginService.data;
    me.$watch("loginState", newValue => {
      me.loginState = newValue;
    }, true);

    me.goNewuser = () => {
      routerGoService.go({state: routerStates.newuser});
    };

    me.loginUser = data => {
      authorizationLoginService.login(data);
    };
  }
];
