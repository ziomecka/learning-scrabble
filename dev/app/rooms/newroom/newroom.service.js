/* jshint esversion: 6 */
angular
  .module("roomsModule")
  .service("newroomService", [
    "roomsService",
    "roomsSocket",
    "authorizationService",
    "authorizationStates",
    function (roomsService, roomsSocket, authorizationService, authorizationStates) {
      // me.changeName = () => {
      //   if (!me.nameUnique) {
      //     me.nameUnique = true;
      //   }
      // };

      this.createRoom = (options) => {
        options.data = Object(Object(options).data);
        let {data: {name, numberPlaces}, callbacks: {success, failure}} = options;
        roomsSocket.createRoom({
          name: name,
          numberPlaces: numberPlaces,
          createGame: true, // game will be created
          joinRoom: true, // user will join the room
          callbacks: {
            success: data => {
              /** If the room is created:
                  - call success callback.
                  - transfer user to room's state.
                  */
              success(data);
              authorizationService.go({
                state: authorizationStates.room,
                roomId: data.roomId
              });
            }
          }
        });
      };

      this.createGame = () => {
      //   /** ask server to prepare data */
      //   let data = {data: {
      //     id: $scope.id
      //   }};
      //
      //   /** Ask to prepare the game */
      //   me.scrabble = scrabbleGameFactory.prepare(data);
      //
      //   me.scrabble.then(data => {
      //     console.log(`id: ${data.id}`);
      //     me.scrabble.id = data.id;
      //     me.ready = true;
      //   });
      };
    }
  ]);
