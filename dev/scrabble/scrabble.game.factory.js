/* jshint esversion: 6 */
angular
.module("scrabbleModule")
.factory("scrabbleGameFactory", [
  "scrabbleSocket",
  "playerFactory",
  "$q",
  (scrabbleSocket, playerFactory, $q) => {

    class ScrabbleGame {
      constructor (options) {
        let {tiles: tiles} = options;
        this.player = new playerFactory({tiles: tiles});
        options.resolve();
      }

      drawTiles (options) {
        let deferred = $q.defer();
        scrabbleSocket.drawTiles({
          gameId: this.id,
          number: options.number,
          callbacks: {
            success: data => deferred.resolve(this.player.getTiles(data))
          }
        });
        return deferred.promise;
      }
    }

    const prepare = function(options) {
      let data = {};
      ({data: {id: data.id}} = options);
      let deferred = $q.defer();

      scrabbleSocket.createScrabble({
        callbacks: {
          success: data => {
            console.log(`resolved here`);
            deferred.resolve(data);
          },
          failure: data => {} // TODO
        },
        data: data
      });
      return deferred.promise;
    };

    const start = function(options) {
      options = Object(options);
      let deferred = $q.defer();
      deferred.resolve(new ScrabbleGame(options));
      return deferred.promise;
    };

    let destroy = null; // TODO ?

    return {
      prepare: prepare,
      start: options => {
        options = Object(options);
        start(options);
      }
    };
  }
]);
