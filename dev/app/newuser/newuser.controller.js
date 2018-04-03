/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "appService",
  "authorizationService",
  "authorizationStates",
  ($scope, appService, authorizationService, authorizationStates) => {
    const me = $scope;
    let loginNotUnique = false;
    me.login = "";
    me.password = "";

    me.goAuthorization = () => {
      authorizationService.go({state: authorizationStates.authorization});
    };

    me.createUser = data => {
      const failureLogin = () => loginNotUnique = true;
      appService.createUser({
        data: data,
        callback: {
          failureLogin: failureLogin
        }
      });
    };
  }
];
