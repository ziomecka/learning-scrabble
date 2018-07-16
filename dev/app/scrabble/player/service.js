/* jshint esversion: 6 */
class Service {
  constructor (
    scrabblePlayerOptions,
    lodashFactory,
    scrabbleRackService
  ) {
    "ngInject";

    Object.assign(this, {
      lodashFactory,
      scrabbleRackService
    });

    ({login: this.login, time: this.time, id: this.id} = scrabblePlayerOptions);
    this.points = 0;

    this.tiles = [];
    // this.tiles = [
    //   {letter: "A", points: "7"},
    //   {letter: "B", points: "6"},
    //   {letter: "D", points: "5"},
    //   {letter: "E", points: "4"},
    //   {letter: "F", points: "3"},
    //   {letter: "G", points: "2"},
    //   {letter: "H", points: "1"}
    // ];
  }

  get tiles () {
    return this.scrabbleRackService.tiles;
  }

  set tiles (tiles) {
    this.scrabbleRackService.tiles = Array.from(tiles);
  }

  removeTiles (options) {
    let {property, value, tiles} = options;
    return this.lodashFactory.remove(tiles, item => {
      return item[property] === value;
    });
  }
}

angular // eslint-disable-line no-undef
  .module("scrabblePlayerModule")
  .service("scrabblePlayerService", Service);
