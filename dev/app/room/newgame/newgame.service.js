/* jshint esversion: 6 */
angular
  .module("roomModule")
  .service("newgameService", [
    "scrabbleGameFactory",
    "$q",
    "socketService",
    "scrabbleEvents",
    function (scrabbleGameFactory, $q, socketService, scrabbleEvents) {
      this.createGame = data => {
        let deferred = $q.defer();

        /** The roomId will be provided by the authorizationService.
            What if player in the meantime changes the roomId????
            Authorization service should store the roomId only of the seated player!!!
            TODO
            */
        let emitOptions = {
          emit: {
            event: scrabbleEvents.reqCreateScrabble
          },
          events: [
            {
              eventName: scrabbleEvents.resCreateScrabbleSuccess, // TODO add event
              callback: data => {
                console.log(`Game with id: ${data.id} created.`);
                deferred.resolve(data);
              }
            }
          ]
        };
        socketHandlers.emitHandler(emitOptions);
        emitOptions = null;
      };

      this.getGame = data => {
        let deferred = $q.defer();

        /** The roomId will be provided by the authorizationService. */
        let emitOptions = {
          emit: {
            event: scrabbleEvents.reqGetScrabble
          },
          events: [
            {
              eventName: scrabbleEvents.resGetScrabbleSuccess, // TODO add event
              callback: data => {
                console.log(`Game with id: ${data.id} received.`);
                deferred.resolve(data);
              }
            }
          ]
        };
        socketHandlers.emitHandler(emitOptions);
        emitOptions = null;
      };
    }
  ]);
