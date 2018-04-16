/* jshint esversion: 6 */
angular
.module("tileModule")
.factory("tileFactory", [
  "tileOptions",
  "tileStates",
  function (tileOptions, tileStates) {
    class Tile {
      constructor() {
        ({letter: this.letter, points: this.points} = tileOptions);
        // this._state = tileStates.get("inBag");
      }

      // get onRack ()  {
      //   return this._state === tileStates.get("player").get("rack");
      // }
      //
      // set onRack (bool) {
      //   if (bool === true) {
      //     this._state = tileStates.get("player").get("rack");
      //   }
      // }
      //
      // get toBeExchanged () {
      //   return this._state === tileStates.get("player").get("exchanged");
      // }
      //
      // set toBeExchanged (bool) {
      //   if (bool === true) {
      //     this._state = tileStates.get("player").get("exchanged");
      //   }
      // }
      //
      // get isPlayed () {
      //   return this._state === tileStates.get("player").get("played");
      // }
      //
      // set isPlayed (bool) {
      //   if (bool === true) {
      //     this._state = tileStates.get("player").get("played");
      //   }
      // }
      //
      // get onBoard () {
      //   return this._state === tileStates.get("board");
      // }
      //
      // set onBoard (bool) {
      //   if (bool === true) {
      //     this._state = tileStates.get("board");
      //   }
      // }
      //
      // get inBag () {
      //   return this._state === tileStates.get("bag");
      // }
      //
      // set inBag (bool) {
      //   if (bool === true) {
      //     this._state = tileStates.get("bag");
      //   }
      // }
    }
    return Tile;
  }
]);
