/* jshint esversion: 6 */
// TODO add off events
const redis = require("../app/app.user").redis;
const cookiesEvents = require("./cookies.events");

const cookies = (options) => {
  let {socket} = options;

  const reqCookies = options => {
    let {events} = options;
    events.forEach(event => socket.emit(event.name, event.data));
  };

  const resCookies = options => {
    let {event, callback} = options;
    socket.on(event, data => callback(data));
  };

  const listenCookies = options => {
    let {events} = options;
    events.forEach(event => resCookies({
      event: event.name,
      callback: event.callback
    }));
  };

  const stopListenCookies = options => {
    let {events} = options;
    events.forEach(event => socket.off(event));
  };

  const listenAuthorizationCookies = options => {
    listenCookies({
      events: [{
        name: cookiesEvents.resAuthorizationCookies,
        callback: data => authorizeCookies(data)
      }]
    });
  };

  const stopListenAuthorizationCookies = options => {
    stopListenCookies({
      events: [{
        name: cookiesEvents.resAuthorizationCookies
      }]
    });
  };

  const reqAuthorizationCookies = options => {
    reqCookies({
      events: [{
        name: cookiesEvents.reqAuthorizationCookies,
        data: {
          cookies: ["login", "number"]
        }
      }]
    });
  };

  const authorizeCookies = data => {
      /** If cookies login and number are not undefined then
          authorize via cookie.
          Else: inform socket about authorization failure.
          */
      if (data.login !== undefined && data.login !== null  && data.number !== undefined && data.number !== null) {
        console.log("Cookie received.");
        redis.authorizeUser({
          login: data.login,
          password: data.number,
          socket: socket,
          option: "number",
          callbackEvent: cookiesEvents.resAuthorizedCookies
        });
      } else {
        socket.emit(serverEvents.resAuthorizeFailed);
      }
  };

  return {
    listenAuthorizationCookies: listenAuthorizationCookies,
    reqAuthorizationCookies: reqAuthorizationCookies,
    stopListenAuthorizationCookies: stopListenAuthorizationCookies
  };
};

module.exports = cookies;
