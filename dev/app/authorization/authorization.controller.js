/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "authorizationService",
  "authorizationLoginService",
  "authorizationStates",
  function ($scope, authorizationService, authorizationLoginService, authorizationStates) {
    const me = $scope;

    me.login = "";
    me.password = "";

    me.loginData = authorizationLoginService.data;
    me.$watch("loginState", newValue => {
      me.loginState = newValue;
    }, true);

    me.goNewuser = () => {
      authorizationService.go({state: authorizationStates.newuser});
    };

    me.loginUser = data => {
      authorizationLoginService.login(data);
    };
  }
];
