/* jshint esversion: 6 */
angular
.module("scrabbleModule")
.factory("scrabbleGameFactory", [
  "scrabbleTalk",
  (scrabbleTalk) => {
    class ScrabbleGame {
      constructor (options) {
        let {tiles: tiles} = options;
        me.player = playerFactory({tiles: tiles});
      }
    }

    const prepare = options => {
      scrabbleTalk.createScrabble({
        callbacks: {
          scrabbleCreated: data => data // TODO
        }
      });
    };

    let destroy = null; // TODO ?

    return {
      prepare: prepare,
      start: options => new ScrabbleGame(options)
    };
  }
]);
