/* jshint esversion: 6 */
// TODO add off events
const redisFactory = require("../app/authorization/app.redis");
const cookiesEvents = require("./cookies.events");
const socketsManagerFactory = require("../app/authorization/app.sockets.manager");
const messages = require("../app/app.messages");

const reqCookies = options => {
  let {events, socket} = options;
  events.forEach(event => socket.emit(event.name, event.data));
};

const resCookies = options => {
  let {event, callback, socket} = options;
  socket.on(event, data => callback(data));
};

const listenCookies = options => {
  let {events, socket} = options;
  events.forEach(event => resCookies({
    event: event.name,
    callback: event.callback,
    socket: socket
  }));
};

const stopListenCookies = options => {
    let {events, socket} = options;
    events.forEach(event => socket.off(event));
  };

const sendCookies =  options => {
    let {event, socket, cookies, time = 60 * 60 * 24 * 7, path = "/"} = options;
    cookies.forEach(cookie => {
      cookie.time = time;
      cookie.path = path;
    });
    socket.emit(event, cookies);
  };

///////////////////
// Authorization //
///////////////////

const reqAuthorizationCookies = options => {
    reqCookies({
      events: [{
        name: cookiesEvents.reqAuthorizationCookies,
        data: {
          cookies: ["login", "number"]
        }
      }],
      socket: options.socket
    });
  };

const listenAuthorizationCookies = options => {
  let {socket} = options;
  let callback = data => {
    authorizeCookies(data)
    .then(msg => {
      console.log(msg);
      socketsManagerFactory().register({login: data.login, socket: data.socket});
      socket.emit(cookiesEvents.resAuthorizedCookiesSuccess, {"login": data.login});
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
      .catch(reason => console.log(reason)) // TODO
      .finally(() => {
        /** Collect garbage */
        redis = null;
      });
    })
    .catch(reason => {
      console.log(reason);
      socket.emit(cookiesEvents.resAuthorizedCookiesFailure);
    });
  };

  listenCookies({
    events: [{
      name: cookiesEvents.resAuthorizationCookies,
      callback: data => callback(data)
    }],
    socket: socket
  });
};

const stopListenAuthorizationCookies = options => {
  stopListenCookies({
    events: [{
      name: cookiesEvents.resAuthorizationCookies
    }],
    socket: options.socket
  });
};

const sendAuthorizationCookies = options => {
  options.event = cookiesEvents.setAuthorizationCookies;
  sendCookies(options);
  console.log(messages.authorizeCookiesSent(options.cookies[0].value));
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
      .then(msg => {
        res(messages.authorizeCookiesSuccess(login));
      })
      .catch(reason => {
        // TODO
        rej(messages.authorizeCookiesFailure(login));
      })
      .finally(() => {
        /** Collect garbage */
        redis = null;
      });
    } else {
      rej(messages.authorizeCookiesFailure(login));
    }
  });
  return promise;
};

module.exports = {
  reqAuthorizationCookies: reqAuthorizationCookies,
  listenAuthorizationCookies: listenAuthorizationCookies,
  stopListenAuthorizationCookies: stopListenAuthorizationCookies,
  sendAuthorizationCookies: sendAuthorizationCookies
};
