/* jshint esversion: 6 */
const factory = (
  scrabbleStatesService,
  scrabbleTileStates
) => {
  "ngInject";

  let id = 0;
  const allTiles = new Map();

  let addTile = tile => {
    let iid = `tile_${id++}`;
    allTiles.set(iid, tile);
    return iid;
  };

  let findTile = id => {
    return allTiles.get(id);
  };

  class Tile {
    constructor(
      tileOptions
    ) {
      "ngInject";
      ({
        letter: this.letter,
        points: this.points,
        field: this._field
      } = Object(tileOptions));

      this.id = addTile(this);

      try {
        this._state = scrabbleTileStates.get(tileOptions.state);
      } catch (err) {
        throw Error ("State not provided");
      }
    }

    static isTile (object) {
      return (object instanceof this);
    }

    get state () {
      return this._state;
    }

    set state (state) {
      this._state = state;
    }

    get stateDescription () {
      return Array.from(scrabbleTileStates.keys())
      .find(state => {
        return scrabbleTileStates.get(state) === this.state;
      }, this);
    }

    get column () {
      if (this.field) {
        return this.field.column;
      } else {
        return undefined;
      }
    }

    get isOnRack () {
      return this._state === scrabbleTileStates.get("onRack");
    }

    set isOnRack (boolean) {
      if (boolean === true) {
        this._state = scrabbleTileStates.get("onRack");
      } else {
        /** If  tile is not longer on rack it should be specified where it is. */
        // throw Error("Other state should be used."); // TODO
      }
    }

    get isBeingExchanged () {
      return this._state === scrabbleTileStates.get("beingExchanged");
    }

    set isBeingExchanged (boolean) {
      if (boolean === true) {
        this._state = scrabbleTileStates.get("beingExchanged");
      } else {
        /** If player resigns from exchanging the tile gets back on rack */
        this.isOnRack = true;
      }
    }

    get isBeingPlayed () {
      return this._state === scrabbleTileStates.get("beingPlayed");
    }

    set isBeingPlayed (boolean) {
      if (boolean === true) {
        this._state = scrabbleTileStates.get("beingPlayed");
      } else {
        /** If player resigns from playing the tile, the tile gets back on rack */
        this.isOnRack = true;
      }
    }

    get isPlacedOnBoard () {
      return this._state === scrabbleTileStates.get("placedOnBoard");
    }

    set isPlacedOnBoard (boolean) {
      if (boolean === true) {
        this._state = scrabbleTileStates.get("placedOnBoard");
      } else {
        /** If player resigns from placing tile on board, the tile gets back on rack. */
        this.isOnRack = true;
      }
    }

    get isAlreadyPlayed () {
      return this._state === scrabbleTileStates.get("alreadyPlayed");
    }

    set isAlreadyPlayed (boolean) {
      if (boolean === true) {
        this._state = scrabbleTileStates.get("alreadyPlayed");
      } else {
        /** If played tile is not longer on board it means it is back in bag. */
        this.isInBag = true;
      }
    }

    get isInBag () {
      return this._state === scrabbleTileStates.get("inBag");
    }

    set isInBag (boolean) {
      if (boolean === true) {
        this._state = scrabbleTileStates.get("inBag");
      } else {
        /** If played tile is not longer in bag it should be specified where it is. */
        // throw Error("Other state should be used."); // TODO
      }
    }

    // TODO it should not be needed, however when I remove it I get errors
    get draggable () {
      return (
        scrabbleStatesService.isPlacingWord &&
        (this.isPlacedOnBoard || this.isOnRack)
      );
    }

    toJSON () {
      return {
        letter: this.letter,
        points: this.points
      }
    }
  }

  return {
    Tile: Tile,
    findTile: findTile
  };
};

angular // eslint-disable-line no-undef
  .module("scrabbleTileModule")
  .factory("ScrabbleTileFactory", factory);
