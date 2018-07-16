/* jshint esversion: 6 */

/** Authentication. */
const redisFactory = require("./authorization.redis");
const sendAuthorizationCookies = require("../cookies/authorization.cookies.socket").socket().sendAuthorizationCookies;
const loginEvents = require("./authorization.events");
const authorizationMessages = require("./authorization.messages");
const socketsManager = require("./authorization.sockets.manager");

const socket = data => {
  let {socket, io} = data;

  const listenAuthorizeUser = () => {
    /** Authorize user. */
    socket.on(loginEvents.reqAuthorize, data => {
      let {login} = data;

      let authorizationCallback = msg => {
        if (msg) console.log(msg);

        /** Update socket in sockets manager. */
        socketsManager.addSocket({
          "socketId": socket.id,
          "login": login,
          "authorized": true  
          // "state": stateFrom,
          // "roomId": roomId
        });
        // socketsManager.updateSocket({
        //   [socket.id]: {
        //     "login": login
        //   }
        // });

        /** Inform socket about success. */
        socket.emit(loginEvents.resAuthorizeSuccess, {"login": login});
        console.log(authorizationMessages.authorizeSuccess(login));

        /** Listen to rooms events. */
        // roomsSocketFactory.roomsSocket({"socket": socket, "io": io}).listen();

        // Stop listnening authorize ??? TODO

        /** Send authorization cookies. */
        // DONOT DELETE - redis authorization
        let refreshCookiesCallback = data => {
          let {login, longNumber, socket} = data;
          sendAuthorizationCookies({
            "socket": socket,
            "cookies": [{
              name: "myscrabbleLogin",
              value: login
            },
            {
              name: "myscrabbleNumber",
              value: longNumber
            }]
          });
          socket = null;
        };

        /** Refresh authorization cookies. */
        redisFactory().refreshCookies({"login": data.login, "socket": socket})
        .then(data => {
          /** Send authorization cookies. */
          refreshCookiesCallback(data);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          /** Collect garbage */
          refreshCookiesCallback = null;
        });
      };

      // authorizationCallback();
      // authorizationCallback = null;

    // DONOT DELETE - redis authorization
    //   /** Authorize user */
      redisFactory().authorizeUser(data)
      .then(msg => {
        /** Update socket in sockets manager.
            Inform socket about success.
            Listen to rooms events. TODO after joining the rooms.
            Refresh authorization cookies.
            */
        authorizationCallback(msg);
      })
      .catch(err => {
        // TODO improve
        let ev;
        switch (true) {
          case (err === authorizationMessages.authorizePasswordFailure(login)):
            ev = loginEvents.resAuthorizePasswordFailure;
            break;
          case (err === authorizationMessages.authorizeDataFailure()):
            ev = loginEvents.resAuthorizeDataFailure;
            break;
          case (err == authorizationMessages.authorizeLoginFailure(login)):
            ev = loginEvents.resAuthorizeLoginFailure
            break;
          default:
            ev = loginEvents.resAuthorizeDataFailure;
        }
        socket.emit(ev);
        console.log(err);
      })
      .finally(() => {
        /** Collect garbage */
        authorizationCallback = null;
      });
    });
  };

  const stopListenAuthorizeUser = () => {
    socket.removeAllListeners(loginEvents.reqAuthorize);
  };

  const listen = () => {
    listenAuthorizeUser();
  };

  const stopListen = () => {
    stopListenAuthorizeUser();
  };

  const destroy = () => {
    stopListen();
    socket = null;
    io = null;
  };

  return {
    name: "login",
    listen: listen,
    stopListen: stopListen,
    destroy: destroy
  };
};

module.exports = {
  socket: socket
};
