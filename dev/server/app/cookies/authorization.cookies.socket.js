/* jshint esversion: 6 */
// TODO add off events
const redisFactory = require("../authorization/authorization.redis");
const authorizationCookiesEvents = require("./authorization.cookies.events");
const socketsManager = require("../authorization/authorization.sockets.manager");
const authorizationCookiesMessages = require("./authorization.cookies.messages");
const cookiesSocketFactory = require("./cookies.socket");

const socket = data => {
  let {socket} = Object(data);

  const reqAuthorizationCookies = () => {
    cookiesSocketFactory.reqCookies({
      events: [{
        name: authorizationCookiesEvents.reqAuthorizationCookies,
        data: {
          cookies: ["login", "number"]
        }
      }],
      socket: socket
    });
  };

  const listenAuthorizationCookies = () => {
    // success
    let callback = data => {
      // success(data);
      authorizeCookies(data)
      .then(msg => {
        console.log(msg);

        // socketsManager.updateSocket({
        //   [socket.id]: {
        //     authorized: true,
        //     login: data.login
        //   }
        // });

        socketsManager.addSocket({
          "socketId": socket.id,
          "login": data.login,
          "authorized": true
          // "state": stateFrom,
          // "roomId": roomId
        });

        socket.emit(authorizationCookiesEvents.resAuthorizedCookiesSuccess, {"login": data.login});

        let redis = redisFactory();
        redis.refreshCookies(data)
        .then(data => {
          let {login, longNumber} = data;
            sendAuthorizationCookies(
              {
              "socket": socket,
              "cookies": [{
                name: "myscrabbleLogin",
                value: login
              },
              {
                name: "myscrabbleNumber",
                value: longNumber,
              }
            ]
          });
        })
        .catch(err => {
          console.log(err); // TODO
        })
        .finally(() => {
          /** Collect garbage */
          redis = null;
        });
      })
      .catch(err => {
        console.log(err);
        socket.emit(authorizationCookiesEvents.resAuthorizedCookiesFailure);
      });
    };

    cookiesSocketFactory.listenCookies({
      events: [{
        name: authorizationCookiesEvents.resAuthorizationCookies,
        callback: data => callback(data)
      }],
      socket: socket
    });
  };

  const stopListenAuthorizationCookies = () => {
    cookiesSocketFactory.stopListenCookies({
      events: [{
        name: authorizationCookiesEvents.resAuthorizationCookies
      }],
      socket: socket
    });
  };

  const sendAuthorizationCookies = options => {
    options.event = authorizationCookiesEvents.setAuthorizationCookies;
    // console.log("I will send: " + JSON.stringify(options))
    cookiesSocketFactory.sendCookies(options);
    console.log(authorizationCookiesMessages.authorizeCookiesSent(options.cookies[0].value));
  };

  const authorizeCookies = data => {
    let {login, number} = data;
    let promise = new Promise((res, rej) => {
      /** If cookies login and number are not undefined then
          authorize via cookie.
          Else: inform socket about authorization failure.
          */
      if (login !== undefined && login !== null && number !== undefined && number !== null) {
        console.log("Cookies received.");
        let redis = redisFactory();
        redis.authorizeUser({
          login: login,
          password: number,
          option: "number"
        })
        .then(() => {
          // console.log(msg);
          res(authorizationCookiesMessages.authorizeCookiesSuccess(login));
        })
        .catch(err => {
          // TODO
          console.log(err);
          rej(authorizationCookiesMessages.authorizeCookiesFailure(login));
        })
        .finally(() => {
          /** Collect garbage */
          redis = null;
        });
      } else {
        rej(authorizationCookiesMessages.authorizeCookiesFailure(login));
      }
    });
    return promise;
  };

  const destroy = () => {
    stopListenAuthorizationCookies();
    socket = null;
  };

  return {
    name: "authorizationCookies",
    reqAuthorizationCookies: reqAuthorizationCookies,
    listen: listenAuthorizationCookies,
    stopListen: stopListenAuthorizationCookies,
    destroy: destroy,
    sendAuthorizationCookies: sendAuthorizationCookies
  };
}

module.exports = {
  socket: socket
};
