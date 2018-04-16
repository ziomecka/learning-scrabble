/* jshint esversion: 6 */
angular
.module("scrabbleModule")
.factory("scrabbleGameFactory", [
  "scrabbleSocket",
  "playerFactory",
  "$q",
  (scrabbleSocket, playerFactory, $q) => {
    /** only one */
    class ScrabbleGame {
      constructor (options) {
        this.player = new playerFactory();
        this.opponents = [];
        // options.resolve();
      }

      // TODO not here because done once only by some players???
      prepare (options) {
        let deferred = $q.defer();

        const socketOptions = {
          success: data => {
            deferred.resolve(data);
          }
        };
        scrabbleSocket.createScrabble(socketOptions);
        return deferred.promise;
      }


      addOponent (options) {
      }
      removeOpponent () {
      }
    }


    const start = function(options) {
      options = Object(options);
      let deferred = $q.defer();
      deferred.resolve(new ScrabbleGame(options));
      return deferred.promise;
    };

    let destroy = null; // TODO ?

    return {
      start: options => {
        options = Object(options);
        start(options);
      }
    };
  }
]);
