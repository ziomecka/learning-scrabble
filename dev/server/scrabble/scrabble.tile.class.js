/* jshint esversion: 6 */
const states = require ("./states/scrabble.states.tile");

class Tile {
  constructor() {
    ({letter: this.letter, points: this.points} = tileOptions);
    this._state = states.get("inBag");
  }

  get onRack ()  {
    return this._state === states.get("player").get("rack");
  }

  set onRack (bool) {
    if (bool === true) {
      this._state = states.get("player").get("rack");
    }
  }

  get toBeExchanged () {
    return this._state === states.get("player").get("exchanged");
  }

  set toBeExchanged (bool) {
    if (bool === true) {
      this._state = states.get("player").get("exchanged");
    }
  }

  get isPlayed () {
    return this._state === states.get("player").get("played");
  }

  set isPlayed (bool) {
    if (bool === true) {
      this._state = states.get("player").get("played");
    }
  }

  get onBoard () {
    return this._state === states.get("board");
  }

  set onBoard (bool) {
    if (bool === true) {
      this._state = states.get("board");
    }
  }

  get inBag () {
    return this._state === states.get("bag");
  }

  set inBag (bool) {
    if (bool === true) {
      this._state = states.get("bag");
    }
  }
}
