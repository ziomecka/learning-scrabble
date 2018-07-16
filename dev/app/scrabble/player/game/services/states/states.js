/* jshint esversion: 6 */
class Service {
  constructor (
    scrabbleGameStates,
    coreToggleStatesService
  ) {
    "ngInject";

    Object.assign(this, {
      scrabbleGameStates,
      coreToggleStatesService
    });

    this._state;
    this._activeSockets = [];

    this.statesServices = {
      "waitingInitialTiles": [
        // "scrabbleWaitingInitialTilesService"
      ],
      "waitingOpponentMove": [
        // "scrabbleWaitingOpponentMove"
      ],
      "movePlaceWord": [

      ]
    };
  }

  get activeSocket () {
    return undefined; // TODO
  }

  set activeSocket (socket) {
    this._activeSockets.push(socket);
  }

  get activeSockets () {
    return this._activeSockets;
  }

  set activeSockets (arr) {
    this._activeSockets = arr;
  }

  get stateDescription () {
    return Array.from(this.scrabbleGameStates.keys())
    .find(state => {
      return this.scrabbleGameStates.get(state) === this.state;
    }, this);
  }

  get isWaitingOpponentMove () {
    return this._state === this.scrabbleGameStates.get("waitingOpponentMove");
  }

  set isWaitingOpponentMove (value) {
    if (value === true) {
      this._state = this.scrabbleGameStates.get("waitingOpponentMove");
    } else {
      // this._state === this.scrabbleGameStates.get("movePlaceWord")
    }
  }

  get isWaitingInitialTiles () {
    return this._state === this.scrabbleGameStates.get("waitingInitialTiles");
  }

  set isWaitingInitialTiles (value) {
    if (value === true) {
      this._state = this.scrabbleGameStates.get("waitingInitialTiles");
    } else {
      // this._state === this.scrabbleGameStates.get("movePlaceWord")
    }
  }

  get isPlacingWord () {
    return this._state === this.scrabbleGameStates.get("movePlaceWord");
  }

  set isPlacingWord (value) {
    if (value === true) {
      this._state = this.scrabbleGameStates.get("movePlaceWord");
    } else {
      // this._state === this.scrabbleGameStates.get("movePlaceWord")
    }
  }

  get isExchangingTiles () {
    return this._state === this.scrabbleGameStates.get("moveExchangeTiles");
  }

  set isExchangingTiles (value) {
    if (value === true) {
      this._state = this.scrabbleGameStates.get("moveExchangeTiles");
    } else {
      this.isPlacingWord = true;
    }
  }

  get isAcceptingOpponentWord () {
    return this._state === this.scrabbleGameStates.get("acceptOpponentWord");
  }

  get state () {
    return this._state;
  }

  set state (state) {
    this._state = this.scrabbleGameStates.get(state);
    this.toggleStateSockets(state);
    console.log("Scrabble state has been changed to: " + this._state);
  }

  toggleStateSockets (state) {
    let stateSockets = () => {
      if (this.statesServices[state]) {
        return this.statesServices[state].map(socketName => this[socketName]) ;
      } else {
        return [];
      }
    };

    this._activeSockets = this.coreToggleStatesService
    .toggleStateSockets({
      "statesServices": this.statesServices,
      "stateSockets": stateSockets(),
      "state": state,
      "activeSockets": this.activeSockets
    });

    stateSockets = null;
  }
}

angular // eslint-disable-line no-undef
  .module("scrabbleGameModule")
  .service("scrabbleStatesService", Service);
