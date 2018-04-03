/* jshint esversion: 6 */

/** Authentication. Create and destroy room. Create and destroy player.
    Persist data to a database. */

const Room = require("./app.room").Room;
const allRooms = require("./app.room").allRooms;
const statusGame = require("../maps/server.status.game");
const serverEvents = require("./app.events");

const redis = require("./app.user").redis;
const mongoGame = require("../mongo/scrabble/game/game.mongo.insert");

const serverApp = socket => {
  /** Authorize user. */
  socket.on(serverEvents.reqAuthorize, data => {
    data.socket = socket;
    redis.authorizeUser(data);
    console.log(`Authorizing user: ${data.login}`);
  });

  /** Add new user. */
  socket.on(serverEvents.reqNewuser, data => {
    data.socket = socket;
    redis.addUsernx(data);
    console.log(`New login set: ${data.login}`);
  });

  /** Send all rooms' data */
  socket.on(serverEvents.reqAllRooms, () => {
    socket.emit(serverEvents.resAllRooms, allRooms.data());
  });

  /** Send room's details */
  socket.on(serverEvents.reqJoinedRoomDetails, data => {
    socket.emit(serverEvents.resJoinedRoomDetails, JSON.stringify(allRooms.getRoom(data.roomId)));
  });

  /* Create new room. */
  socket.on(serverEvents.reqCreateNewRoom, data => {
    ({
      id: data.roomId,
      name: data.name,
      places: data.places,
      numberPlaces: data.numberPlaces
    } = new Room(data));

    console.log(`new room with id ${data.roomId} created`);

    /* inform about new room*/
    socket.emit(serverEvents.resCreateNewRoom, data);
    socket.emit(serverEvents.resNewRoomAdded, data);
    socket.broadcast.emit(serverEvents.resNewRoomAdded, data);

    /* join room */
    joinRoom(data);

    /* Sit on the first place. */
    data.placeId = 0;
    allRooms.getRoom(data.roomId).setPlaceOwner(data);

    /* Send room's data to the socket. */
    socket.emit(serverEvents.resJoinedRoomDetails, JSON.stringify(data));

    createScrabble();
  });

  /* Join the room */
  socket.on(serverEvents.reqJoinRoom, data => {
    console.log(`User joining the room: ${data.id}`);
    joinRoom({
      login: data.login,
      roomId: data.id
    });
    /* Send room's data to the socket */
    socket.emit(serverEvents.resJoinedRoomDetails, JSON.stringify(data));
  });

  /* Take player place */
  socket.on(serverEvents.reqTakePlace, data => {
    allRooms.getRoom(data.roomID).setPlaceOwner(data);
    socket.emit(serverEvents.resTakePlaceSuccess,
      {ownerID: data.playerID, ownerName: data.playerName, placeId: data.placeId}
    );
    if (allRooms.getRoom(data.roomID).allPlacesTaken) {
      socket.emit(serverEvents.resAskPlayerStart);
    }
  });

  /* Leave player place */
  socket.on(serverEvents.reqGetUp, data => {
    allRooms.getRoom(data.roomID).setPlaceOwner({
      placeId: data.placeId,
      playerId: undefined,
      playerName: undefined
    });
    socket.emit(serverEvents.resGetUp, {placeId: data.placeId});
    // TODO - do not ask for starting and mark taht user did not agree
    if (allRooms.getRoom(data.roomID).allPlacesTaken) {
      socket.emit(serverEvents.resAskPlayerStart);
    }
  });

  /* Set new number of players */
  socket.on(serverEvents.reqNumberPlacesChanged, data => {
    console.log(`Number of places changed: ${data.number}`);

    let places = allRooms.getRoom(data.id).setNumberPlaces(data.number);
    console.log(`places: ${JSON.stringify(places)}`);
    if (places) {
      if (places.action === "places added") {
        io.sockets.in(`/room${data.id}`).emit(serverEvents.resPlacesAdded, {places: places.places});
      } else if (places.action === "places removed") {
        io.sockets.in(`/room${data.id}`).emit(serverEvents.resPlacesRemoved, {places: []});
      }
      places = null;
    }
  });

  /* Handler for joining room */
  const joinRoom = data => {
    const {roomId, login} = data;
    return socket.join(`/room${roomId}`, () => {
      /* Inform socket about joining the room.
      Socket will go to the view. */
      socket.emit(serverEvents.resRoomJoined, {roomId: roomId});
      /* Inform all sockets */
      socket.to(`/room${roomId}`)
      .emit(serverEvents.resJoinedRoomDetails, data);
      // io.sockets.in(`/room${roomId}`)
      //   .broadcast.emit(serverEvents.resJoinedRoomDetails, data);
      console.log(`User ${login} joined room: ${roomId}.`);
    });
  };

  const createScrabble = () => {
    console.log("Creating scrabble");
    let mongoGamePromise = new Promise((res, rej) => {
      mongoGame.oninsert = data => res(data);
      mongoGame.onerror = err => rej(`Insert game promise rejected: ${err}`);
      mongoGame.insert();
    });
    mongoGamePromise.then(data => {
      socket.emit(serverEvents.resCreateScrabbleSuccess, data);
      console.log(`Game with id: ${data.id} has been created.`);
    }).catch(reason => console.log(reason));
  };
};

module.exports.serverApp = serverApp;
