/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "newuserSocket",
  "authorizationService",
  "authorizationStates",
  ($scope, newuserSocket, authorizationService, authorizationStates) => {
    const me = $scope;
    let loginNotUnique = false;
    me.login = "";
    me.password = "";

    me.goAuthorization = () => {
      authorizationService.go({state: authorizationStates.authorization});
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
