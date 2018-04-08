/* jshint esversion: 6 */

/** Authentication.
    Create and destroy room.
    Create and destroy player.
     */

const allRooms = require("./app.room").allRooms;
// const statusGame = require("../maps/server.status.game");
const appEvents = require("./app.events");
const scrabbleEvents = require("../scrabble/scrabble.events");
const scrabbleSocket = require("../scrabble/scrabble.socket").scrabbleSocket;
const allScrabbles = require("../scrabble/scrabble.game").allScrabbles;
const socketsManagerFactory = require("./app.sockets.manager");
const handlersFactory = require("./app.socket.handlers");
const redisFactory = require("./app.redis");
const sendAuthorizationCookies = require("../cookies/cookies").sendAuthorizationCookies;
const messages = require("./app.messages");

const serverApp = socket => {
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
      socket.emit(appEvents.resNewuser, {"login": data.login});
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

  /** Send all rooms' data */
  socket.on(appEvents.reqAllRooms, () => {
    // TODO: change, not just list but also names
    socket.emit(appEvents.resAllRooms, allRooms.listIds());
  });

  /** Send room's details */
  socket.on(appEvents.reqJoinedRoomDetails, data => {
    let {roomId} = data;
    let result = {};
    console.log(`I look for id: ${roomId}`);
    result.room = allRooms.getOne(roomId);
    result.game =  allScrabbles.getOne(roomId);
    console.log(`the result is: ${JSON.stringify(result)}`);
    socket.emit(appEvents.resJoinedRoomDetails, JSON.stringify(result));
  });

  socket.on(scrabbleEvents.reqDrawTiles, data => {
    let {gameId, number} = data;
    console.log(`Draw tiles for game: ${gameId}`);
    drawTiles({
      callbacks: {
        success: data => {
          console.log("Tiles drawn.");
          console.log(`Tiles ${data} send to game: ${gameId}`);
          socket.emit(scrabbleEvents.resDrawTilesSuccess, data);
        }
      },
      data: {
        gameId: gameId,
        number: number
      }
    });
  });

  const initializeScrabbleSocket = () => scrabbleSocket(socket);

  /* Listen to 'createNewroom' requests */
  socket.on(appEvents.reqCreateNewRoom, data => {
    let handlers = handlersFactory();
    handlers.createRoom(data)
    .then(data => {
      console.log(`New room: ${data.roomId} created.`);
      let response = {};
      ({roomId: response.roomId, name: response.name} = data);
      console.log("the socket is" + socket);
      socket.emit(appEvents.resCreateNewRoom, response);
      socket.emit(appEvents.resNewRoomAdded, response);
      socket.broadcast.emit(appEvents.resNewRoomAdded, response);
      response = null;
      /** If game should be created */
      if (data.createGame) {
        let handlers = handlersFactory();
        handlers.createScrabble({id: data.roomId})
        .then(msg => {
          socket.emit(scrabbleEvents.resCreateScrabbleSuccess, data.gameId);
          initializeScrabbleSocket();
          console.log(msg);
          console.log("Done");
        })
        .catch()
        .finally(() => {
          handlers = null;
        });
      }

      /** If player should join the room */
      if (data.joinRoom) {
        // TODO garbage collection of handlers and promise?
        let handlers = handlersFactory();
        data.success = () => handlers.joinRoomSuccess();
        handlers.joinRoom(data);
      }
    })
    .catch()
    .finally(() => {
      /** Collect garbage. */
      handlers = null;
    });

    // /* join room */
    //
    // /* Sit on the first place. */
    // data.placeId = 0;
    // allRooms.getOne(data.roomId).setPlaceOwner(data);

    // data.room = data; // TODO: Improvve Unnecessary?
    /* Send room's data to the socket. */
    // socket.emit(appEvents.resJoinedRoomDetails, JSON.stringify(data));
  });



  /** If initiated by CLient.*/
  // socket.on(scrabbleEvents.reqCreateScrabble, data => {
  //   createScrabble(data).then(game => createScrabbleSuccess(game));
  // });

  /* Join the room */
  socket.on(appEvents.reqJoinRoom, data => {
    console.log(`User joining the room: ${data.id}`);
    joinRoom({"login": data.login, "roomId": data.id});
    /* Send room's data to the socket */
    socket.emit(appEvents.resJoinedRoomDetails, JSON.stringify(data));
  });

  /* Take player place */
  socket.on(appEvents.reqTakePlace, data => {
    allRooms.getOne(data.roomID).setPlaceOwner(data);
    socket.emit(appEvents.resTakePlaceSuccess,
      {ownerID: data.playerID, ownerName: data.playerName, placeId: data.placeId}
    );
    if (allRooms.getOne(data.roomID).allPlacesTaken) {
      socket.emit(appEvents.resAskPlayerStart);
    }
  });

  /* Leave player place */
  socket.on(appEvents.reqGetUp, data => {
    allRooms.getOne(data.roomID).setPlaceOwner({
      placeId: data.placeId,
      playerId: undefined,
      playerName: undefined
    });
    socket.emit(appEvents.resGetUp, {placeId: data.placeId});
    // TODO - do not ask for starting and mark taht user did not agree
    if (allRooms.getOne(data.roomID).allPlacesTaken) {
      socket.emit(appEvents.resAskPlayerStart);
    }
  });

  /* Set new number of players */
  socket.on(appEvents.reqNumberPlacesChanged, data => {
    console.log(`Number of places changed: ${data.number}`);

    let places = allRooms.getOne(data.id).setNumberPlaces(data.number);
    console.log(`places: ${JSON.stringify(places)}`);
    if (places) {
      if (places.action === "places added") {
        io.sockets.in(`/room${data.id}`).emit(appEvents.resPlacesAdded, {places: places.places});
      } else if (places.action === "places removed") {
        io.sockets.in(`/room${data.id}`).emit(appEvents.resPlacesRemoved, {places: []});
      }
      places = null;
    }
  });
};

module.exports.serverApp = serverApp;
