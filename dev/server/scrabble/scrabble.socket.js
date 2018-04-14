/* jshint esversion: 6 */
const scrabbleEvents = require("./scrabble.events");
const Scrabble  = require("./scrabble.game").Scrabble;
const allScrabbles  = require("./scrabble.game").allScrabbles;

const socketHandlers = require("../app/handlers/socket.handlers");

const scrabbleSocket = socket => {
  console.log(`ScrabbleSocket initialised`);

  const room = roomID => {};
  const playerSocket = player => {};

  /** TODO how to all players? */
  const initialTiles = options => {
    let {roomId} = options;
    let data = room(roomId).game.intitialTiles();

    data.forEach(d => {
      let {player, tiles} = d;
      let s = playerSocket(player);

      let emitOptions = {
        socket: s,
        emit: {
          event: scrabbleEvents.resInitialTiles,
          data: tiles
        },
        events: [
          {
            eventName: scrabbleEvents.ansInitialTiles, // TODO add event
            callback: () => {
              // check if all answered, if yes start the game
              startRound({
                socket: playerSocket(game.nextPlayer()),
                opponents: playerSocket(game.opponents())
                // socket should be stored in game players?
                // if player loses connection is removed socket
                // if user gets connection and is in the list:
                //  user - game
                //  its socket is registers in game
              });

                // emit start round, should return player and opponents
            } // TODO
          }
        ]
      };
      socketHandlers.emitHandler(emitOptions);
    });
    emitOptions = null;
  };

  const startRound = options => {
    let emitOptions = {
      socket: options.socket,
      emit: {
        event: scrabbleEvents.resRoundStarted
      },
      events: [
        {
          eventName: scrabbleEvents.ansRoundStarted, // TODO add event
          callback: () => {} // TODO
        }
      ]
    };
    socketHandlers.emitHandler(emitOptions);
    emitOptions = null;
  };

  const listenEndRound = options => {
    let {data} = options;
    let onOptions = {
      eventName: scrabbleEvents.reqEndRound,
      callback: () => {}, // TODO
      offEvents: []
    };
    socketHandlers.onHandler(onOptions);
    // TODO emit to other players
    onOptions = null;
  };

  const listenExchangeTiles = options => {
    let {data} = options;
    let onOptions = {
      eventName: scrabbleEvents.reqExchangeTiles,
      callback: () => {}, // TODO
      offEvents: []
    };
    socketHandlers.onHandler(onOptions);
    // TODO emit to other players
    onOptions = null;
  };

  const listenResign = options => {
    let {data} = options;
    let onOptions = {
      eventName: scrabbleEvents.reqResign,
      callback: () => {}, // TODO
      offEvents: []
    };
    socketHandlers.onHandler(onOptions);
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
    socketHandlers.emitHandler(emitOptions);
    emitOptions = null;
  };

  const listenVerifyWord = options => {
    let {data} = options;
    let onOptions = {
      eventName: scrabbleEvents.reqVerifyWord,
      callback: () => {}, // TODO
      offEvents: []
    };
    socketHandlers.onHandler(onOptions);
    // TODO emit to other players
    onOptions = null;
  };

  const listenAcceptWord = options => {
    let {data} = options;
    let onOptions = {
      eventName: scrabbleEvents.reqAcceptWord,
      callback: () => {}, // TODO
      offEvents: []
    };
    socketHandlers.onHandler(onOptions);
    // TODO emit to other players
    onOptions = null;
  };
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
    socketHandlers.emitHandler(emitOptions);
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
    socketHandlers.emitHandler(emitOptions);
    emitOptions = null;
  };

module.exports = {
  scrabbleSocket: scrabbleSocket
};
