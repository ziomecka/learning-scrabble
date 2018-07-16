/* jshint esversion: 6 */
class ScrabbleFieldsTilesService {
  constructor (
    ScrabbleFieldFactory,
    ScrabbleTileFactory
  ) {
    "ngInject";

    Object.assign(this, {
      ScrabbleFieldFactory,
      ScrabbleTileFactory
    });
  }

  getNeighbourField (options) {
    let {
      board,
      field,
      direction = 2
    } = options;

    let side = options.side;
    let sides;

    if (Math.abs(side) === 1) {
      sides = [side];
    } else {
      sides = [-1, 1];
    }

    let calculateCoordinates = options => {
      let {
        value,
        side,
        size = board.size
      } = options;
      let newValue = value + side;
      return (newValue >= 0 && newValue < size)? newValue : undefined;
    };

    let row = field.row;
    let column = field.column;

    if (row !== undefined && column !== undefined) {
      let cors;

      let checkRow = {
        nextColumn: () => column,
        nextRow: side => calculateCoordinates({"value": row, "side": side})
      };

      let checkColumn = {
        nextRow: () => row,
        nextColumn: side => calculateCoordinates({"value": column, "side": side})
      };

      if (direction === 1) {
        cors = [checkRow];
      } else if (direction === 0) {
        cors = [checkColumn];
      } else if (direction === 2) {
        cors = [checkRow, checkColumn];
      } else {
        throw new Error ("");
      }

      // calculateCoordinates = null;
      // checkRow = null;
      // checkColumn = null;

      return sides.map(side => {
        return cors.map(cor => {
          let r = cor.nextRow(side);
          let c = cor.nextColumn(side);

          if (r !== undefined && c !== undefined) {
            return board.rows[r][c];
          } else {
            return null;
          }
        }, this);
      }, this)
      .reduce((acc, val) => {
        // if (cors) {
        //   cors = null;
        // }
        acc.push(...val);
        return acc;
      }, []);
    } else {
      throw Error("Column and direction not provided.");
    }
  }

  isTile (object) {
    return this.ScrabbleTileFactory.Tile.isTile(object);
  }

  isField (object) {
    return this.ScrabbleFieldFactory.Field.isField(object);
  }

  getNeighbourTiles (options) {
    return this.getNeighbourField(options)
    .reduce((acc, field) => {
      // TODO check if Tile
      if (this.isField(field) && this.isTile(field.tile)) {
        acc.push(field.tile);
      }
      return acc;
    }, []);
  }

  hasNeighbourTile (options) {
    return this.getNeighbourField(options)
    .some(field => {
      return field.tile;
    });
  }
}

angular // eslint-disable-line no-undef
  .module("scrabbleBoardModule")
  .service("scrabbleFieldsTilesService", ScrabbleFieldsTilesService);
