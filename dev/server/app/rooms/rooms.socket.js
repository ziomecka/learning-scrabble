/* jshint esversion: 6 */

/** Listen to rooms events */
const rooms = require("./rooms");
const roomsEvents = require("./rooms.events");
const roomsMessages = require("./rooms.messages");
const roomStates = require("../room/room.states")

const listens = [
  roomsEvents.reqCreateNewroom
]

const socket = data => {
  let {socket, io} = data;
  let roomID;
  let room;

  const listenCreateNewroom = () => {
    /* Listen to 'createNewroom' requests */
    socket.on(roomsEvents.reqCreateNewroom, data => {
      // console.log(`roomStates.get("waitingForPlayers"): ${roomStates.get("waitingForPlayers")}`);
      rooms.createOne({
        collection: data.collection,
        name: data.name,
        numberPlaces: data.numberPlaces,
        time: data.time = 3,
        owner: data.login,
        state: roomStates.get("waitingForPlayers")
      })
      .then(result => {
        // console.log(`received id ${result}`);
        console.log(roomsMessages.roomCreateSuccess(result));
        socket.emit(roomsEvents.resCreateNewroomSuccess, {
          roomId: result,
          collection: data.collection
        });

        // roomID = result;

        /** Inform the socket about creating the room and
            inform all sockets including the sender about the new room.
            */
        io.sockets.in(`/rooms`)
        .emit(roomsEvents.resNewroomAdded, {
          roomId: result,
          collection: data.collection
        });
      })
      .catch(err => {
        /** No need to catch no unique name rejection because
            if the name is not unique then an identifier is added.
            */
        console.log(roomsMessages.roomCreateFailure(err));
        socket.emit(roomsEvents.resCreateNewroomFailure);

        // roomID = undefined;
      });


      /** If game should be created. */
      // if (data.createGame) {
      //   createGameFactory.create({id: response.roomId})
      //   socket.emit(scrabbleEvents.resCreateScrabbleSuccess, response.roomId);
      //   console.log(roomsMessages.gameCreateSuccess(response.roomId));
      // }

      /** If player should join the room. */
      // if (data.joinRoom) {
      //   joinRoom({
      //     id: response.roomId,
      //     login: data.login
      //   });
      // }

      // response = null;
      /** TODO after checking that all places are taken */
      /** Ask players for starting the game */
    });
    //   let response = {};
    //   /** CAUTION: response.id, not response.roomId. */
    //   ({roomId: response.id, name: response.name} = createRoomFactory.create({
    //     name: data.name,
    //     numberPlaces: data.numberPlaces,
    //     login: data.login,
    //     joinRoom: data.joinRoom
    //   }));
    //   console.log(roomsMessages.roomCreateSuccess(response.roomId));
    //
    //   /** Inform the socket about creating the room and
    //   inform all sockets including the sender about the new room.
    //   */
    //   socket.emit(roomsEvents.resCreateNewroomSuccess, response);
    //
    //   io.sockets.in(`/rooms`)
    //   .emit(roomsEvents.resNewroomAdded, response);
    //
    //   /** If game should be created. */
    //   if (data.createGame) {
    //     createGameFactory.create({id: response.roomId})
    //     socket.emit(scrabbleEvents.resCreateScrabbleSuccess, response.roomId);
    //     console.log(roomsMessages.gameCreateSuccess(response.roomId));
    //   }
    //
    //   /** If player should join the room. */
    //   // if (data.joinRoom) {
    //   //   joinRoom({
    //   //     id: response.roomId,
    //   //     login: data.login
    //   //   });
    //   // }
    //
    //   response = null;
    //   /** TODO after checking that all places are taken */
    //   /** Ask players for starting the game */
    // });
  }

  const stopListenCreateNewroom = () => {
    socket.removeAllListeners(roomsEvents.reqCreateNewroom);
  };

  // const joinRoom = data => {
  //   socket.join(`/room${data.id}`, () => {
  //     /** Inform the socket about joining the room */
  //     socket.emit(roomsEvents.resRoomJoinedSuccess, {roomId: data.id});
  //
  //     /** Inform all sockets in room except the socket.*/
  //     socket.to(`/room${data.id}`).emit(roomsEvents.resOtherUserJoinedRoom, data);
  //
  //     console.log(roomsMessages.joinRoomSuccess({login: data.login, roomId: data.id}));
  //
  //     /** Listen if room has been joined */
  //     listenRoomJoined();
  //   });
  // }

  /** Create room socket and destroy listeners */
  const listenRoomJoined = () => {
    let callback = () => {
    }

    /* Listen to 'roomJoined' response */
    socket.on(roomsEvents.reqRoomJoined, () => {
      callback();
      callback = null;
    });
  };

  const stopListenRoomJoined = () => {
    socket.removeAllListeners(roomsEvents.resRoomJoined);
  };

  const listenJoinRoom = () => {
    socket.on(roomsEvents.reqJoinRoom, data => {
      // joinRoom(data);
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
      let {
        roomId,
        login,
        collection
      } = data;

      console.log(roomsMessages.roomDetailsRequested({
        "roomId": roomId,
        "collection": collection,
        "socket": socket.id,
        "login": login
      }));

      /** Get room and game details */
      rooms.getOne({
        "collection": collection,
        "roomId": roomId
      })
      .then(result => {
        // console.log("room details send: " + JSON.stringify(result));
        socket.emit(roomsEvents.resJoinedRoomDetailsSuccess, JSON.stringify(result));
        console.log(roomsMessages.joinedRoomDetailsSuccess({
          "roomId": roomId,
          "socket": socket.id,
          "login": login,
          "state": result.state
        }));

        // roomID = result;
        room = result;
      })
      .catch(err => {
        // TODO
        socket.emit(roomsEvents.resJoinedRoomDetailsFailure);
        console.log(roomsMessages.joinedRoomDetailsFailure({
          "roomId": roomId,
          "socket": socket.id,
          "login": login,
          "err": err
        }));

          // roomID = undefined;
          room = undefined;
        });
      /** Stop listen rooms events because socket got room's details */
      // stopListen();
    });
  };

  let stopListenSendRoomDetails = () => {
    socket.removeAllListeners(roomsEvents.reqJoinedRoomDetails);
  };

  const listen = () => {
    listenCreateNewroom();
    listenJoinRoom();
    listenSendRoomDetails();
  };

  const stopListen = () => {
    listens.forEach(ev => {
      socket.removeAllListeners(ev);
    });

    console.log("I return room: " +JSON.stringify(room));
    return room;
  };

  const destroy = () => {
    stopListen();
    socket = null;
    io = null;
  };

  return {
    name: "rooms",
    listen: listen,
    stopListen: stopListen,
    destroy: destroy
  };
};

module.exports = {
  socket: socket
};
