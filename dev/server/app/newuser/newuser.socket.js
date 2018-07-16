/* jshint esversion: 6 */

/** Listen to newuser events */
const redisFactory = require("../authorization/authorization.redis");
const sendAuthorizationCookies = require("../cookies/authorization.cookies.socket").socket().sendAuthorizationCookies;
const newuserEvents = require("./newuser.events");
const newuserMessages = require("./newuser.messages");

const socket = data => {
  let {socket, io} = data;

  const listenNewuser = () => {
    /** Add new user. */
    socket.on(newuserEvents.reqNewuser, data => {
      console.log("data" + JSON.stringify(data));
      data.socket = socket;
      let redis = redisFactory();
      redis.addUsernx(data)
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
            value: longNumber,
          }]
        });
        socket.emit(newuserEvents.resNewuserSuccess, {"login": data.login});
        /** Listen rooms events */
        // roomsSocketFactory.roomsSocket({"socket": socket, "io": io}).listen();
        console.log(newuserMessages.userCreateSuccess(login));
      })
      .catch(err => {
        socket.emit(newuserEvents.resDuplicatedLogin);
        console.log(err);
      })
      .finally(() => {
        /** Collect garbage. */
        redis = null;
      });
    });
  };

  const stopListenNewuser = () => {
    socket.removeAllListeners(newuserEvents.reqNewuser);
  };

  const listen = () => {
    listenNewuser();
  };

  const stopListen = () => {
    stopListenNewuser();
  };

  const destroy = () => {
    stopListen();
    socket = null;
    io = null;
  };

  return {
    name: "newuser",
    listen: listen,
    stopListen: stopListen,
    destroy: destroy
  };
};

module.exports = {
  socket: socket
};
