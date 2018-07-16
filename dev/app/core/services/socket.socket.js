/* jshint esversion: 6 */
class Service  {
  constructor (
    socketFactory,
    serverEvents
  ) {
    "ngInject";

    Object.assign(this, {
      socketFactory,
      serverEvents
    });
  }

  changeState (options) {
    let {roomIdTo, roomIdFrom, state, collection} = options;

    options.emit = {
      eventName: this.serverEvents.reqSocketStateChanged,
      data: {
        state: state,
        collection: collection,
        roomIdTo: roomIdTo,
        roomIdFrom: roomIdFrom
      }
    };
    options.events = [
      {
        eventName: this.serverEvents.reqSocketStateChangedSuccess,
        callback: data => {
          options.success(data);
          // success = null;
          // failure = null;
        }
      },
      {
        eventName: this.serverEvents.reqSocketStateChangedFailure,
        callback: data => {
          options.failure(data);
          // success = null;
          // failure = null;
        }
      }
    ];

    this.socketFactory.emitHandler(options);
  }
}

angular // eslint-disable-line no-undef
  .module("app")
  .service("socketSocket", Service);
