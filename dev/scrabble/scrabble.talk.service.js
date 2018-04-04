/* jshint esversion: 6 */
angular
  .module("scrabbleModule")
  .service("scrabbleTalk", [
    "socketService",
    "scrabbleEvents",
    function (socketService, scrabbleEvents) {

      this.createScrabble = options => {
        options.callbacks = Object(Object(options).callbacks);
        this.listenScrabbleCreated(options);
        socketService.emit(scrabbleEvents.reqCreateScrabble);
      };

      this.listenScrabbleCreated = options => {
        options.callbacks = Object(Object(options).callbacks);
        let {callbacks: {scrabbleCreated}} = options;
        let eventName = scrabbleEvents.resCreateScrabbleSuccess;
        socketService.on(eventName, data => {
            console.log("I was informed of created game.");
            scrabbleCreated(data);
            socketService.off(eventName);
          });
      };

      this.listenInitialTiles = options => {
        options.callbacks = Object(Object(options).callbacks);
        let {callbacks: {initialTiles}} = options;
        let eventName = scrabbleEvents.resInitialTiles;
        socketService.on(eventName, data => {
          socketService.off(eventName);
          initialTiles(data);
        });
      };

      this.listenRoundStarted = options => {
        options.callbacks = Object(Object(options).callbacks);
        let {callbacks: {roundStarted}} = options;
        let eventName = scrabbleEvents.resRoundStarted;
        socketService.on(eventName, data => {
          socketService.off(eventName);
          roundStarted(data);
        });
      };

      this.listenTilesExchanged = options => {
        options.callbacks = Object(Object(options).callbacks);
        let {callback} = options;
        let eventName = scrabbleEvents.resExchangeTilesSuccess;
        socketService.on(eventName, data => {
          socketService.off(eventName);
          callback(data);
        });
      };

      this.listenRoundEnded = options => {
        options.callbacks = Object(Object(options).callbacks);
        let {callback: {getTiles}} = options;

        let eventName = scrabbleEvents.resWordRejected;
        socketService.on(eventName, data => {
          socketService.off(eventName);
          socketService.off(scrabbleEvents.resRoundEnded);
          this.listenRoundStarted();
          getTiles(data);
        });

        let eventName2 = scrabbleEvents.resRoundEnded;
        socketService.on(eventName2, data => {
          socketService.off(eventName2);
          socketService.off(scrabbleEvents.wordRejected);
          this.listenRoundStarted();
          getTiles(data);
        });
      };

      this.verifyWord = options => {
        options.callbacks = Object(Object(options).callbacks);
        socketService.emit(scrabbleEvents.reqVerifyWord);
        // TODO listn to repsonse
      };

      this.exchangeTiles = options => {
        options.callbacks = Object(Object(options).callbacks);
        let {callbacks: {exchangedTiles}, tiles} = options;
        socketService.emit(scrabbleEvents.reqExchangeTiles, tiles);
        this.listenTilesExchanged({callback: exchangedTiles});
      };

      this.endRound = options => {
        options.callbacks = Object(Object(options).callbacks);
        socketService.emit(scrabbleEvents.reqEndRound);
        this.listenRoundEnded();
      };
    }
  ]);
