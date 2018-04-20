/* jshint esversion: 6 */
class RackService {
  constructor (rackOptions, tileFactory, fieldFactory) {
    "ngInject";
    this.tileFactory = tileFactory;
    ({numberPlaces: this.numberPlaces = 7} = rackOptions);
    this.places = [];
    for (let i = 0; i < this.numberPlaces; i++) {
      this.places.push(new fieldFactory({"row": 0, "column": i}));
    }
  }

  get tiles () {
    return this.places;
  }

  set tiles (tiles) {
    this.placeTiles(tiles);
  }

  placeTile (options) {
    let {tile, field} = options;
    /** Find an empty place */
    const findPlace = () => {
      return this.places.findIndex(item => {
        return (item.tile === undefined || item.tile === null);
      });
    };
    if (tile) {
      /** If field is not an integer between 0 and 6,
          then find an emoty place.
          */
      if (!Number.isInteger(field) || field < 0 || field > (this.numberPlaces - 1)) {
        field = findPlace();
      }
      if (tile instanceof this.tileFactory) {
        this.places[field].tile = tile;
      } else {
        this.places[field].tile = new this.tileFactory(tile);
      }
    }
    tile = null;
    field = null;
  }

  placeTiles (tiles) {
    // TODO sliced!!!
    Array.from(tiles.slice(0, 7)).forEach(tile => {
      this.placeTile({
        tile: tile
      });
    });
  }
}

angular
  .module("rackModule")
  .service("rackService", RackService);
