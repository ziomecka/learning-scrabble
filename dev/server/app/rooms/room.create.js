/* jshint esversion: 6 */
// TODO out???
// const Room = require("../room/room.class").Room;

const create = data => {
  ({
    id: data.roomId,
    name: data.name,
    places: data.places
  } = new Room(data));
  return data;
};

module.exports = {
  create: create
};
