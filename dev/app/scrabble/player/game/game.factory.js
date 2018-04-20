/* jshint esversion: 6 */
class ScrabbleGame {
  constructor (scrabbleSocket, playerFactory, $q, scrabbleGameOptions) {
    "ngInject";
    this.player = new playerFactory();
    this.opponents = [];
    this.scrabbleSocket = scrabbleSocket;
    this.playerFactory = playerFactory;
    this.$q = $q;
    // options.resolve();
  }

  // TODO not here because done once only by some players???
  prepare (options) {
    let deferred = this.$q.defer();

    const socketOptions = {
      success: data => {
        deferred.resolve(data);
      }
    };
    this.scrabbleSocket.createScrabble(socketOptions);
    return deferred.promise;
  }

  addOponent (options) {
  }

  removeOpponent () {
  }
}

const scrabbleGameFactory = () => {
  const start = () => {
    return new ScrabbleGame();
  };

  const destroy = () => {
    // TODO ?
  };

};

angular
  .module("gameModule")
  .service("scrabbleGameFactory", scrabbleGameFactory);
