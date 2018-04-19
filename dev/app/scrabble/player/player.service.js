/* jshint esversion: 6 */
class PlayerService {
  constructor (playerOptions, scrabbleSocket, lodashFactory) {
    "ngInject";

    this.scrabbleSocket = scrabbleSocket;
    this.lodashFactory = lodashFactory;

    ({name: this.name, time: this.time, id: this.id} = playerOptions);
    this.points = 0;
    this.tiles = [];

    this.getInitialTiles();
    this.listenRoundStarted();
  }

  getInitialTiles () {
    // this.scrabbleSocket.listenInitialTiles({
    //   callbacks: {
    //     initialTiles: data => this.getTiles(data)
    //   }
    // });
  }

  listenRoundStarted () {
    // this.scrabbleSocket.listenRoundStarted({
    //   callbacks: {
    //     roundStarted: data => this.roundStarted(data)
    //   }
    // });
  }

  getTiles(arr) {
    this.tiles = [...tiles, ...arr];
  }

  roundStarted () {
  }

  removeTiles (options) {
    let {property, value} = options;
    return this.lodashFactory.remove(tiles, (item, index, array) => {
      return item[property] === value;
    });
  }

  exchangeTiles (data) {
    this.scrabbleSocket.exchangeTiles({
      callbacks: {
        exchangedTiles: data => getTiles(data)
      },
      tiles: removeTiles({
        property: toBeExchanged,
        value: true
      })
    });
  }

  endRound (data) {
  }

  verifyWord () {
  }

}

angular
  .module("playerModule")
  .service("playerFactory", PlayerService);
