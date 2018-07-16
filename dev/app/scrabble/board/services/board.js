/* jshint esversion: 6 */
class Board {
  constructor(
    ScrabbleFieldFactory,
    ScrabbleTileFactory,
    scrabbleRackService,
    scrabbleFieldsTilesService,
    scrabblePointsService,
    scrabbleWordsService,
    scrabbleDDService,
    $rootScope
  ) {
    "ngInject";

    Object.assign(this, {
      ScrabbleFieldFactory,
      ScrabbleTileFactory,
      scrabbleRackService,
      scrabbleFieldsTilesService,
      scrabblePointsService,
      scrabbleWordsService,
      scrabbleDDService,
      $rootScope
    });

    /** 0 - tiles are placed vertically (column),
        1 - tiles are placed horizontally (row),
        -1 - incorrectly placed
        undefined - only one placed
        */
    this._direction = undefined;
    this._points = 0;
    this._tilesPlacedCorrectly = false;
    this._sides = [-1, 1];
    this._usedFields = [];
    this._words = [];
  }

  set words (words) {
    this._words = words;
  }

  get words () {
    return this._words;
  }

  get board () {
     return this._board;
   }

  set board (val) {
    this._board = val;
    this._onPropertyChanged("board", val);
  }

  _onPropertyChanged (propName, val) {
    if (propName === "board") {
      this.createRows(val);
    }
  }

  set points (points) {
    if (points === 0) {
      this._points = 0;
    }
  }

  get points () {
    this._points = this.scrabblePointsService.getPoints(this._words);
    return this._points;
  }

  get rows () {
    return this._rows;
  }

  get size () {
    return this.rows.length;
  }

  createRows (board) {
    this._rows = Array.from(Object(board.rows))
    .map((row, rowIndex) => {
      return row.map((field, columnIndex) => {
        field.id = `${columnIndex}_${rowIndex}`;
        return new this.ScrabbleFieldFactory.Field(field);
      });
    });

    /** TODO to be removed, just for coding. */
    this._rows[1][1].tile = {
      letter: "XX",
      points: "1"
    };
    this._rows[1][3].tile = {
      letter: "XZ",
      points: "9"
    };
    this._rows[1][2].tile = {
      letter: "XY",
      points: "8"
    };
    this._rows[1][4].tile = {
      letter: "XX",
      points: "7"
    };

    this._rows[2][2].tile = {
      letter: "A",
      points: "2"
    };
    this._rows[3][2].tile = {
      letter: "B",
      points: "3"
    };
    this._rows[4][2].tile = {
      letter: "C",
      points: "4"
    };

    this._rows[4][3].tile = {
      letter: "AA",
      points: "10"
    };
    this._rows[4][4].tile = {
      letter: "AB",
      points: "11"
    };
    this._rows[4][5].tile = {
      letter: "AC",
      points: "12"
    };
    this._rows[4][6].tile = {
      letter: "AC",
      points: "13"
    };
    this._rows[4][7].tile = {
      letter: "AD",
      points: "14"
    };

    this._rows[1][4].tile.isAlreadyPlayed = true;
    this._rows[1][3].tile.isAlreadyPlayed = true;
    this._rows[1][2].tile.isAlreadyPlayed = true;
    this._rows[1][1].tile.isAlreadyPlayed = true;
    this._rows[2][2].tile.isAlreadyPlayed = true;
    this._rows[3][2].tile.isAlreadyPlayed = true;
    this._rows[4][2].tile.isAlreadyPlayed = true;
    this._rows[4][3].tile.isAlreadyPlayed = true;
    this._rows[4][4].tile.isAlreadyPlayed = true;
    this._rows[4][5].tile.isAlreadyPlayed = true;
    this._rows[4][6].tile.isAlreadyPlayed = true;
    this._rows[4][7].tile.isAlreadyPlayed = true;
  }

  get usedFields () {
    if (this._tilesPlacedCorrectly !== undefined) {
      return this._usedFields;
    } else {
      if (this.rows) {
        this._usedFields = this.rows
        .reduce((acc, row) => {
          let fields = row.filter(field => {
            if (field && field.tile) {
              return field.tile.isPlacedOnBoard === true;
            }
          });
          if (fields.length) {
            acc.push(...fields);
          }
          return acc;
        }, [])

        return this._usedFields;
      } else {
        return [];
      }
    }
  }

  /** TODO NOT USED!! */
  get placedTiles () {
    return this.usedFields.map(field => {
      return field.tile;
    });
  }
  get numberUsedFields () {
    return this.usedFields.length;
  }

