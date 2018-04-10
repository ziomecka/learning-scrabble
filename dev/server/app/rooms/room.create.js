/* jshint esversion: 6 */
const Room = require("../room/room.class").Room;
const messages = require("./rooms.messages");

const createRoom = () => {
  const create = data => {
    console.log(`New room will be created.`);
    let promise = new Promise((res, rej) => {
      try {
        ({
          id: data.roomId,
          name: data.name,
          places: data.places
        } = new Room(data));
        res(data);
      } catch (e) {
        rej(messages.roomCreateFailure(e.message));
      }
    });
    return promise;
  };

  return {
    create: create
  };
};

module.exports = {
  createRoom: createRoom
};
