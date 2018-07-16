/* jshint esversion: 6 */
class scrabbleDDService {
  constructor (
    ScrabbleTileFactory,
    ScrabbleFieldFactory,
    $rootScope
  ) {
    "ngInject";

    Object.assign(this, {
      ScrabbleTileFactory,
      ScrabbleFieldFactory,
      $rootScope
    });

    this.dragged = {};
    this.board = undefined,
    this.rack = undefined;
  }


  isTile (tile) {
    return (tile instanceof this.ScrabbleTileFactory.Tile);
  }

  isField (field) {
    return (field instanceof this.ScrabbleFieldFactory.Field);
  }

  findField (options) {
    let {tile, fields} = Object(options);
    let id = tile.id || tile;
    let t;
    return fields.find(field => {
      t = field._tile;
      if (t !== null && t !== undefined) {
        return id === t.id;
      }
      t = null;
    });
  }

  endDropTile (options) {
    let {dragged} = options;
    let tile = this.dragged.tile
    this.dragged.tile = null;

    if (dragged) {
      let $rootScope = this.$rootScope;
      let place = dragged.place ;
      if (!$rootScope.$$phase) {
        $rootScope.$apply(() => {
          place.tile = null;
        })
      } else  {
        place.tile = null;
      }
      $rootScope = null;
      place = null;
    }

    return tile;
  }

  startDragTile (options) {
    let {tile, fields} = Object(options);
    ({rack: this.rack = this.rack, board: this.board = this.board} = Object(options));

    if (!this.isTile(tile)) {
      tile = this.ScrabbleTileFactory.findTile(tile);
    }
    let dragged = this.dragged;
    if (tile && Array.isArray(fields)) {
      let field = this.findField(options);

      if (field !== undefined) {
        dragged.tile = field.tile;
        dragged.place = field;
        field = null;
      } else {
        dragged.tile = tile;
      }
    } else {
      throw Error ("Only tile can be dragged.")
    }

    return dragged;
  }

  // removeFromBoard (tile) {
  //   this.board.removeTile({"tile": tile});
  // }

  endDragTile (options) {
    let {result, dragged} = options;

    if (result) {
      let $rootScope = this.$rootScope;
      let place = dragged.place || dragged.field;
      if (!$rootScope.$$phase) {
        $rootScope.$apply(() => {
          place.tile = null;
        })
      } else  {
        place.tile = null;
      }
      $rootScope = null;
      place = null;
    }
  }
}

angular // eslint-disable-line no-undef
  .module("scrabbleRackModule")
  .service("scrabbleDDService", scrabbleDDService);
