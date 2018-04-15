/* jshint esversion: 6 */
angular
  .module("scrabbleModule")
  .service("scrabbleSocket", [
    "socketService",
    "scrabbleEvents",
    function (socketService, scrabbleEvents) {

      /** Data shared with controller */
      this.data = {
        status: ""
      };

      this.changeStatus = {
        roundStarted: () => this.data.status = ""
      };

      this.display = {
        opponentExchange: () => {}, // TODO
        opponentResign: () => {} // TODO
      };

      this.acceptTiles = () => {}; //TODO

      /////////////////
      // CREATE GAME //
      /////////////////
      this.createGame = options => {
        options = Object(options);
        options.emit = {
          eventName: scrabbleEvents.reqCreateScrabble
          // data: options.tiles
        };
        options.events = [
          {
            eventName: scrabbleEvents.resCreateScrabbleSuccess,
            callback: options.success,
            // offEvents: [scrabbleEvents.resWordRejected]
          },
          // {
          //   eventName: scrabbleEvents.resWordRejected,
          //   callback: options.failure,
          //   offEvents: [scrabbleEvents.resRoundEnded]
          // }
        ];
        socketService.emitHandler(options);
        this.listenRegisterOpponent();
      };

      ////////////////////
      // INITIAL TILES  //
      ////////////////////
      this.listenInitialTiles = () => {
        let options = {
          eventName: scrabbleEvents.resInitialTiles,
          callback: this.acceptTiles,
          offEvents: []
        };
        socketService.onHandler(options);
      };

      ///////////
      // ROUND //
      ///////////
      this.listenStartRound = () => {
        let options = {
          eventName: scrabbleEvents.resStartRound,
          callback: this.changeStatus.roundStarted,
          offEvents: [
            scrabbleEvents.resOpponentWord,
            scrabbleEvents.resOpponentExchange,
            scrabbleEvents.resOpponentResign
          ]
        };
        socketService.onHandler(options);
      };

      /////////////////
      // WORD PLACED //
      /////////////////
      this.endRound = options => {
        options = Object(options);
        options.emit = {
          eventName: scrabbleEvents.reqEndRound,
          data: options.tiles
        };
        options.events = [
          {
            eventName: scrabbleEvents.resRoundEnded,
            callback: options.success,
            offEvents: [scrabbleEvents.resWordRejected]
          },
          {
            eventName: scrabbleEvents.resWordRejected,
            callback: options.failure,
            offEvents: [scrabbleEvents.resRoundEnded]
          }
        ];
        socketService.emitHandler(options);
        this.listenStartRound();
        this.listenOpponentWord();
        this.listenOpponentExchange();
        this.listenOpponentResign();
      };

      ////////////////////
      // EXCHANGE TILES //
      ////////////////////
      this.exchangeTiles = options => {
        options = Object(options);
        options.emit = {
          eventName: scrabbleEvents.reqExchangeTiles,
          data: options.tiles
        };
        options.events = [
          {
            eventName: scrabbleEvents.resExchangeTilesSuccess,
            callback: options.success
          }
        ];
        socketService.emitHandler(options);
        this.listenStartRound();
        this.listenOpponentWord();
        this.listenOpponentExchange();
        this.listenOpponentResign();
      };

      ////////////
      // RESIGN //
      ////////////
      this.resign = options => {
        options = Object(options);
        options.emit = {
          eventName: scrabbleEvents.reqResign
        };
        options.events = [
          {
            eventName: scrabbleEvents.resResignSuccess,
            callback: () => {} //TODO
          }
        ];
        socketService.emitHandler(options);
      };

      /////////////////////
      // OPPONENT'S MOVE //
      /////////////////////
      this.listenOpponentWord = () => {
        let options = {
          eventName: scrabbleEvents.resOpponentWord,
          callback: this.changeStatus.verifyWord,
          offEvents: []
        };
        socketService.onHandler(options);
      };

      /** User verifies opponent's word. */
      this.verifyWord = options => {
        options = Object(options);
        options.emit = {
          eventName: scrabbleEvents.reqVerifyWord,
          data: options.data
        };
        options.events = [
          {
            eventName: scrabbleEvents.resVerifyWordRejected,
            callback: options.success,
            offEvents: [scrabbleEvents.resVerifyWordAccepted]
          },
          {
            eventName: scrabbleEvents.resVerifyWordAccepted,
            callback: options.failure,
            offEvents: [scrabbleEvents.resVerifyWordRejected]
          }
        ];
        socketService.emitHandler(options);
      };

      /** User accepts opponent's word. */
      this.acceptWord = options => {
        options = Object(options);
        options.emit = {
          eventName: scrabbleEvents.reqAcceptWord,
          data: options.data
        };
        options.events = [
          {
            eventName: scrabbleEvents.resAcceptWordSuccess,
            offEvents: [scrabbleEvents.resVerifyWordAccepted]
          },
          {
            eventName: scrabbleEvents.resAcceptWordFailure,
            callback: options.failure,
            offEvents: [scrabbleEvents.resAcceptWordSuccess]
          }
        ];
        socketService.emitHandler(options);
      };

      this.listenOpponentExchange = () => {
        let options = {
          eventName: scrabbleEvents.resOpponentExchange,
          callback: this.display.opponentExchange,
          offEvents: []
        };
        socketService.onHandler(options);
      };

      this.listenOpponentResign = () => {
        let options = {
          eventName: scrabbleEvents.resOpponentResign,
          callback: this.display.opponentResign,
          offEvents: []
        };
        socketService.onHandler(options);
      };
    }
  ]);