  get direction () {
    if (this._tilesPlacedCorrectly === undefined) {
      return this.checkDirection({
        onlyLast: false
      });
    } else {
      return this._direction;
    }
  }

  slots (direction) {
    if (this.numberUsedFields > 1) {
      // let direction = this.direction;
      // let sorted = this.usedFields
      // .sort(this.helpers(direction).compareFn);
      // console.log("sorted: " + JSON.stringify(sorted));
      // let reduced = sorted
      // .reduce(this.helpers(direction).reduceFn, []);
      // console.log("slots: " + JSON.stringify(reduced));
      // // return reduced;

      return this.usedFields
      .sort(this.helpers(direction).compareFn)
      .reduce(this.helpers(direction).reduceFn, []);
    } else {
      return [];
    }
  }

  get tilesPlacedCorrectly () {
    /** If no tiles placed. */
    if (this.numberUsedFields === 0) {
      return undefined;
    }

    let direction = this.direction;
    if (direction !== -1) {
      let touchesOtherWord = this.usedFields.some(field => {
        return this.scrabbleFieldsTilesService.getNeighbourTiles({
          "board": this,
          "field": field,
          "direction": 2
        })
        .some(tile => {
          return tile.isAlreadyPlayed;
        });
      }, this);

      if (touchesOtherWord) {
        let notEmptySlots;

        let slots = this.slots(direction);

        /** If there are slots, then
            check whether there are tiles on every field of slots' fields and
            check whether any of the newly placed tiles touches at least one letter already on the board.
            Else (there are no slots),
            check whether any of the newly placed tiles touches at least one letter already on the board.
            */
        if (slots.length) {
          let slotsEmpty = slots => {
            return slots.some(slot => {
              return (!this.isTile(slot.tile));
            }, this);
          };
          notEmptySlots = !slotsEmpty(slots);
        } else {
          notEmptySlots = true;
        }
        this._tilesPlacedCorrectly = notEmptySlots;
        /* eslint-disable no-console */
        if (notEmptySlots) {
          console.log("Tiles placed correctly: the word has no spaces and touches other word.");
        } else {
          console.warn("Tiles placed incorrectly: the word has spaces.");
        }
        /* eslint-enable no-console */
        slots = null;
      } else {
        this._tilesPlacedCorrectly = false;
        /* eslint-disable no-console */
        console.warn("Tiles placed incorrectly: the word does not touch other word.");
        /* eslint-enable no-console */
      }
    } else {
      this._tilesPlacedCorrectly = false;
      /* eslint-disable no-console */
      console.warn("Tiles placed incorrectly: tiles are scattered on the board.");
      /* eslint-enable no-console */
    }

    if (this._tilesPlacedCorrectly) {
      this.getWords();
    }
    return this._tilesPlacedCorrectly;
  }

  getWords () {
    this.words = this.scrabbleWordsService.getWords({
      usedFields: this.usedFields,
      board: this,
      direction: this.direction
    });
    // console.log("this.words: " + JSON.stringify(this.words));
  }

  placeTile (field) {
    let {id, _tile} = field;
    let Field = this.ScrabbleFieldFactory.Field;
    this.rows[Field.getRow(id)][Field.getColumn(id)].tile = _tile;
    _tile = null;
    Field = null;
    return true;
  }

  placeTiles (fields) {
    if (Array.isArray(fields)) {
      fields.forEach(field => {
        this.placeTile(field);
      });
    } else {
      throw Error("");
    }
  }

  // TODO can I get field?
  // TODO out?
  removeTile (options) {
    let {tile, field} = options;
    let id = tile.id;
    if (field === null || field === undefined) {
      let field = this.usedFields.find(field => {
        return field.tile.id === id;
      })
      if (field) { // TODO remove
        // field.tile.isPlacedOnBoard = false;
        field.tile = null;
      }
    }
    tile = null;
    field = null;
  }

  startDragTile (tile) {
    /** this._dragged stores field.
        Needed to remove tile on dragend.
        */
    this._dragged = this.scrabbleDDService.startDragTile({
      tile: tile,
      fields: this.usedFields,
      board: this
    });
  }

