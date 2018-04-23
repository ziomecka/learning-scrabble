/* jshint esversion: 6 */
class AuthorizationSocket {
  constructor (
    socketFactory,
    authorizationEvents
  ) {
    "ngInject";
    Object.assign(this, {
      socketFactory,
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
        this.socketFactory.off(event);
      });
      events = null;
    };

    this.socketFactory.on(events.resAuthorizeSuccess, data => {
      success(data);
      off();
    });

    this.socketFactory.on(events.resNoLogin, () => {
      failureLogin();
      off();
    });

    this.socketFactory.on(events.resAuthorizeFailure, () => {
      failurePassword();
      off();
    });

    this.socketFactory.emit(events.reqAuthorize, data);

    events = null;
  }
}

angular
  .module("authorizationModule")
  .service("authorizationSocket", AuthorizationSocket);
