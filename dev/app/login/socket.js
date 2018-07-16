/* jshint esversion: 6 */
class Service {
  constructor (
    socketFactory,
    loginEvents
  ) {
    "ngInject";
    Object.assign(this, {
      socketFactory,
      loginEvents
    });
  }

  login (options) {
    let {data, callbacks: {success, failureLogin, failurePassword, failureOther}} = options;
    let events = this.loginEvents;

    let off = () => {
      let events = this.loginEvents;
      [
        events.resAuthorizeSuccess,
        events.resAuthorizeLoginFailure,
        events.resAuthorizePasswordFailure,
        events.resAuthorizeDataFailure
      ].forEach(event => {
        this.socketFactory.off(event);
      });
      events = null;
    };

    this.socketFactory.on(events.resAuthorizeSuccess, () => {
      /** Carefully: not the data received from the socketFactory, but
          the former data i.e. data passed to this.login().
          */
      success(data);
      off();
    });

    this.socketFactory.on(events.resAuthorizeLoginFailure, () => {
      failureLogin();
      off();
    });

    this.socketFactory.on(events.resAuthorizePasswordFailure, () => {
      failurePassword();
      off();
    });

    this.socketFactory.on(events.resAuthorizeDataFailure, () => {
      failureOther();
      off();
    });

    this.socketFactory.emit(events.reqAuthorize, data);

    events = null;
  }
}

angular // eslint-disable-line no-undef
  .module("loginModule")
  .service("loginSocket", Service);
