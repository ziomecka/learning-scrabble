/* jshint esversion: 6 */
class RackService {
  constructor (
    rackOptions,
    ScrabbleTileFactory,
    ScrabbleFieldFactory,
    scrabbleDDService,
    $rootScope
  ) {
    "ngInject";

    Object.assign(this, {
      ScrabbleTileFactory,
      scrabbleDDService,
      $rootScope
    });

    /** Prepare places on rack */
    ({numberPlaces: this.numberPlaces = 7} = rackOptions);
    this.places = [];
    for (let i = 0; i < this.numberPlaces; i++) {
      this.places.push(new ScrabbleFieldFactory.Field({"row": 0, "column": i}));
    }
  }

  get tiles () {
    return this.places.map(place => {
      return place.tile;
    });
  }

  set tiles (tiles) {
    this.placeTiles(tiles);
  }

  isTile (tile) {
    return (tile instanceof this.ScrabbleTileFactory.Tile);
  }

  isField (field) {
    return (field instanceof this.ScrabbleFieldFactory.Field);
  }

  select (options) {
    let {tile, state} = options;
    if (state === "isBeingPlayed") {
      this.tiles.forEach(tile => {
        let id = tile.id || tile;
        if (tile.id !== (id)) {
          tile.isBeingPlayed = false;
        } else {
          tile.isBeingPlayed = true;
        }
        id = null;
      });
    } else {
      this.places.find(item => {
        let id = tile.id || tile;
        if (item.tile) {
          if (item.tile.id === (id)) {
            item.tile[state] = true;
            return true;
          }
        }
        id = null;
      });
    }
    tile = null;
  }

  placeTile (options) {
    let {tile, field} = options;
    let hOP = (object, property) => {
      return {}.hasOwnProperty.apply(object, [property]);
    }

    if (!this.isTile(tile)) {
      tile = Object(tile);
      if (!hOP(tile, "letter") && !hOP(tile, "points")) {
        tile = null;
        field = null;
        throw Error("Arguments are not correct.");
      } else {
        tile = new this.ScrabbleTileFactory.Tile(tile);
      }
    }

    /** Find an empty place */
    const findPlace = () => {
      return this.places.findIndex(item => {
        return (item.tile === undefined || item.tile === null);
      });
    };

    if (tile) {
      /** If field is not an integer between 0 and 6,
          then find an empty place.
          */
      if (!Number.isInteger(field * 1) || field < 0 || field > (this.numberPlaces - 1)) {
        field = findPlace();
      }

      if (field !== -1) {
        this.places[field].tile = tile;
      } else {
        throw Error ("No empty field on rack.");
      }
    }

    this.places[field].tile.isOnRack = true;
    tile = null;
    field = null;
  }

  placeTiles (tiles) {
    if (Array.isArray(tiles)) {
      /** Take no more than 7 tiles. */
      Array.from(tiles.slice(0, 7)).forEach(tile => {
        this.placeTile({
          "tile": tile
        });
      });
    }
  }

  removeTile (tile) {
    let id = tile.id || tile;
    let place = this.places
    .find(item => {
      if (item.tile) {
        return item.tile.id === id;
      }
    });
    if (place) {
      place.tile = null;
      place = null;
      id = null
      return true;
    }
    place = null;
    id = null
    return false;
  }

  exchangeTiles (options) {
    let {remove: remove = false} = Object(options);
    return this.places.filter(place => {
      if (place.tile && place.tile.isBeingExchanged) {
        let tile = place.tile;
        if (remove) {
          place.tile = null;
        }
        return tile;
      }
    });
  }

  letsExchange () {
    // this.tiles.forEach(tile => {
    //   tile.isBeingExchanged = true;
    // });
  }

  resignExchange () {
    this.tiles.forEach(tile => {
      tile.isOnRack = true;
    });
  }

  startDragTile (tile) {
    /** this._dragged stores place.
        Needed to remove tile on dragend.
        */
    this._dragged = this.scrabbleDDService.startDragTile({
      tile: tile,
      fields: this.places,
      rack: this
    });
  }

  endDropTile (options) {
    let {field} = options;
    let tile = this.scrabbleDDService.endDropTile({
      "dragged": this._dragged
    });
    tile.isOnRack = true;
    field.tile = tile;

    let $rootScope = this.$rootScope;
    if (!$rootScope.$$phase) {
      $rootScope.$digest();
    }

    this._dragged = null;
    $rootScope = null;
    field = null;
    tile = null;
  }

  endDragTile (result) {
    this.scrabbleDDService.endDragTile({
      "result": result,
      "dragged": this._d
    });
  }

  clear () {
    this.places.forEach(place => {
      place.tile = null;
    });
  }
}

angular // eslint-disable-line no-undef
  .module("scrabbleRackModule")
  .service("scrabbleRackService", RackService);
