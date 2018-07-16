/* jshint esversion: 6 */
const allRooms = require("../rooms/rooms");
// const statusGame = require("../maps/server.status.game");

const roomEvents = require("./room.events");
const roomMessages = require("./room.messages");
const Room = require("./room.class");
const scrabbleSocket = require("../../scrabble/scrabble.socket").scrabbleSocket;

const socket = options => {
  // TODO data out
  let {socket, io, collection, data} = Object(options);
  let thisRoom;

  /* Take player place */
  let listenTakePlace = () => {
    socket.on(roomEvents.reqTakePlace, data => {
      let {roomId, placeId, login} = Object(data);
      let takePlace = room => {
        if (Room.isRoom(room)) {
          room.setPlaceOwner(data);

          /** Inform the socket about taking the place. */
          socket.emit(roomEvents.resTakePlaceSuccess,
            {"login": login, "placeId": placeId}
          );
          // console.log(`ALL SOCKETS IN ROOM  ${JSON.stringify(io.sockets.adapter.rooms[`/room${roomId}`]).sockets}`);

          /** Inform all sockets in room except the socket. */
          io.sockets.in(`/room${roomId}`)
          .emit(roomEvents.resOtherUserTookPlace, data);

          console.log(roomMessages.takePlaceSuccess({
            "roomId": roomId,
            "login": login,
            "placeId": placeId
          }));

          /** If all places taken ask users to click 'start' */
          if (room.allPlacesTaken) {
            changeRoomState({
              "roomId": roomId,
              "state": "waitingForStart"
            });
          }
        } else {
          // TODO throw Error
        }
      };

      if (Room.isRoom(thisRoom)) {
        takePlace(thisRoom);
        takePlace = null;
      } else {
        allRooms.getOne({
          "collection": collection = "scrabble",
          "roomId": roomId
        })
        .then(result => {
          thisRoom = result;
          takePlace(result);
        })
        .catch(() => {
        })
        .finally(() => {
          takePlace = null;
        });
      }
    });
  };

  let changeRoomState = options => {
    let {roomId, state} = Object(options);
    let changeState = room => {
      room.state = state;

      console.log(roomMessages.stateChanged({
        "roomId": roomId,
        "state": state
      }));

      socket.emit(roomEvents.resRoomStateChanged, {
        "state": state
      });

      io.sockets.in(`/room${roomId}`)
      .emit(roomEvents.resRoomStateChanged, {
        "state": state
      });
    };

    if (Room.isRoom(thisRoom)) {
      changeState(thisRoom);
      changeState = null;
    } else {
      allRooms.getOne({
        "collection": collection = "scrabble",
        "roomId": roomId
      })
      .then(result => {
        thisRoom = result;
        changeState(result);
      })
      .catch(() => {
      })
      .finally(() => {
        changeState = null;
      });
    }
  };

  let listenPlayerStart = () => {
    socket.on(roomEvents.reqStart, data => {
      let {roomId, login} = data;
      let listenStart = room => {
        if (Room.isRoom(room)) {
          if (room.setPlayerState({"login": login, "state": "waitingForStart"})) {
            console.log(roomMessages.startSuccess({
              "roomId": roomId,
              "login": login
            }));

            if (room.allPlayersState("waitingForStart") && room.state === "waitingForStart") {
              changeRoomState({
                "roomId": roomId,
                "state": "playing"
              });

              /** Start scrabble socket */
              /** Close room socket. */
              scrabbleSocket({
                "socket": socket,
                "io": io,
                "collection": collection,
                "room": room
              });
            } else {
              console.log("Not all players are ready");
            }
          } else {
            console.warn(roomMessages.startFailure({
              "roomId": roomId,
              "login": login
            }));
          }
        } else {
          // TODO
          console.log("Failure check all player ready");
        }
      }

      if (Room.isRoom(thisRoom)) {
        listenStart(thisRoom);
        listenStart = null;
      } else {
        allRooms.getOne({
          collection: collection = "scrabble",
          roomId: roomId
        })
        .then(result => {
          thisRoom = result;
          listenStart(result);
        })
        .catch(() => {
          console.log("failure set player ready");
        })
        .finally(() => {
          listenStart = null;
        });
      }

    });
  };

  let stopListenTakePlace = () => {
    socket.removeAllListeners(roomEvents.reqTakePlace);
  };

  let stopListenPlayerStart = () => {
    socket.removeAllListeners(roomEvents.reqStart);
  };

  let listenGetUp = () => {
    /* Leave player place */
    socket.on(roomEvents.reqGetUp, data => {
      let {roomId, placeId, login} = data;
      let listenGU = room => {
        if (Room.isRoom(room)) {
          room.setPlaceOwner({
            placeId: placeId,
            playerId: undefined,
            login: undefined
          });
          /** Inform the socket about getting up. */
          socket.emit(roomEvents.resGetUpSuccess, data);

          io.sockets.in(`/room${roomId}`)
          .emit(roomEvents.resOtherPlayerGotUp, data);

          /** Inform all sockets in room except the socket.*/ // TODO all sockets!!!
          socket.to(`/room${roomId}`)
          .emit(roomEvents.resOwnerChanged, room);

          console.log(roomMessages.getUpSuccess({
            "roomId": roomId,
            "login": login,
            "placeId": placeId
          }));
        } else {
          // TODO
          // throw Error()
        }
      };

      console.log(roomMessages.getUpRequest({
        "roomId": roomId,
        "login": login,
        "placeId": placeId
      }));

      if (Room.isRoom(thisRoom)) {
        listenGU(thisRoom);
        listenGU = null;
      } else {
        allRooms.getOne({
          "collection": collection = "scrabble",
          "roomId": roomId
        })
        .then(result => {
          thisRoom = result;
          listenGU(result);
        })
        .catch(err => {
          socket.emit(roomEvents.resGetUpFailure)
          console.log(
            `${roomMessages.getUpFailure({
              "roomId": roomId,
              "login": login,
              "placeId": placeId
            })}
            ${err}`
          );
        })
        .finally(() => {
          listenGU = null;
        });
      }
    });
  };

  let stopListenGetUp = () => {
    socket.removeAllListeners(roomEvents.reqGetUp);
  };

  let listenChangeNumberPlaces = () => {
    /* Set new number of places. */
    socket.on(roomEvents.reqChangeNumberPlaces, data => {
      let {number, roomId} = data;
      let changePlaces = room => {
        room.setNumberPlaces(number);

        /** Inform all sockets in room */
        io.sockets.in(`/room${roomId}`)
        .emit(roomEvents.resChangeNumberPlacesSuccess, {
          "places": room.numberPlaces
        });

        console.log(roomMessages.changeNumberPlacesSuccess({
          "roomId": roomId,
          "number": number
        }));
      };

      if (Room.isRoom(thisRoom)) {
        changePlaces(thisRoom);
        changePlaces = null;
      } else {
        allRooms.getOne({
          collection: collection = "scrabble",
          roomId: roomId
        })
        .then (result => {
          thisRoom = result;
          changePlaces(result);
        })
        .catch(err => {
          /** Inform all sockets in room */
          io.sockets.in(`/room${roomId}`)
          .emit(roomEvents.resChangeNumberPlacesFailure);
          console.log(
            `${roomMessages.changeNumberPlacesFailure({
              "roomId": roomId
            })}
            ${err}`
          );
        })
        .finally(() => {
          changePlaces = null;
        });
      }
    });
  };

  let stopListenChangeNumberPlaces = () => {
    socket.removeAllListeners(roomEvents.reqChangeNumberPlaces);
  };

  let listenChangeTime = () => {
    /* Set new time. */
    socket.on(roomEvents.reqChangeTime, data => {
      let {time, roomId} = data;
      let changeTime = room => {
        room.time = time;
        /** Inform all sockets in room */
        io.sockets.in(`/room${roomId}`)
        .emit(roomEvents.resChangeTimeSuccess, {"time": time});

        console.log(roomMessages.changeTimeSuccess({
          "roomId": roomId,
          "time": time
        }));
      };

      if (Room.isRoom(thisRoom)) {
        changeTime(thisRoom);
        changeTime = null;
      } else {
        allRooms.getOne({
          collection: collection = "scrabble",
          roomId: roomId
        })
        .then(result => {
          thisRoom = result;
          changeTime(result);
        })
        .catch(err => {
          /** Inform all sockets in room */
          io.sockets.in(`/room${roomId}`)
          .emit(roomEvents.resChangeTimeFailure);

          console.log(
            `${roomMessages.changeTimeFailure({
              "roomId": roomId
            })}
            ${err}`
          );
        })
        .finally(() => {
          changeTime = null;
        });
      }
    });
  };

  let stopListenChangeTime = () => {
    socket.removeAllListeners(roomEvents.reqChangeTime);
  };

  const listenLeaveRoom = () => {
    socket.on(roomEvents.reqLeaveRoom, data => {
      let {roomId, login} = data;

      console.log(roomMessages.roomLeft({
          roomId: roomId,
          login: login,
          socket: socket.id
      }));

      /** Inform the socket about leaving the room. */
      socket.emit(roomEvents.resLeaveRoomSuccess,
        {"login": login, "roomId": roomId}
      );

      /** Inform all sockets in room except the socket.*/
      socket.to(`/room${roomId}`).emit(roomEvents.resOtherUserLeftRoom, data);

      /** Stop listening to room events.
          Done when state is changed.
          */
    });
  };

  const stopListenLeaveRoom = () => {
    socket.removeAllListeners(roomEvents.reqLeaveRoom);
  };

  let destroy = () => {
    stopListen();
    socket = null;
    io = null;
    thisRoom = null;
  };

  let listen = () => {
    listenTakePlace();
    listenGetUp();
    listenChangeNumberPlaces();
    listenChangeTime();
    listenLeaveRoom();
    listenPlayerStart();
  };

  let stopListen = () => {
    stopListenTakePlace();
    stopListenGetUp();
    stopListenChangeNumberPlaces();
    stopListenChangeTime();
    stopListenLeaveRoom();
    stopListenPlayerStart();
  };

  return {
    name: "room",
    destroy: destroy,
    listen: listen,
    stopListen: stopListen
  };
};

module.exports = {
  socket: socket
};
