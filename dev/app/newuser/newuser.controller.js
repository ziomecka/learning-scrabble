/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "appTalkService",
  "authorizationService",
  "authorizationStates",
  ($scope, appTalkService, authorizationService, authorizationStates) => {
    const me = $scope;
    let loginNotUnique = false;
    me.login = "";
    me.password = "";

    me.goAuthorization = () => {
      authorizationService.go({state: authorizationStates.authorization});
    };

    me.createUser = data => {
      const failureLogin = () => loginNotUnique = true;
      appTalkService.createUser({
        data: data,
        callback: {
          failureLogin: failureLogin
        }
      });
    };
  }
];
