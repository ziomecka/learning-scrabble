/* jshint esversion: 6 */

/** Listen to rooms events */
const allRooms = require("../room/room.class").allRooms;
const scrabbleEvents = require("../../scrabble/scrabble.events");
const scrabbleSocket = require("../../scrabble/scrabble.socket").scrabbleSocket;
const createRoomFactory = require("./room.create");
const createGameFactory = require("./game.create");

const allScrabbles = require("../../scrabble/scrabble.game").allScrabbles;

const roomsEvents = require("./rooms.events");
const roomsMessages = require("./rooms.messages");

const roomsSocket = function(data) {
  let {socket, io} = data;
  ///////////////
  // ALL ROOMS //
  ///////////////
  const listenAllRooms = () => {
    socket.on(roomsEvents.reqAllRooms, () => {
      // TODO: change, not just list but also names
      socket.emit(roomsEvents.resAllRooms, allRooms.listIds());
    });
  };

  const stopListenAllRooms = () => {
    socket.removeAllListeners(roomsEvents.reqAllRooms);
  };

  //////////////
  // NEW ROOM //
  //////////////
  const listenCreateNewroom = () => {
    /* Listen to 'createNewroom' requests */
    socket.on(roomsEvents.reqCreateNewroom, data => {
      createRoomFactory.createRoom().create({
        name: data.name,
        numberPlaces: data.numberPlaces,
        login: data.login,
        joinRoom: data.joinRoom
      })
      .then(data => {
        console.log(`New room: ${data.roomId} created.`);
        let response = {};
        ({roomId: response.roomId, name: response.name} = data);
        /** Inform the socket about creating the room and
        inform all sockets includins the sender about the new room. */
        socket.emit(roomsEvents.resCreateNewroom, response);
        socket.emit(roomsEvents.resNewroomAdded, response);
        socket.broadcast.emit(roomsEvents.resNewroomAdded, response);
        response = null;

        /** If game should be created */
        if (data.createGame) {
          createGameFactory.createGame().create({id: data.roomId})
          .then(msg => {
            socket.emit(scrabbleEvents.resCreateScrabbleSuccess, data.gameId);
            initializeScrabbleSocket();
            console.log(msg);
            console.log("Done");
          })
          .catch()
          .finally(() => {
          });
        }

        /** If player should join the room */
        if (data.joinRoom) {
          // TODO garbage collection ?
          socket.join(`/room${data.roomId}`, () => {
            /** Inform the socket about joining the room.
                Do not inform other sockets in room as this is the only socket. */
            socket.emit(roomsEvents.resRoomJoinedSuccess, {roomId: data.roomId});

            /** Listen to room events */
            let roomSocket = require("../room/room.socket").roomSocket({socket:socket, io: io});
            console.log(`stringify roomSocket ${JSON.stringify(roomSocket)}`);
            roomSocket.listenWaitForGame();
            // roomSocket.listenGameDetails();
            roomSocket = null;
            /** Stop listen to rooms events */ // TODO do I want to do this?
            // stopListen(); //TODO stopListen is needed but not here because room data is not send
            console.log(roomsMessages.joinRoomSuccess({login: data.login, roomId: data.roomId}));
          });
        }
        /** TODO after checking that all places are taken */
        /** Ask players for starting the game */
        // setTimeout(() => {
        //   console.log(roomsMessages.askPlayerStart({roomId: data.roomId}));
        //   io.in(`/room${data.roomId}`).emit(roomsEvents.resAskPlayerStart);
        // }, 5000);
      })
      .catch()
      .finally(() => {
        /** Collect garbage. */
      });
    });
  };

  const stopListenCreateNewroom = () => {
    socket.removeAllListeners(roomsEvents.reqCreateNewroom);
  };

  ///////////////
  // JOIN ROOM //
  ///////////////
  const listenJoinRoom = () => {
    socket.on(roomsEvents.reqJoinRoom, data => {
      socket.join(`/room${data.id}`, () => {
        /** Inform the socket about joining the room */
        socket.emit(roomsEvents.resRoomJoinedSuccess, {roomId: data.id});
        /** Inform all sockets in room except the socket.*/
        socket.to(`/room${data.id}`).emit(roomsEvents.resOtherUserJoinedRoom, data);
        console.log(roomsMessages.joinRoomSuccess({login: data.login, roomId: data.id}));
        /* Send room's data to the socket */
        socket.emit(roomsEvents.resJoinedRoomDetails, JSON.stringify(data));

        /** Listen to room events */
        let roomSocket = require("../room/room.socket").roomSocket({socket:socket, io: io});
        roomSocket.listenWaitForGame();
        // roomSocket.listenGameDetails();
        roomSocket = null;
        /** Stop listen to rooms events */ // TODO
        // stopListen(); // TODO stop listen is needed but not here
      });
    });
  };

  const stopListenJoinRoom = () => {
    socket.removeAllListeners(roomsEvents.reqJoinRoom);
  };

  //////////////////
  // ROOM DETAILS //
  //////////////////
  /** Send room's details */
  let listenSendRoomDetails = () => {
    socket.on(roomsEvents.reqJoinedRoomDetails, data => {
      let {roomId, login} = data;
      let result = {};
      console.log(roomsMessages.roomDetailsRequested({
        roomId: roomId,
        socket: socket.id,
        login: login
      }));
      /** Get room and game details */
      result.room = allRooms.getOne(roomId);
      result.game =  allScrabbles.getOne(roomId);

      socket.emit(roomsEvents.resJoinedRoomDetails, JSON.stringify(result));
      console.log(roomsMessages.roomDetailsSent({
        roomId: roomId,
        socket: socket.id,
        login: login
      }));
      result = null;
    });
  };

  let stopListenSendRoomDetails = () => {
    socket.removeAllListeners(roomsEvents.reqJoinedRoomDetails);
  };

  const listen = () => {
    listenAllRooms();
    listenCreateNewroom();
    listenJoinRoom();
    listenSendRoomDetails();
  };

  const stopListen = () => {
    stopListenAllRooms();
    stopListenCreateNewroom();
    stopListenJoinRoom();
    stopListenSendRoomDetails();
  };

  const destroy = () => {
    socket = null;
    io = null;
  };

  return {
    listen: listen,
    stopListen: stopListen,
    destroy: destroy
  };
};

module.exports = {
  roomsSocket: roomsSocket
};
