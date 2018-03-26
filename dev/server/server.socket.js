/* jshint esversion: 6 */

/** New connections from clients.
    Authentication.
    Create and destroy room.
    Create and destroy player.
    Persist data to a database.
    */
const socketIO = require("socket.io");
const server = require("./server.start").server;
const io = socketIO(server);

const Room = require("./server.room").Room;
const allRooms = require("./server.room").allRooms;
const statusGame = require("./maps/server.status.game");
const serverEvents = require("./server.events");

const redis = require("./server.redis").redis;

io.on("connection", socket => {
  /** Inform about the connection */
  console.log(`User connected: ${socket.id}`);
  socket.emit(serverEvents.resConnected, {id: socket.id});
  socket.on("disconnect", () => console.log("user disconnected"));

  socket.on(serverEvents.reqNewuser, data => {
    data.socket = socket;
    console.log(`Setting new login: ${data.login}`);
    /** Add user if does not exist. */
    redis.addUsernx(data);
  });

  socket.on(serverEvents.reqAuthorize, data => {
    data.socket = socket;
    console.log(`Authorizing user: ${data.login}`);
    /** Authorize user */
    redis.authorizeUser(data);
  });

  socket.on(serverEvents.reqAllRooms, () => {
    socket.emit(serverEvents.resAllRooms, {rooms: allRooms.getProperty("name")});

    let joinRoom = (data) => {
      const {roomID, socketID, login} = data;
      return socket.join(`/room${roomID}`, () => {
        socket.emit("rooms: room joined", {id: roomID});
        io.sockets.in(`/room${roomID}`).emit("rooms: details of joined room sent", JSON.stringify(allRooms.getRoomDetails(roomID)));
        console.log(`User ${socketID} joined room: ${roomID}.`);
      });
    };

    socket.on(serverEvents.reqNewroom, data => {
      data.owner.id = socket.id;
      ({id: data.id, name: data.name} = new Room(data));
      joinRoom({socketID: socket.id, roomID: data.id});
      socket.emit(serverEvents.resJoinCreatedRoom, data);
      socket.broadcast.emit(serverEvents.resNewroom, data);
      console.log(`new room with id ${data.id} created`);
    });
  });

  socket.on(serverEvents.reqJoinRoom, data => {
    let id = data.id;
    console.log(`User joining the room: ${id}`);
    joinRoom({socketID: socket.id, roomID: data.id});
  });

  /**
   * data: playerID, playerName: me.joinName, roomID, placeID
   *
   * @type {[type]}
   */
  socket.on("room: take place", data => {
    allRooms.getRoomDetails(data.roomID).setPlaceOwner(data);
    socket.emit("room: player took place",
      {ownerID: data.playerID, ownerName: data.playerName, placeID: data.placeID}
    );
  });

  socket.on("room: number of placess changed", data => {
    console.log(`Number of places changed: ${data.number}`);

    let places = allRooms.getRoomDetails(data.id).setNumberPlaces(data.number);
    console.log(`places: ${JSON.stringify(places)}`);
    if (places) {
      if (places.action === "places added") {
        io.sockets.in(`/room${data.id}`).emit("room: new places", {places: places.places});
      } else if (places.action === "places removed") {
        io.sockets.in(`/room${data.id}`).emit("room: new places", {places: []});
      }
      places = null;
    }
  });
});
