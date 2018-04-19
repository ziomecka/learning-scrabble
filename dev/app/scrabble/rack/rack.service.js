/* jshint esversion: 6 */
class RackService {
  constructor (rackOptions, tileFactory) {
    "ngInject";
    this.tileFactory = tileFactory;
    ({numberPlaces: this.numberPlaces = 7} = rackOptions);
    this.places = [];
    for (let i = 0; i < this.numberPlaces; i++) {
      this.places.push({});
    }
  }

  get tiles () {
    return this.places;
  }

  set tiles (tiles) {
    this.placeTiles(tiles);
  }

  placeTile (tile) {
    if (tile) {
      const index = this.places.findIndex(item => {
        return item.tile === undefined;
      });
      if (tile instanceof this.tileFactory) {
        this.places[index].tile = tile;
      } else {
        this.places[index].tile = new this.tileFactory(tile);
      }
    }
  }

  placeTiles (tiles) {
    // TODO sliced!!!
    Array.from(tiles.slice(0, 7)).forEach(tile => {
      this.placeTile(tile);
    });
  }
}

angular
  .module("rackModule")
  .service("rackService", RackService);
