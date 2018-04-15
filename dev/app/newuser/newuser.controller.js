/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "newuserSocket",
  "authorizationService",
  "routerStates",
  "routerGoService",
  ($scope, newuserSocket, authorizationService, routerStates, routerGoService) => {
    const me = $scope;
    let loginNotUnique = false;
    me.login = "";
    me.password = "";

    me.goAuthorization = () => {
      routerGoService.go({state: routerStates.authorization});
    };

    me.createUser = data => {
      const failureLogin = () => loginNotUnique = true;
      newuserSocket.createUser({
        data: data,
        callbacks: {
          failureLogin: failureLogin
        }
      });
    };
  }
];
