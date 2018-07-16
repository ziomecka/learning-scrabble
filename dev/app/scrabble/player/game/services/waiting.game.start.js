// /* jshint esversion: 6 */
// class ScrabbleWaitingInitialTilesService {
//   constructor (
//     scrabbleEvents,
//     scrabbleStatesService,
//     socketFactory
//   ) {
//     "ngInject";
//
//     Object.assign(this, {
//       scrabbleEvents,
//       scrabbleStatesService,
//       socketFactory
//     });
//
//     this.listens = [
//       {
//         /* Player gets tiles */
//         name: scrabbleEvents.resInitialTiles,
//         callback: data => {
//           this.acceptTiles(data.tiles);
//           scrabbleStatesService.state = "waitingOpponentMove";
//         }
//       }
//     ];
//   }
//
//   listen () {
//     this.socketFactory.listen(this.listens);
//   }
//
//   stopListen () {
//     this.socketFactory.stopListen(this.listens);
//   }
//
// }
//
// angular // eslint-disable-line no-undef
//   .module("roomModule")
//   .service("scrabbleWaitingInitialTilesService", ScrabbleWaitingInitialTilesService);
