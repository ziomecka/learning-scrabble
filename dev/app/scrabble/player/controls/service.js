/* jshint esversion: 6 */
class Service {
  constructor (
    scrabbleControlsSocket,
    scrabbleStatesService,
    scrabblePlayerService,
    socketFactory,
    scrabbleEvents,
    scrabbleBoardService,
    scrabbleRackService
  ) {
    "ngInject";

    Object.assign(this, {
      scrabbleControlsSocket,
      scrabbleStatesService,
      scrabblePlayerService,
      socketFactory,
      scrabbleBoardService,
      scrabbleRackService
    });

    this._tilesPlacedCorrectly;
    this.listens = {
      waitingInitialTiles: [
        {
          /* Player gets tiles */
          name: scrabbleEvents.resInitialTiles,
          callback: data => {
            this.acceptTiles(data.tiles);
            this.scrabbleStatesService = "waitingOpponentMove";
          }
        }
      ],
      waitingOpponentMove: [
        {
          /** Opponent placed word. Player accepts it. */
          name: scrabbleEvents.resOpponentWord,
          callback: (data) => {
            this.scrabbleBoardService.placeTiles(data.tiles);
            this.state = "acceptOpponentWord";
          }
        },
        {
          name: scrabbleEvents.resOpponentExchange,
          callback: (data) => {
            this.scrabbleLog.log = data;
          }
        },
        {
          name:scrabbleEvents.resOpponentResign,
          callback: (data) => {
            this.scrabbleLog.log = data;
          }
        },
        {
          /* Player can place word */
          name: scrabbleEvents.resStartRound,
          callback: data => {
            this.acceptTiles(data.tiles);
            this.state = "movePlaceWord";
            // offEvents: [
            //   scrabbleEvents.resOpponentWord,
            //   scrabbleEvents.resOpponentExchange,
            //   scrabbleEvents.resOpponentResign
            // ]
          }
        }
      ]
    };
  }

  get state () {
    return this.scrabbleStatesService.state;
  }

  set state (state) {
    this.scrabbleStatesService.state = (state);
    this.listen(state);
  }

  get tilesPlacedCorrectly () {
    return this.scrabbleBoardService.tilesPlacedCorrectly;
  }

  /** Buttons' clisks */

  placeWord () {
    // console.log(`Placed tiles: ${angular.toJson(this.scrabbleBoardService.usedFields)}`);
    this.scrabbleControlsSocket.endRound({
      "data": {
        "fields": this.scrabbleBoardService.usedFields
      },
      successAccepted: () => {
      },
      successRejected: () => {
      },
      failure: () => {
      }
    });
    // this.listenStartRound();
    // this.listenOpponentWord();
    // this.listenOpponentExchange();
    // this.listenOpponentResign();
    // console.log(`gameState after place word ${this.state}`);
  }

  letsExchange () {
    this.scrabbleBoardService.exchangeTiles();
    this.scrabbleStatesService.isExchangingTiles = true;
    this.scrabbleRackService.letsExchange();
    // console.log(`gameState after letsExchange ${this.state}`);
  }

  resignMove () {
    this.scrabbleBoardService.resign();
    this.scrabbleControlsSocket.resign();
    // console.log(`gameState after resignMove ${this.state}`);
  }

  exchangeTiles () {
    // console.log(`Exchanged tiles: ${angular.toJson(this.scrabbleRackService.exchangeTiles())}`);
    this.scrabbleStatesService.isExchangingTiles = true;
    this.scrabbleControlsSocket.exchangeTiles({
      data: {
        tiles: this.scrabbleRackService.exchangeTiles()
      },
      success: data => {
        console.log(`Exchange, data received: ${JSON.stringify(data)}`);
        let scrabbleRackService = this.scrabbleRackService;
        scrabbleRackService.exchangeTiles({"remove": true});
        scrabbleRackService.placeTiles(data);
        this.scrabbleStatesService.isWaitingOpponentMove = true;
        scrabbleRackService = null;
      },
      failure: () => {
        // TODO
      }
    });
    // console.log(`gameState after exchangeTiles ${this.state}`);
  }

  resignExchange () {
    this.scrabbleStatesService.isExchangingTiles = false;
    this.scrabbleRackService.resignExchange();
    // console.log(`gameState after resignExchange ${this.state}`);
  }

  /** Accept opponent's word. */
  acceptWord () {
    this.scrabbleBoardService.acceptWord();
    this.scrabbleBoardService.acceptWord();
    this.scrabbleControlsSocket.acceptWord();
    // console.log(`gameState after acceptWord ${this.state}`);
  }

  /** Verify opponent's word. */
  verifyWord () {
    this.scrabbleControlsSocket.verifyWord();
    // console.log(`gameState after verifyWord ${this.state}`);
  }


  /** Socket */
  listen (state) {
    this.socketFactory.listen(this.listens[state]);
  }

  stopListen (state) {
    this.socketFactory.stopListen(this.listens[state]);
  }

  /**  Actions */
  // acceptTiles (tiles) {
  //   this.scrabblePlayerService.tiles = tiles;
  // }
}

angular // eslint-disable-line no-undef
  .module("scrabbleControlsModule")
  .service("scrabbleControlsService", Service);
