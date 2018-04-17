/* jshint esversion: 6 */

/** Listen to room events.*/

const allRooms = require("../room/room.class").allRooms;
// const statusGame = require("../maps/server.status.game");

const roomEvents = require("./room.events");
const roomMessages = require("./room.messages");

const scrabbleSocket = require("../../scrabble/scrabble.socket").scrabbleSocket;
const scrabbleEvents = require("../../scrabble/scrabble.events");
const allScrabbles = require("../../scrabble/scrabble.game").allScrabbles;

const roomSocket = function(data) {
  let {socket, io} = data;

  let initializeScrabbleSocket = () => scrabbleSocket(socket);

  /////////////
  // PLACES  //
  /////////////
  /** If initiated by CLient.*/
  /** TODO to be removed. */
  let listenCreateNewgame = () => {
    socket.on(scrabbleEvents.reqCreateNewgame, data => {
      createScrabble(data).then(game => createScrabbleSuccess(game));
    });
  };

  let stopListenCreateNewgame = () => {
    socket.removeAllListeners(scrabbleEvents.reqCreateNewgame);
  };

  /////////////
  // PLACES  //
  /////////////
  /* Take player place */
  let listenTakePlace = () => {
    socket.on(roomEvents.reqTakePlace, data => {
      allRooms.getOne(data.roomID).setPlaceOwner(data);
      /** Inform the socket about taking the place. */
      socket.emit(roomEvents.resTakePlaceSuccess,
        {"login": data.login, "placeId": data.placeId}
      );
      /** Inform all sockets in room except the socket.*/
      socket.to(`/room${data.id}`).emit(roomEvents.resOtherUserTookPlace, data);

      /** If all places taken ask users to click 'start' */
      if (allRooms.getOne(data.roomID).allPlacesTaken) {
        askPlayerStart();
      }
    });
  };

  let askPlayerStart = () => {
    socket.emit(roomEvents.resAskPlayerStart);
    socket.emit(roomEvents.resAskPlayerStart);
    listenPlayerStart();
  };

  let listenPlayerStart = () => {
    socket.emit(roomEvents.resAskPlayerStart);
    if (allRooms.getOne(data.roomID).allPlayersReady) { // TODO allPlayersReady
      // TODO start ScrabbleSocket
      // TODO sent initial tiles via game
    }
  };

  let stopListenTakePlace = () => {
    socket.removeAllListeners(roomEvents.reqTakePlace);
  };

  let listenGetUp = () => {
    /* Leave player place */
    socket.on(roomEvents.reqGetUp, data => {
      allRooms.getOne(data.roomID).setPlaceOwner({
        placeId: data.placeId,
        playerId: undefined,
        playerName: undefined
      });
      /** Inform the socket about getting up. */
      socket.emit(roomEvents.resGetUp, {placeId: data.placeId});
      /** Inform all sockets in room except the socket.*/
      socket.to(`/room${data.id}`).emit(roomEvents.resOtherUserGotUp, data);
      // TODO - do not ask for starting and mark taht user did not agree
      // chack status - waiting
      if (allRooms.getOne(data.roomID).allPlacesTaken) {
        socket.emit(roomEvents.resAskPlayerStart);
      }
    });
  };

  let stopListenGetUp = () => {
    socket.removeAllListeners(roomEvents.reqGetUp);
  };

  /////////////
  // OPTIONS //
  /////////////
  let listenChangeNumberPlaces = () => {
    /* Set new number of places. */
    socket.on(roomEvents.reqChangeNumberPlaces, data => {
      console.log(`Number of places will change to: ${data.number}`);
      let places = allRooms.getOne(data.roomId).setNumberPlaces(data.number);
      console.log(`Places ${places.action}: ${JSON.stringify(places.places)}`);
      if (places) {
        console.log(`emit event: ${roomEvents.resChangeNumberPlacesSuccess}`);
        console.log(`emit event to room: ${data.roomId}`);
        io.sockets.in(`/room${data.roomId}`).emit(roomEvents.resChangeNumberPlacesSuccess, {
          places: places.places,
          action: places.action
        });
        places = null;
      }
    });
  };

  let stopListenChangeNumberPlaces = () => {
    socket.removeAllListeners(roomEvents.reqChangeNumberPlaces);
  };

  let listenChangeTime = () => {
    /* Set new number of places. */
    socket.on(roomEvents.reqChangeTime, data => {
      // TODO
    });
  };

  let stopListenChangeTime = () => {
    socket.removeAllListeners(roomEvents.reqChangeTime);
  };
  ////////////////
  // LEAVE ROOM //
  ////////////////
  /* Leave room */
  const listenLeaveRoom = () => {
    socket.on(roomEvents.reqLeaveRoom, data => {
      /** Listen to rooms events */
      let roomsSocket = require("../rooms/rooms.socket").roomsSocket({socket:socket, io: io});
      console.log(`stringify roomsSocket ${JSON.stringify(roomsSocket)}`);
      roomsSocket.listen();
      roomsSocket = null;

      console.log(roomMessages.roomLeft({
          roomId: data.roomId,
          login: data.login,
          socket: socket.id
      }));
      /** Inform the socket about leaving the room. */
      socket.emit(roomEvents.resLeaveRoomSuccess,
        {"login": data.login, "roomId": data.roomId}
      );

      /** Inform all sockets in room except the socket.*/
      socket.to(`/room${data.roomId}`).emit(roomEvents.resOtherUserLeftRoom, data);

      /** Stop listening to room events */
      stopListenAll();
      destroy();
    });
  };

  const stopListenLeaveRoom = () => {
    socket.removeAllListeners(roomEvents.reqLeaveRoom);
  };

  let listenUsers = () => {
    // TODO
    return this;
  };

  let stopListenUsers = () => {
    // TODO
  };

  let listenGameDetails = () => {
    // listenSendRoomDetails();
    return this;
  };

  let stopListenGameDetails = () => {
    // stopListenSendRoomDetails();
  };

  let listenWaitForGame = () => {
    listenTakePlace();
    listenGetUp();
    listenChangeNumberPlaces();
    listenChangeTime();
    listenCreateNewgame();
    listenLeaveRoom();
    return this;
  };

  let stopListenWaitForGame = () => {
    stopListenTakePlace();
    stopListenGetUp();
    stopListenChangeNumberPlaces();
    stopListenChangeTime();
    stopListenCreateNewgame();
    stopListenLeaveRoom();
  };

  let stopListenAll = () => {
    stopListenWaitForGame();
    // stopListenGameDetails();
    stopListenUsers();
  };

  /////////////
  // DESTROY //
  /////////////
  let destroy = () => {
    socket = null;
    io = null;
  };

  return {
    listenWaitForGame: listenWaitForGame,
    // listenGameDetails: listenGameDetails,
    listenUsers: listenUsers,
    stopListenWaitForGame: stopListenWaitForGame,
    // stopListenGameDetails: stopListenGameDetails,
    stopListenUsers: stopListenUsers,
    stopListenAll: stopListenAll,
    destroy: destroy
  };
};

module.exports ={
  roomSocket: roomSocket
};
