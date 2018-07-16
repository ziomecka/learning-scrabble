/* jshint esversion: 6 */
class Socket {
  constructor (
    socketFactory
  ) {
    "ngInject";

    Object.assign(this, {
      socketFactory
    });
  }
}

angular // eslint-disable-line no-undef
  .module("roomModule")
  .service("gameObserverSocket", Socket);
