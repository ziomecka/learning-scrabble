/* jshint esversion: 6 */

/** Login, socketId */
const sockets = new Map();

const socketsManager = () => {
  const register = data => {
    const result = sockets.set(data.socket, data.login = "");
    // TODO only when dev?
    if (result instanceof Map) {
      console.log("Socket registered.");
    }
  };

  const unregister = data => {
    const result = sockets.delete(data.socket);
    if (result) {
      console.log("Socket unregistered.");
    } else {
      console.log("Socket unregistered failure.");
    }
  };

  const update = data => {
    sockets.set([data.socket, data.login = undefined]);
  };

  const getSocket = login => {
    for (let [key, value] of sockets.entries()) {
      if (value === login) {
        return key;
      }
    }
    return null;
  };

  const getLogin = socket => {
    sockets.get(socket);
  };

  return {
    register: register,
    unregister: unregister,
    update: update,
    getSocket: getSocket,
    getLogin: getLogin
  };
};

module.exports = socketsManager;