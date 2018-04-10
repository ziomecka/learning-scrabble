/* jshint esversion: 6 */

/** Authentication. */
const redisFactory = require("./authorization.redis");
const sendAuthorizationCookies = require("../cookies/cookies").sendAuthorizationCookies;
const authorizationEvents = require("./authorization.events");
const authorizationMessages = require("./authorization.messages");
const socketsManagerFactory = require("./authorization.sockets.manager");
const roomsSocketFactory = require("../rooms/rooms.socket");

const authorizationSocket = data => {
  let {socket, io} = data;

  const listenAuthorizeUser = () => {
    /** Authorize user. */
    socket.on(authorizationEvents.reqAuthorize, data => {
      let {login, password} = data;
      console.log(`Authorizing user: ${data.login}`);
      let redis = redisFactory();
      redis.authorizeUser(data)
      .then(msg => {
        socketsManagerFactory().update({"socket": socket.id, "login": login});
        socket.emit(authorizationEvents.resAuthorizeSuccess, {"login": login});

        /** Listen rooms events */
        roomsSocketFactory.roomsSocket({"socket": socket, "io": io}).listen();

        /** Stop listnening authorize ??? TODO  //

        /** Refresh cookies */
        let redis = redisFactory();
        redis.refreshCookies({"login": data.login, "socket": socket})
        .then(data => {
          let {login, longNumber} = data;
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
        })
        .catch(reason => console.log(reason))
        .finally(() => {
          /** Collect garbage */
          redis = null;
        });
      })
      .catch(reason => {
        // TODO
        socket.emit(authorizationEvents.resAuthorizeFailure);
        console.log(reason);
      })
      .finally(() => {
        /** Collect garbage */
        redis = null;
      });
    });
  };

  const stopListenAuthorizeUser = () => {
    socket.removeAllListeners(authorizationEvents.reqAuthorize);
  };

  const listen = () => {
    listenAuthorizeUser();
  };

  const stopListen = () => {
    stopListenAuthorizeUser();
  };

  const destroy = () => {
    socket = null;
    io = null;
  };

  return {
    listen: listen,
    stopListen: stopListen,
    destroy: destroy
  };
};

module.exports = {
  authorizationSocket: authorizationSocket
};
