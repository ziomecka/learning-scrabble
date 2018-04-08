/* jshint esversion: 6 */
const Room = require("./app.room").Room;
const Scrabble = require("../scrabble/scrabble.game").Scrabble;

const scrabbleEvents = require("../scrabble/scrabble.events");
const appEvents = require("./app.events");
const messages = require("./app.messages");

const socketHandlers = () => {
  const createRoom = data => {
    console.log(`New room will be created.`);
    let promise = new Promise((res, rej) => {
      try {
        ({
          id: data.roomId,
          name: data.name,
          places: data.places,
          numberPlaces: data.numberPlaces
        } = new Room(data));
        res(data);
      } catch (e) {
        rej(messages.roomCreateFailure(e.message));
      }
    });
    return promise;
  };

  const createScrabble = data => {
    console.log(`New game will be created.`);
    let promise = new Promise((res, rej) => {
      try {
        new Scrabble({"id": data.roomId});
        res(messages.gameCreateSuccess(data.roomId));
      } catch (e) {
        rej(messages.gameCreateFailure(e.message));
      }
    });
    return promise;
  };

  const joinRoom = data => {
    let {socket} = data;
    console.log(`Player will join the room.`);
    let response = {};
    ({roomId: response.roomId, login: response.login} = data);
    socket.join(`/room${roomId}`, () => data.success(response));
    response = null;
  };

  const joinRoomSuccess = data => {
    let {socket} = data;
    /* Inform socket about joining the room. */
    socket.emit(appEvents.resRoomJoined, {roomId: data.roomId});
    /* Inform all sockets */
    socket.to(`/room${roomId}`).emit(appEvents.resJoinedRoomDetails, data);
    console.log(`User ${login} joined room: ${roomId}.`);
  };

  return {
    createRoom: createRoom,
    createScrabble: createScrabble,
    joinRoom: joinRoom,
    joinRoomSuccess: joinRoomSuccess,
  };
};

module.exports = socketHandlers;
