/* jshint esversion: 6 */
const authorizationMessages = require("./authorization.messages");
// const redis = require("../../core/sockets-manager/sockets.manager.redis")();

class SocketsManager {
  constructor () {
    // this.io = io;
    /** @type {Map}  {socketId: {login, state, authorized}} */
    this._sockets = new Map();
    this._properties = ["login", "authorized", "state"];
  }

  get sockets () {
    return this._sockets;
  }

  getId (login) {
    let socket = this._sockets.get(String(login));
    if (Object(socket) === socket) {
      let id = socket.id;
      socket = null;
      return id;
    }
    return undefined;
  }

  getLogin (id) {
    return Array.from(this._sockets.entries())
    .filter(entry => {
      return entry[1].id === id;
    })
    .map(entry => {
      return entry[0];
    });
  }

  getProperty (options) {
    let {socketId, property} = options;
    return this._sockets.get(String(socketId))? this._sockets.get(String(socketId))[property] : undefined;
  }

  listIds () {
    return Array.from(this._sockets.keys()).join(", ");
  }

  addSocket (data) {
    let login = data.login;
    if (login !== "undefined" && login !== undefined) {
      let options = {};
    // if (data.login !== "undefined" && data.state !== "disconnected" && data.login !== undefined) {
      ({
        socketId: options.id,
        login: options.login,
        authorized: options.authorized,
        state: options.state
      } = data);
      // let isRegistered = this.getId(options.login);
      // if (isRegistered.length) {
      //   this.removeSocket(isRegistered[0]);
      // }
      if (this._sockets.set(String(login), options)) {
      // if (this._sockets.set(String(data.socketId), options)) {
        console.log(authorizationMessages.socketRegisterSuccess(data));
      } else {
        console.log(authorizationMessages.socketRegisterFailure(data));
      }
      console.log(`All sockets after addding a socket: ${this.listIds()}`);
      options = null;
    }
  }

  removeSocket (data) {
    let {login, socketId} = data;
    if (login === undefined && socketId) {
      login = this.getLogin(data.socketId);
    }

      if (this._sockets.delete(login)) {
        console.log(authorizationMessages.socketUnregisterSuccess(data));
      } else {
        console.log(authorizationMessages.socketUnregisterFailure(data));
      }
    console.log(`All sockets after removing a  socket: ${this.listIds()}`);
  }

  setState (data) {
    // redis.setState({
    //   login: data.login,
    //   state: data.state,
    //   time: 1000 * 60 * 2
    // })
    // .catch(err => {
    //   // TODO
    //   console.log(err);
    // });
  }

  getState (data) {
    // return new Promise((res, rej) => {
    //   redis.getState({
    //     login: data.login
    //   })
    //   .then(result => {
    //     res(result);
    //   })
    //   .catch(err => {
    //     rej(err);
    //     // TODO
    //   })
    // });
  }

  // updateSocket (data) {
  //   Object.keys(data).forEach(socket => {
  //     let newData = data[socket];
  //     let storedData = this.getSocket(socket);
  //     try {
  //       Object.keys(newData).forEach(key => {
  //         if (this._properties.includes(key)) {
  //           storedData[key] = data[socket][key];
  //         }
  //       });
  //       newData = null;
  //       storedData = null;
  //     }
  //     catch(err) {
  //       if (err instanceof TypeError) {
  //         // TODO
  //         this.addSocket(data);
  //       }
  //     }
  //   })
  // }

  toJSON () {
    return {
      exists: true
    };
  }
}


// let socketsManager = io => {
//   return ;
// };

module.exports = SocketsManager;
//   "constructor": io => socketsManager(io),
//   "manager": manager
// };

// let manager = {};
//
// let createManager = io => {
//   manager = new SocketsManager(io);
//   console.log("manager created: " + JSON.stringify(manager));
//   return true;
// };

// module.exports = {
//   "createManager": () => createManager(),
//   "manager": () => manager
// };
