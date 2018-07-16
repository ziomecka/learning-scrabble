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

  // listen (listens) {
  //   listens.forEach(event => {
  //     this.socketFactory.onHandler({
  //       eventName: event.name,
  //       callback: event.callback,
  //       infinity: true
  //     });
  //   });
  // }
  //
  // stopListen (events) {
  //   events.forEach(event => {
  //     this.socketFactory.off(event);
  //   });
  // }
}

angular // eslint-disable-line no-undef
  .module("roomModule")
  .service("roomSocket", Socket);
