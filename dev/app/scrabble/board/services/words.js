/* jshint esversion: 6 */
class ScrabbleWordsService {
  constructor (
    scrabbleFieldsTilesService,
    ScrabbleTileFactory,
    ScrabbleFieldFactory
  ) {
    "ngInject";

    Object.assign(this, {
      scrabbleFieldsTilesService,
      ScrabbleTileFactory,
      ScrabbleFieldFactory
    });

    this._words = [];
  }

  isTile (object) {
    return this.ScrabbleTileFactory.Tile.isTile(object);
  }

  isField (object) {
    return this.ScrabbleFieldFactory.Field.isField(object);
  }

  getWords (options) {
    this._words = [];
    let {
      usedFields,
      board,
      direction
    } = options;

    let scrabbleFieldsTilesService = this.scrabbleFieldsTilesService;


    let getFields = function (options) {
      let {
        field,
        direction,
        word = []
      } = options;

      if (this.isTile(field.tile)) {
        let checkOneSide = function (options) {
          let {field, side, word, direction} = options

          let getField = options => {
            let {field, side, direction} = options;
            return scrabbleFieldsTilesService.getNeighbourField({
              "board": board,
              "field": field,
              "direction": direction,
              "side": side
            });
          }

          let nextField = getField({
            "field": field,
            "side": side,
            "direction": direction
          })[0];

          while (this.isField(nextField) && this.isTile(nextField.tile)) {
            if (side === 1) {
              word.push(nextField);
            } else {
              word.unshift(nextField);
            }
            nextField = getField({
              "field": nextField,
              "side": side,
              "direction": direction
            })[0];
          }
          return word;
        }.bind(this);

        let before = [];
        let after = [];

        checkOneSide({
          "field": field,
          "word": before,
          "side": -1,
          "direction": direction
        });

        checkOneSide({
          "field": field,
          "word": after,
          "side": 1,
          "direction": direction
        });

        if (before.length || after.length) {
          word = word.concat(before, [field], after);
        }

        before = null;
        after = null;

        field = null;
        checkOneSide = null;
      }
      return word;
    }.bind(this);

    let directions;

    if (direction === 1 || direction === 0) {
      directions = [direction];
      /** Get the placed word.
          TODO can be improved: just get the alreadyPlayed tiles not the whole word.
          */
      let word = getFields({
        "field": usedFields[0],
        "direction": Number(!direction)
      });
      if (word.length) {
        this._words.push(word);
      }
      word = null;
    } else if (direction === undefined) {
      directions = [1, 0];
    } else {
      throw new Error ("Wrong direction.");
    }

    directions.forEach(direction => {
      usedFields.forEach(field => {
        let word = getFields({
          "field": field,
          "direction": direction
        });
        if (word.length) {
          this._words.push(word);
        }
        word = null;
      }, this);
    }, this);

    usedFields = null;
    board = null;
    scrabbleFieldsTilesService = null
    getFields = null;
    directions = null;

    return this._words;
  }

  getLetters (options) {
    let {words = this._words} = options;
    return words.map(word => {
      return this._getLetters(word);
    });
  }

  _getLetters (word) {
    return word.map(field => {
      return field.tile.letter;
    });
  }
}

angular // eslint-disable-line no-undef
  .module("scrabbleBoardModule")
  .service("scrabbleWordsService", ScrabbleWordsService);
