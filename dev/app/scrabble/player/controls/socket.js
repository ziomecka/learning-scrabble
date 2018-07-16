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

  endRound (options) {
    options = Object(options);
    options.emit = {
      eventName: this.scrabbleEvents.reqEndRound,
      data: options.data
    };
    options.events = [
      {
        eventName: this.scrabbleEvents.resRoundEnded,
        callback: options.success,
        offEvents: [this.scrabbleEvents.resWordRejected]
      },
      {
        eventName: this.scrabbleEvents.resWordRejected,
        callback: options.failure,
        offEvents: [this.scrabbleEvents.resRoundEnded]
      }
    ];
    this.socketFactory.emitHandler(options);
    // this.listenStartRound();
    // this.listenOpponentWord();
    // this.listenOpponentExchange();
    // this.listenOpponentResign();
  }

  exchangeTiles (options) {
    let {data, success, failure} = Object(options);
    options.emit = {
      eventName: this.scrabbleEvents.reqExchangeTiles,
      data: data
    };
    options.events = [
      {
        eventName: this.scrabbleEvents.resExchangeTilesSuccess,
        callback: data => {
          success(data);
        }
      },
      {
        eventName: this.scrabbleEvents.resExchangeTilesFailure,
        callback: () => {
          failure();
        }
      }
    ];

    this.socketFactory.emitHandler(options);
    // this.listenStartRound();
    // this.listenOpponentWord();
    // this.listenOpponentExchange();
    // this.listenOpponentResign();
  }

  resign (options) {
    options = Object(options);
    options.emit = {
      eventName: this.scrabbleEvents.reqResign
    };
    options.events = [
      {
        eventName: this.scrabbleEvents.resResignSuccess,
        callback: () => {} //TODO
      }
    ];
    this.socketFactory.emitHandler(options);
  }

  /** User verifies opponent's word. */
  verifyWord (options) {
    options = Object(options);
    options.emit = {
      eventName: this.scrabbleEvents.reqVerifyWord,
      data: options.data
    };
    options.events = [
      {
        eventName: this.scrabbleEvents.resVerifyWordRejected,
        callback: options.success,
        offEvents: [this.scrabbleEvents.resVerifyWordAccepted]
      },
      {
        eventName: this.scrabbleEvents.resVerifyWordAccepted,
        callback: options.failure,
        offEvents: [this.scrabbleEvents.resVerifyWordRejected]
      }
    ];
    this.socketFactory.emitHandler(options);
  }

  /** User accepts opponent's word. */
  acceptWord (options) {
    options = Object(options);
    options.emit = {
      eventName: this.scrabbleEvents.reqAcceptWord,
      data: options.data
    };
    options.events = [
      {
        eventName: this.scrabbleEvents.resAcceptWordSuccess,
        offEvents: [this.scrabbleEvents.resVerifyWordAccepted]
      },
      {
        eventName: this.scrabbleEvents.resAcceptWordFailure,
        callback: options.failure,
        offEvents: [this.scrabbleEvents.resAcceptWordSuccess]
      }
    ];
    this.socketFactory.emitHandler(options);
  }
}

angular // eslint-disable-line no-undef
  .module("scrabbleControlsModule")
  .service("scrabbleControlsSocket", Service);
