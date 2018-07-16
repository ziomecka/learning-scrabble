/* jshint esversion: 6 */
const scrabbleEvents = require("./scrabble.events");
const socketHandlers = require("../app/handlers/socket.handlers");
const states = require("./states/scrabble.states.game");
const verifyWord = require("./dictionary/verify");
const messages = require("./scrabble.messages");

const scrabbleSocket = data => {
  let {io, room} = Object(data);
  let game = room.game;
  // let currentPlayer;

  let preparePlayers = () => {
    /** TODO earlier? once a player takes place? */
    room.game.players = room.places.map(place => {
      return place.player;
    });
  };

  let initialTiles = () => {
    if (game.drawInitialTiles()) {
      let informInitialTiles = id => {
        let emitOptions = {
          "io": io,
          "socketId": id,
          "emit": {
            "eventName": scrabbleEvents.resInitialTiles,
            "data": {
              "tiles": room.findPlayerBySocket(id).tiles
            }
          },
          "events": [
            {
              "eventName": scrabbleEvents.reqInitialTilesSuccess,
              "callback": () => {
                changeState({
                  "state": states.get("waitingGameStart")
                });
              }
            }
          ]
        };

        // console.log("informing socket about initial tiles." + JSON.stringify(player.tiles));
        socketHandlers.socketEmitHandler(emitOptions);
        // emitOptions = null;
      };
      // console.log("players to be informed about Initial tiles: " + JSON.stringify(players));
      doForEachPlayer({
        "callback": id => {
          listenChangeState(id);
          informInitialTiles(id);
        }
      });
      return true;
    }
    return false;
  };

  let allPlayersState = state => {
    return room.allPlayersState(state);
  };

  let waitingInitialTilesCB = () => {
    if (allPlayersState("waitingInitialTiles")) {
      initialTiles();
    } else {
      console.log(`Not all players waiting for tiles`);
    }
  };

  let waitingGameStartCB = () => {
    if (allPlayersState("waitingGameStart") && game.state !== "movePlaceWord") {
      startRound({
        "socketId": game.start().socketId
      });
    } else {
      console.log(`Not all players confirmed intial tiles and not all wait for start.`);
    }
  };

  let movePlaceWordCB = () => {
  };

  let moveExchangeTilesCB = () => {
  };

  let acceptOpponentWordCB = socketId => {
    let listenVerifyWord = socketId => {
      let callback = () => {

      };
      let onOptions = {
        "io": io,
        "socketId": socketId,
        "eventName": scrabbleEvents.reqScrabbleStateChangedSuccess,
        "callback": data => {
          callback(data);
          callback = null;
        }
      };

      socketHandlers.socketOnHandler(onOptions);
    };

    let listenAcceptWord = socketId => {
      let callback = () => {

      };

      let onOptions = {
        "io": io,
        "socketId": socketId,
        "eventName": scrabbleEvents.reqScrabbleStateChangedSuccess,
        "callback": data => {
          callback(data);
          callback = null;
        }
      };

      socketHandlers.socketOnHandler(onOptions);
    }

    listenVerifyWord(socketId);
    listenAcceptWord(socketId)
  };

  let waitWordAcceptCB = () => {
  };

  let waitingOpponentMoveCB = () => {
  };

  let stateChangeCallbacks = {
      "waitingInitialTiles": () => waitingInitialTilesCB(),
      "waitingGameStart": () => waitingGameStartCB(),
      "movePlaceWord": () => movePlaceWordCB(),
      "moveExchangeTiles": () => moveExchangeTilesCB(),
      "acceptOpponentWord": socketId =>  acceptOpponentWordCB(socketId),
      "waitWordAccept": () => waitWordAcceptCB(),
      "waitingOpponentMove": () => waitingOpponentMoveCB()
    };

  let listenChangeState = socketId => {
    if (io !== undefined && io !== null) { // TODO check if server object
      let socket = io.sockets.connected[String(socketId)];
      if (socket !== undefined) {
        let callback = data => {
          let state = data.state;

          room.setPlayerState({
            "login": data.login,
            "state": state
          });

          let cback = stateChangeCallbacks[state];
          if (typeof cback === "function") {
            cback(socketId);
          }

          cback = null;
          callback = null;
        };

        let onOptions = {
          "io": io,
          "socketId": socketId,
          "eventName": scrabbleEvents.reqScrabbleStateChangedSuccess,
          "callback": data => {
            callback(data);
            callback = null;
          }
        };

        socketHandlers.socketOnHandler(onOptions);
        socket = null;
        onOptions = null;
      }

    } else {
      // throw Error
    }

      // io.sockets.connected[socketId]
      // .on(scrabbleEvents.reqScrabbleStateChangedSuccess, data => {
      //   let state = data.state;
      //
      //   room.setPlayerState({
      //     "login": data.login,
      //     "state": state
      //   });
      //
      //   let callback = stateChangeCallbacks[state];
      //   if (typeof callback === "function") callback();
      //   callback = null;
      // });
      // socket = null;
    // }
  };

  let doForEachPlayer = options => {
    let {callback, socketIds = room.sockets} = Object(options);
    socketIds.forEach(id => {
      if (typeof callback === "function") {
        callback(id);
      }
    });
    callback = null;
  };

  let changeState = data => {
    let {
      state,
      socketIds = room.sockets,
      events
    } = data;

    game.state = state;

    console.log(messages.stateChanged({
      "roomId": room.id,
      "state": data.state
    }));

    let informStateChange = options => {
      let {id, events} = Object(options);

      let emitOptions = {
        "io": io,
        "socketId": id,
        "emit": {
          "eventName": scrabbleEvents.resScrabbleStateChanged,
          "data": {
            "state": state,
            "roomId": room.id
          },
        },
        "events": events
      };

      console.log("informing socket about state change: " + state + " " + id);
      socketHandlers.socketEmitHandler(emitOptions);
      emitOptions = null;
    }

    doForEachPlayer({
      "socketIds": socketIds,
      "callback": id => {
        listenChangeState({
          "id": id
        });
        informStateChange({
          "id": id,
          "events": events
        });
      }
    });

    informStateChange = null;
  };

  const startRound = options => {
    changeState({
      "state": states.get("movePlaceWord"),
      "socketIds": [options.socketId]
    });

    listenEndRound(options);
    listenExchangeTiles(options);
    listenResign(options);
  };

  /** Listen to end round.
      When round ended ask opponents to accept word.
      */
  const listenEndRound = options => {
    let callback = data => {
      let resAcceptWord = id => {
        listenChangeState(id);
        changeState({
          "socketIds": game.getOpponents(),
          "state": states.get("acceptOpponentWord"),
          "events":[
            {
              "eventName": scrabbleEvents.reqVerifyWord,
              "callback": () => {
                reqVerifyWord();
              }
            },
            {
              "eventName": scrabbleEvents.reqAcceptWord,
              "callback": () => {
                reqAcceptWord();
              }
            }
          ]
        });
      };

      let reqVerifyWord = () => {
        let wordIsCorrect = verifyWord(game.lastWord);
        let emitOptionsInCorrect = id => {
          return {
            "id": id,
            "callback": () => {
              changeState({
                "state": states.get("waitingOpponentMove"),
                "socketIds": [options.socketId]
              });

              startRound({
                "socketId": game.nextPlayer().socketId
              });
            }
          }
        };

        /** All players wait for information if word is correct. */
        changeState({
          "state": states.get("waitWordAccept")
        });

        if (wordIsCorrect) {
          changeState({
            "state": states.get("waitingOpponentMove"),
            "socketIds": [options.socketId]
          });

          startRound({
            "socketId": game.nextPlayer().socketId
          });
        } else {
          doForEachPlayer({
            "callback": id => {
              socketHandlers.socketEmitHandler(emitOptionsIncorrect(id));
            }
          });
        }
      };

      let reqAcceptWord = id => {
        let state = states.get("waitingOpponentMove");
        room.findPlayerBySocket(id).state = state;
        if (allPlayersState(state)) {
          startRound({
            "socketId": game.nextPlayer().socketId
          });
        }
        state = null;
      };

      game.placeTiles(data.fields);

      /** Ask opponents to accept word */
      doForEachPlayer({
        "socketIds": [...room.getOpponents()],
        "callback": id => resAcceptWord(id)
      });
    };

    let onOptions = {
      "io": io,
      "socketId": options.socketId,
      "eventName": scrabbleEvents.reqEndRound,
      "inform": {
        "room": room.id,
        "eventName": scrabbleEvents.resEndRound,
        "io": io,
        "data": data
      },
      "callback": data => callback(data)
    };

    socketHandlers.socketOnHandler(onOptions);
    onOptions = null;
  };

  const listenExchangeTiles = options => {
    let callback = () => {
    };

    let onOptions = {
      "io": io,
      "socketId": options.socketId,
      "eventName": scrabbleEvents.reqExchangeTiles,
      "callback": data => {
        callback(data);
        callback = null;
      }
    };

    socketHandlers.socketOnHandler(onOptions);
    // TODO emit to other players
    onOptions = null;
  };

  const listenResign = options => {
    let callback = () => {
    };

    let onOptions = {
      "io": io,
      "socketId": options.socketId,
      "eventName": scrabbleEvents.reqResign,
      "callback": data => {
        callback(data);
        callback = null;
      }
    };

    socketHandlers.socketOnHandler(onOptions);
    // TODO emit to other players
    onOptions = null;
  };

  const opponentWord = () => {
    let emitOptions = {
      emit: {
        event: scrabbleEvents.resOpponentWord
      },
      events: [
        {
          eventName: scrabbleEvents.ansOpponentWord, // TODO add event
          callback: () => {} // TODO
        }
      ]
    };
    socketHandlers.socketEmitHandler(emitOptions);
    emitOptions = null;
  };

  const opponentExchange = () => {
    let emitOptions = {
      emit: {
        event: scrabbleEvents.resOpponentExchange
      },
      events: [
        {
          eventName: scrabbleEvents.ansOpponentExchange, // TODO add event
          callback: () => {} // TODO
        }
      ]
    };
    socketHandlers.socketEmitHandler(emitOptions);
    emitOptions = null;
  };

  const opponentResign = () => {
    let emitOptions = {
      emit: {
        event: scrabbleEvents.resOpponentResign
      },
      events: [
        {
          eventName: scrabbleEvents.ansOpponentResign, // TODO add event
          callback: () => {} // TODO
        }
      ]
    };
    socketHandlers.socketEmitHandler(emitOptions);
    emitOptions = null;
  };

  preparePlayers();
  changeState({
    "state": states.get("waitingInitialTiles")
  });
};

module.exports = {
  scrabbleSocket: scrabbleSocket
};
