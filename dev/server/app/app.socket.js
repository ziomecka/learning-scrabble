/* jshint esversion: 6 */

/** Authentication.
    Create and destroy room.
    Create and destroy player.
     */

const allRooms = require("./room/room.class").allRooms;
// const statusGame = require("../maps/server.status.game");
const appEvents = require("./app.events");
const scrabbleEvents = require("../scrabble/scrabble.events");
const scrabbleSocket = require("../scrabble/scrabble.socket").scrabbleSocket;
const allScrabbles = require("../scrabble/scrabble.game").allScrabbles;
const socketsManagerFactory = require("./authorization/authorization.sockets.manager");
const createRoomFactory = require("./rooms/room.create");
const createGameFactory = require("./rooms/game.create");
const redisFactory = require("./authorization/authorization.redis");
const sendAuthorizationCookies = require("./cookies/cookies").sendAuthorizationCookies;
const messages = require("./app.messages");
const roomSocket = require("./room.socket");

const appSocket = data => {
  let {socket, io} = data;

  const listenAuthorizeUser = () => {
    /** Authorize user. */
    socket.on(appEvents.reqAuthorize, data => {
      let {login, password} = data;
      console.log(`Authorizing user: ${data.login}`);
      let redis = redisFactory();
      redis.authorizeUser(data)
      .then(msg => {
        socketsManagerFactory().update({"socket": socket.id, "login": login});
        socket.emit(appEvents.resAuthorizeSuccess, {"login": login});
        let redis = redisFactory();
        redis.refreshCookies({"login": data.login, "socket": socket})
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
              value: longNumber
            }]
          });
        })
        .catch(reason => console.log(reason))
        .finally(() => {
          /** Collect garbage */
          redis = null;
        });
      })
      .catch(reason => {
        // TODO
        socket.emit(appEvents.resAuthorizeFailure);
        console.log(reason);
      })
      .finally(() => {
        /** Collect garbage */
        redis = null;
      });
    });
  };

  const stopListenAuthorizeUser = () => {
    socket.off(appEvents.reqAuthorize);
  };

  const listenNewuser = () => {
    /** Add new user. */
    socket.on(appEvents.reqNewuser, data => {
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
        socket.emit(appEvents.resNewuserSuccess, {"login": data.login});
        console.log(messages.userCreateSuccess(login));
      })
      .catch(reason => {
        socket.emit(appEvents.resDuplicatedLogin);
        console.log(reason);
      })
      .finally(() => {
        /** Collect garbage. */
        redis = null;
      });
    });
  };

  const stopListenNewuser = () => {
    socket.off(appEvents.reqNewuser);
  };

  /** Send all rooms' data */
  const listenAllRooms = () => {
    socket.on(appEvents.reqAllRooms, () => {
      // TODO: change, not just list but also names
      socket.emit(appEvents.resAllRooms, allRooms.listIds());
    });
  };

  const stopListenAllRooms = () => {
    socket.off(appEvents.reqAllRooms);
  };

  const listenCreateNewroom = () => {
    /* Listen to 'createNewroom' requests */
    socket.on(appEvents.reqCreateNewroom, data => {
      // let handlers = handlersFactory();
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
        socket.emit(appEvents.resCreateNewroom, response);
        socket.emit(appEvents.resNewroomAdded, response);
        socket.broadcast.emit(appEvents.resNewroomAdded, response);
        response = null;

        /** If game should be created */
        if (data.createGame) {
          // let handlers = handlersFactory();
          createGameFactory.createGame().create({id: data.roomId})
          .then(msg => {
            socket.emit(scrabbleEvents.resCreateScrabbleSuccess, data.gameId);
            initializeScrabbleSocket();
            console.log(msg);
            console.log("Done");
          })
          .catch()
          .finally(() => {
            // handlers = null;
          });
        }

        /** If player should join the room */
        if (data.joinRoom) {
          // TODO garbage collection of handlers and promise?
          socket.join(`/room${data.roomId}`, () => {
            /** Inform the socket about joining the room and
            inform all sockets in room except the socket. */
            socket.emit(appEvents.resRoomJoinedSuccess, {roomId: data.roomId});
            // TODO not needed?
            // socket.to(`/room${data.roomId}`).emit(appEvents.resOtherPlayerJoinedRoom, data);
            console.log(messages.joinRoomSuccess({login: data.login, roomId: data.roomId}));
          });
        }
        /** TODO after checking that all places are taken */
        /** Ask players for starting the game */
        setTimeout(() => {
          console.log(messages.askPlayerStart({roomId: data.roomId}));
          io.in(`/room${data.roomId}`).emit(appEvents.resAskPlayerStart);
        }, 5000);
      })
      .catch()
      .finally(() => {
        /** Collect garbage. */
        // handlers = null;
      });
    });
  };

  const stopListenCreateNewroom = () => {
    socket.off(appEvents.reqCreateNewroom);
  };

  /* Join the room */
  const listenJoinRoom = () => {
    socket.on(appEvents.reqJoinRoom, data => {
      socket.join(`/room${data.id}`, () => {
        /** Inform the socket about joining the room */
        socket.emit(appEvents.resRoomJoinedSuccess, {roomId: data.id});
        /** Inform all sockets in room except the socket.*/
        socket.to(`/room${data.id}`).emit(appEvents.resOtherUserJoinedRoom, data);
        console.log(messages.joinRoomSuccess({login: data.login, roomId: data.id}));
        /* Send room's data to the socket */
        socket.emit(appEvents.resJoinedRoomDetails, JSON.stringify(data));
      });

      roomSocket.waitForGame();
    });
  };

  const stopListenJoinRoom = () => {
    socket.off(appEvents.reqJoinRoom);
  };


  /* Leave room */
  // TODO NOT HERE!!!!
  const listenLeaveRoom = () => {
    socket.on(appEvents.reqLeaveRoom, data => {
      roomSocket.destroyWaitForGame();
      roomSocket.destroy();
    });
  };

  const stopListenLeaveRoom = () => {
    socket.off(appEvents.reqLeaveRoom);
  };

  return {

  }
};

module.exports = {
  appSocket: appSocket
};
