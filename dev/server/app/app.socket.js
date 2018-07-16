/* jshint esversion: 6 */
/** Send list of all rooms. */
const rooms = require("./rooms/rooms");
const appEvents = require("./app.events");
const appMessages = require("./app.messages");
const listens = [appEvents.reqAllRooms];

const socket = data => {
  let {socket} = data;

  /** Send list of all rooms. */
  const listenAllRooms = () => {
    socket.on(appEvents.reqAllRooms, data => {
      console.log("Starts listening!!! collection: " + data.collection);
      rooms.getAll({
        "collection": data.collection
      })
      .then(result => {
        console.log(appMessages.allRoomsSuccess({
          "socketId": socket.id
        }));
        socket.emit(appEvents.resAllRoomsSuccess, {
          "collection": data.collection,
          "rooms": result
        });
      })
      .catch(err => {
        console.log(appMessages.allRoomsFailure({
          "socketId": socket.id,
          "err": err.message
        }));
        socket.emit(appEvents.resAllRoomsFailure);
      });
    });
  };

  const listen = () => {
    listenAllRooms();
  };

  const stopListen = () => {
    listens.forEach(ev => {
      socket.removeAllListeners(ev);
    })
  };

  const destroy = () => {
    stopListen();
    socket = null;
  };

  return {
    name: "app",
    listen: listen,
    stopListen: stopListen,
    destroy: destroy
  };
};

module.exports = {
  socket: socket
};
