/* jshint esversion: 6 */
class ScrabbleGameSocket {
  constructor (scrabbleGameFactory, $q, socketService, scrabbleEvents) {
    "ngInject";
    this.scrabbleGameFactory = scrabbleGameFactory;
    this.$q = $q;
    this.socketService = socketService;
    this.scrabbleEvents = scrabbleEvents;
  }

  createGame (data) {
    let deferred = this.$q.defer();

    /** The roomId will be provided by the authorizationService.
    What if player in the meantime changes the roomId????
    Authorization service should store the roomId only of the seated player!!!
    TODO
    */
    let emitOptions = {
      emit: {
        event: this.scrabbleEvents.reqCreateScrabble,
        data: {}
      },
      events: [
        {
          eventName: this.scrabbleEvents.resCreateScrabbleSuccess, // TODO add event
          callback: data => {
            console.log(`Game with id: ${data.id} created.`);
            deferred.resolve(data);
          }
        }
      ]
    };
    this.socketService.emitHandler(emitOptions);
    emitOptions = null;
    return deferred.promise;
  }

  getGame (data) {
    let deferred = this.$q.defer();

    /** The roomId will be provided by the authorizationService. */
    let emitOptions = {
      emit: {
        event: this.scrabbleEvents.reqGetScrabble,
        data: {}
      },
      events: [
        {
          eventName: this.scrabbleEvents.resGetScrabbleSuccess, // TODO add event
          callback: data => {
            console.log(`Game with id: ${data.id} received.`);
            deferred.resolve(data);
          }
        }
      ]
    };
    this.socketService.emitHandler(emitOptions);
    emitOptions = null;
    return deferred.promise;
  }
}

angular
.module("gameModule")
.service("scrabbleGameSocket", ScrabbleGameSocket);
