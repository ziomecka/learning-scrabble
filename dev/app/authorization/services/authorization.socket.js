/* jshint esversion: 6 */
class AuthorizationSocket {
  constructor (
    socketService,
    authorizationEvents
  ) {
    "ngInject";
    Object.assign(this, {
      socketService,
      authorizationEvents
    });
  }

  login (options) {
    let {data, callbacks: {success, failureLogin, failurePassword}} = options;
    let events = this.authorizationEvents;

    let off = () => {
      let events = this.authorizationEvents;
      [
        events.resAuthorizeSuccess,
        events.resNoLogin,
        events.resAuthorizeFailure
      ].forEach(event => {
        this.socketService.off(event);
      });
      events = null;
    };

    this.socketService.on(events.resAuthorizeSuccess, data => {
      success(data);
      off();
    });

    this.socketService.on(events.resNoLogin, () => {
      failureLogin();
      off();
    });

    this.socketService.on(events.resAuthorizeFailure, () => {
      failurePassword();
      off();
    });

    this.socketService.emit(events.reqAuthorize, data);

    events = null;
  }
}

angular
  .module("authorizationModule")
  .service("authorizationSocket", AuthorizationSocket);
