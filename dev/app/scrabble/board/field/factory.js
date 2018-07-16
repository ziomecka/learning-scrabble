/* jshint esversion: 6 */
const factory = (
  // scrabbleFieldTileService
  ScrabbleTileFactory
) => {
  "ngInject";

  const Tile = ScrabbleTileFactory.Tile;

  // let id = 0;
  // const allFields = new Map();
  //
  // let addField = tile => {
  //   let iid = `field_${id++}`;
  //   allFields.set(iid, tile);
  //   return iid;
  // };
  //
  // let findField = id => {
  //   return allFields.get(id);
  // };

  class Field {
    constructor(options) {
      ({
        id: this.id,
        bonus: this.bonus,
        tile: this._tile
      } = options);
      // this.id = addField(this);
    }

    static isField (object) {
      return (object instanceof this);
    }

    static getRow (txt) {
      return Number(txt.match(/\d+$/g)[0]);
    }

    static getColumn (txt) {
      return Number(txt.match(/^\d+/g)[0]);
    }

    get row () {
      return this.constructor.getRow(this.id);
    }

    get column () {
      return this.constructor.getColumn(this.id);
    }

    isTile (object) {
      return ScrabbleTileFactory.Tile.isTile(object);
    }

    set tile (tile) {
      if (tile !== null && tile !== undefined) {
        if (!this.isTile(tile) && Object(tile) === tile) {
          // tile = new ScrabbleTileFactory.Tile(tile);
          tile = new Tile(tile);
        }
        this._tile = tile;
        tile = null;
      } else {
        this._tile = null;
      }
    }

    get tile () {
      return this._tile;
    }

    put (tile) {
      this.tile = tile;
    }

    remove () {
      this.tile = null;
    }
  }

  return {
    Field: Field
    // findField: findField
  };
};

angular // eslint-disable-line no-undef
  .module("scrabbleBoardModule")
  .factory("ScrabbleFieldFactory", factory);
