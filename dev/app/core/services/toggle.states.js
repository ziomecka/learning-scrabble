/* jshint esversion: 6 */
class CoreToggleStatesService {
  constructor (
    lodashFactory
  ) {
    "ngInject";

    /** Services */
    Object.assign(this, {
      lodashFactory
    });
  }

  /** Turns on anf off listeners needed in current state. */
  toggleStateSockets (options) {
    let {statesServices, stateSockets, state, activeSockets} = options

    if (Object.keys(statesServices).includes(state)) {
      /** Find sockcets common to active sockets and sockets of the new state */
      let doNothing = this.lodashFactory.intersection(stateSockets, activeSockets);

      /** For each socket run method. */
      let runSockets = function (options) {
        let {sockets, method} = Object(options);
        if (Array.isArray(sockets)) {
          sockets.forEach(socket => {
            if (socket !== undefined && !doNothing.includes(socket) && Object.getPrototypeOf(socket).hasOwnProperty(method)) {
              socket[method]();
              console.log(method + " " + socket.constructor.name);
            }
          }, this);
        }
        sockets = null;
      }.bind(this);

      /** Stop listen */
      runSockets({
        "sockets": activeSockets,
        "method": "stopListen"
      });

      // if (Array.isArray(activeSockets)) {
      //   activeSockets.forEach(socket => {
      //     if (socket !== undefined && !doNothing.includes(socket) && Object.getPrototypeOf(socket).hasOwnProperty("stopListen")) {
      //       socket.stopListen();
      //       console.log("Stops listening to: " + socket.constructor.name);
      //     }
      //   }, this);
      // }

      /** Start listen */
      runSockets({
        "sockets": stateSockets,
        "method": "listen"
      });
      // if (Array.isArray(stateSockets)) {
      //   stateSockets.forEach(socket => {
      //     if (socket !== undefined && !doNothing.includes(socket) && Object.getPrototypeOf(socket).hasOwnProperty("listen")) {
      //       socket.listen();
      //       console.log("Starts listening to: " + socket.constructor.name);
      //     }
      //   }, this);
      // }

      activeSockets = null;
      statesServices = null;
      doNothing = null;
      runSockets = null;
      return stateSockets;
    } else {
      activeSockets = null;
      statesServices = null;
      console.log("State dose not exist.");
    }
  }
}

angular // eslint-disable-line no-undef
  .module("app")
  .service("coreToggleStatesService", CoreToggleStatesService);
