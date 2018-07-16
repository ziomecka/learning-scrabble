/* jshint esversion: 6 */
class Service {
  constructor (
    socketFactory,
    scrabbleEvents
  ) {
    "ngInject";

    Object.assign(this, {
      socketFactory,
      scrabbleEvents
    });
  }
}

angular // eslint-disable-line no-undef
  .module("scrabbleModule")
  .service("scrabbleSocket", Service);



  // createGame (options) {
  //   options = Object(options);
  //   options.emit = {
  //     eventName: this.scrabbleEvents.reqCreateScrabble
  //     // data: options.tiles
  //   };
  //   options.events = [
  //     {
  //       eventName: this.scrabbleEvents.resCreateScrabbleSuccess,
  //       callback: options.success,
  //       // offEvents: [this.scrabbleEvents.resWordRejected]
  //     },
  //     // {
  //     //   eventName: this.scrabbleEvents.resWordRejected,
  //     //   callback: options.failure,
  //     //   offEvents: [this.scrabbleEvents.resRoundEnded]
  //     // }
  //   ];
  //   this.socketFactory.emitHandler(options);
  //   this.listenRegisterOpponent();
  // }
