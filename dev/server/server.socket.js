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

const ioredis = require("./server.redis").ioredis;
const redis = require("./server.redis").redis;

io.on("connection", socket => {
  console.log(`User connected: ${socket.id}`);
  socket.emit("connected", {id: socket.id});

  socket.on("disconnect", () => console.log("user disconnected"));

  socket.on("auth: create user", data => {
    let {login, password} = data;
    console.log(`Setting new login: ${login}`);
    /** Set only if does not exist. */
    redis.hsetnx(login, "login", login, (err, result) => {
      // TODO err
      if (result) {
        redis.hset(login, "password", password, (err, result) => {
          if (result) {
            console.log(`User ${login} created`);
            socket.emit("auth: user created");
          } else {
            console.log(`User ${login} not created`);
            // TODO
          }
        });
      } else {
        console.log(`Login ${login} already exists`);
        socket.emit("auth: login already exists");
      }
    });
  });

  socket.on("auth: authorize user", data => {
    let {login, password} = data;
    console.log(`Authorizing user: ${login}`);
    /** Get key */
    redis.exists(login, (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result) {
          redis.hget(login, "password", (err, result) => {
            if (err) {
              throw err;
            } else {
              if (result === password) {
                console.log(`User ${login} authorized`);
                socket.emit("auth: authorized");
              } else if (result !== password) {
                console.log(`Incorrect password ${login}`);
                socket.emit("auth: incorrect password");
              } else {
                // TODO???
              }
            }
          });
        } else {
          console.log(`Login ${login} does not exist`);
          socket.emit("auth: login does not exist");
        }
      }
    });
  });

  socket.on("rooms: get all rooms' names", () => {

    socket.emit("rooms: all rooms' names sent", {rooms: allRooms.getProperty("name")});

    let joinRoom = (data) => {
      const {roomID, socketID, login} = data;

      return socket.join(`/room${roomID}`, () => {
        redis.hset("room", roomID, (err, result) => {
          if (err) {

          } else {

          }

          socket.emit("rooms: room joined", {id: roomID});
          io.sockets.in(`/room${roomID}`).emit("rooms: details of joined room sent", JSON.stringify(allRooms.getRoomDetails(roomID)));
          console.log(`User ${socketID} joined room: ${roomID}.`);
        });
      });
    };

    socket.on("rooms: create new room", data => {
      data.owner.id = socket.id;
      console.log("dataownerid" + data.owner.id);
      console.log(`data.owner.id: ${data.owner.id}`);
      ({id: data.id, name: data.name} = new Room(data));
      console.log("dataid" + data.id);
      joinRoom({socketID: socket.id, roomID: data.id});
      socket.emit("rooms: join created room", data);
      socket.broadcast.emit("rooms: new room created", data);
      console.log(`new room with id ${data.id} created`);
    });
  });


  socket.on("rooms: join room", data => {
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