  endDropTile (options) {
    let {field} = options;
    let tile = this.scrabbleDDService.endDropTile({
      "dragged": this._draggged
    });
    let $rootScope = this.$rootScope;

    this._tilesPlacedCorrectly = undefined;

    if(!this.scrabbleRackService.removeTile(tile)) {
      this.removeTile({"tile": tile});
    }

    field.tile = tile;
    if (this.isTile(tile)) {
      tile.isPlacedOnBoard = true;
    }

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
      "dragged": this._dragged
    });

    this._newTile = true;
    this._tilesPlacedCorrectly = undefined;
    this.scrabbleDDService.dragged.tile.isPlacedOnBoard = true;
    this._dragged = null;
  }

  isTile (object) {
    return this.ScrabbleTileFactory.Tile.isTile(object);
  }

  isField (object) {
    return this.ScrabbleFieldFactory.Field.isField(object);
  }

  /** i === 0 - tiles are placed vertically (column),
      i === 1 - tiles are placed horizontally (row)
      */
  helpers (i) {
    if (i !== 1 && i !== 0) throw new Error("Wrong direction.");

    i = Number(!i);
    let directionName = this.getDirectionName(i);

    let compareFn = function (a, b) {
      return (a[directionName] - b[directionName]);
    };

    let sortTilesFn = function (a, b) {
      return (a[directionName] - b[directionName]);
    };

    let reduceFn = function (acc, item, index, arr) {
      if (arr[index + 1]) {
        let result = [];
        /** Distance between two board fields. */
        let j = arr[index + 1][directionName] - item[directionName];
        /** Get all fields (j) in the slot. */
        for (let m = 1; (j - m) > 0; m++) {
          let r = item.row;
          let c = item.column;
          /** If tiles are pleaced horizontally (Number(!i) === 1) then
              increase column.
              Else (tiels are placed vertially Number(!i) === 0) then
              increase row.
              */
          if (i === 1) {
            r += m;
          } else if (i === 0) {
            c += m;
          }

          result.push(this.rows[r][c]);
        }
        acc.push(...result);
      }
      return acc;
    }.bind(this);

    return {
      "compareFn": compareFn,
      "reduceFn": reduceFn,
      "sortTilesFn": sortTilesFn
    };
  }

  getDirectionName (direction) {
    if (direction === 1 || direction === 0) {
      return {
        1: "row",
        0: "column"
      }[direction];
    } else {
      return undefined;
    }
  }

  checkDirection (options) {
    let {
      fields = this.usedFields,
      direction = this._direction,
      onlyLast = true
    } = options;

    let len = fields.length;

    if (len === 1 || len === 0) {
      this._direction = undefined;
    } else {
      let notInOneDirection = options => {
        let {
          direction,
          fields
        } = Object(options);

        if (direction !== 1 && direction !== 0) {
          throw Error ("Wrong direction.");
        }

        if (fields.some(field => !this.isField(field))) {
          throw Error ("Incorrect fields.");
        }

        let directionName = this.getDirectionName(direction);

        let firstFieldCor = fields[0][directionName];

        return fields.some(field => {
          return (field[directionName] !== firstFieldCor);
        });
      };

      if (direction === 0 || direction === 1) {
        let directionName = this.getDirectionName(direction);

        /** Get first field's row or column */
        let firstFieldCor = fields[0][directionName];

        let areInOneDirection;

        if (onlyLast) {
          areInOneDirection = fields[len][directionName] === firstFieldCor;
        } else {
          areInOneDirection = !notInOneDirection({"direction": direction, "fields": fields});
        }
        this._direction = areInOneDirection? direction : -1;
      } else {
        this._direction = !notInOneDirection({"direction": 1, "fields": fields})? 1 :!notInOneDirection({"direction": 0, "fields": fields})? 0 : -1;
      }
      notInOneDirection = null;
    }
    // console.log("one direction: " + this._direction);
    return this._direction;
  }

  returnTilesOnRack () {
    let copy = [...this.usedFields];

    copy.forEach(field => {
      /** Place tile on rack. */
      this.scrabbleRackService.placeTile({
        "tile": field.tile
      });
      field.tile = null;
    });
    copy = null;
  }

  resign () {
    // this.points = 0;
    this.returnTilesOnRack();
    this.getWords();
  }

  exchangeTiles () {
    // this.points = 0;
    this.returnTilesOnRack();
    this.getWords();
  }

  acceptWord () {
    /** Change state of placed tiles. */
    this.usedFields.forEach(field => {
      field.tile.isAlreadyPlayed = true;
    });
  }


  rejectWord () {
    /** Remove tiles from board and put back on rack. */
    this.usedFields.forEach(field => {
      this.scrabbleRackService.placeTiles(field.tile);
      field.tile = null;
    });
  }
}

angular // eslint-disable-line no-undef
  .module("scrabbleBoardModule")
  .service("scrabbleBoardService", Board);
