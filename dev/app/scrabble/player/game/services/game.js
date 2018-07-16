/* jshint esversion: 6 */
class Service {
  constructor (
    socketFactory,
    scrabbleEvents,
    scrabbleStatesService,
    scrabbleRackService,
    scrabbleBoardService,
    scrabbleWaitingInitialTilesService,
    scrabbleWaitingOpponentMove
  ) {
    "ngInject";

    Object.assign(this, {
      socketFactory,
      scrabbleStatesService,
      scrabbleRackService,
      scrabbleBoardService,
      scrabbleWaitingInitialTilesService,
      scrabbleWaitingOpponentMove
    });

    this.listens = [
      {
        name: scrabbleEvents.resScrabbleStateChanged,
        callback: function (data) {
          let state = data.state;
          if (state !== this.state) {
            scrabbleStatesService.state = data.state;
            socketFactory.emitHandler({
              "emit": {
                "eventName": scrabbleEvents.reqScrabbleStateChangedSuccess,
                "data": data
              }
            });
          }
        }.bind(this)
      },
      {
        /* Player gets tiles */
        name: scrabbleEvents.resInitialTiles,
        callback: function (data) {
          this.acceptTiles(data.tiles);
          socketFactory.emitHandler({
            "emit": {
              "eventName": scrabbleEvents.reqInitialTilesSuccess,
              "data": data
            }
          });
        }.bind(this)
      },
      {
        /* Player gets tiles */
        name: scrabbleEvents.resEndRound,
        callback: function (data) {
          this.placeTiles(data.fields);
          // socketFactory.emitHandler({
          //   "emit": {
          //     "eventName": scrabbleEvents.reqInitialTilesSuccess,
          //     "data": data
          //   }
          // });
        }.bind(this)
      }
    ];
    // this._board;s
  }

  clear () {
    this.state = "waitingForPlayers";
    this.scrabbleRackService.clear();
  }

  get state () {
    return this.scrabbleStatesService.state;
  }

  set state (state) {
    this.scrabbleStatesService.state = state;
  }

  listen () {
    this.socketFactory.listen(this.listens);
  }

  stopListen () {
    this.socketFactory.stopListen(this.listens);
  }

  acceptTiles (tiles) {
    this.scrabbleRackService.tiles = tiles;
  }

  placeTiles (fields) {
    this.scrabbleBoardService.placeTiles(fields);
  }
}

angular // eslint-disable-line no-undef
  .module("scrabbleGameModule")
  .service("scrabbleGameService", Service);
