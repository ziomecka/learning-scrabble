/* jshint esversion: 6 */
class PlayerService {
  constructor (playerOptions, scrabbleSocket, lodashFactory, tileFactory, rackService) {
    "ngInject";

    this.scrabbleSocket = scrabbleSocket;
    this.lodashFactory = lodashFactory;
    this.rack = rackService;

    ({name: this.name, time: this.time, id: this.id} = playerOptions);
    this.points = 0;
    this._tiles = [];

    // this.tiles = [
    //   {letter:"A", points: "7"},
    //   {letter:"B", points: "6"},
    //   {letter:"D", points: "5"},
    //   {letter:"E", points: "4"},
    //   {letter:"F", points: "3"},
    //   {letter:"G", points: "2"},
    //   {letter:"H", points: "1"}
    // ];

    this.getInitialTiles();
    this.listenRoundStarted();
  }

  get tiles () {
    return this.rack.tiles;
  }

  set tiles (tiles) {
    this.rack.tiles = Array.from(tiles);
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
