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

        socketService.emit(scrabbleEvents.reqCreateScrabble, {roomId: data.roomId});
        this.listenCreateGame({
          callbacks: {
            success: data => {
              scrabbleGameFactory.prepare({
                data: {
                  id: data.id // TODO
                }
              });
            }
          }
        })
        .then(data => {
          console.log(`Game with id: ${data.id} created.`);
          deferred.resolve(data.id);
        });
        return deferred.promise;
      };

      this.listenCreateGame = options => {
        let {callbacks: {success}} = options;
        let deferred = $q.defer();
        let eventName = scrabbleEvents.reqCreateScrabbleSuccess;
        socketService.on(eventName, data => {
          deferred.resolve(data);
          socketService.off(eventName);
        });
        return deferred.promise;
      };
    }
  ]);
