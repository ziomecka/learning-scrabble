/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "authorizationSocket",
  "authorizationService",
  "authorizationStates",
  function ($scope, authorizationSocket, authorizationService, authorizationStates) {
    const me = $scope;

    // TODO move to authorizationService?
    const authorize = data => {
      authorizationService.authorize(data);
      authorizationService.go();
    };

    me.resNoLogin = false;
    me.resAuthorizeFailure = false;
    me.buttonsDisabled = false;
    me.login = "";
    me.password = "";

    me.goNewuser = () => {
      authorizationService.go({state: authorizationStates.newuser});
    };

    me.loginUser = data => {
      me.resNoLogin = false;
      me.resAuthorizeFailure = false;
      me.buttonsDisabled = true;
      authorizationSocket.authorize({
        data: data,
        callbacks: {
          success: data => authorize(data),
          failureLogin: () => {
            me.buttonsDisabled = false;
            me.resNoLogin = true;
          },
          failurePassword: () => {
            me.buttonsDisabled = false;
            me.resAuthorizeFailure = true;
          }
        }
      });
    };
  }
];
