/* jshint esversion: 6 */
angular
  .module("authorizationModule")
  .service("authorizationSocket", [
    "socketService",
    "authorizationEvents",
    function (socketService, authorizationEvents) {
      this.authorize = options => {
        let {data, callbacks: {success, failureLogin, failurePassword}} = options;

        let off = () => {
          socketService.off(authorizationEvents.resAuthorizeSuccess);
          socketService.off(authorizationEvents.resNoLogin);
          socketService.off(authorizationEvents.resAuthorizeFailure);
        };

        socketService.emit(authorizationEvents.reqAuthorize, data);

        socketService.on(authorizationEvents.resAuthorizeSuccess, data => {
          success(data);
          off();
        });

        socketService.on(authorizationEvents.resNoLogin, () => {
          failureLogin();
          off();
        });

        socketService.on(authorizationEvents.resAuthorizeFailure, () => {
          failurePassword();
          off();
        });
      };
    }
  ]);
