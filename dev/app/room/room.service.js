/* jshint esversion: 6 */
angular
  .module("roomModule")
  .service("roomService", [
    "roomSocket",
    "newgameService",
    "authorizationService",
    "newroomDefaults",
    "lodashFactory",
    "roomStates",
    function (roomSocket, newgameService, authorizationService, newroomDefaults, lodashFactory, roomStates) {
      /** Data shared with controller. */
      this.data = {
        player: {
          state: undefined,
          placeId: undefined,
          login: authorizationService.login
        },
        room: {
          id: undefined,
          places: [],
          users: [],
          numberPlaces: undefined,
          time: newroomDefaults.timeOptions[3] || 10,
          state: roomStates.waitingForPlayers
        },
        game: {
          id: undefined
        }
      };

      /** When initiated:
          - get room data,
          - find place on which user seats,
          - if there is no game create one,
          - listen to other users joingn the game.
          */
      this.initializeRoom = roomData => {
        let room = this.data.room;
        let game = this.data.game;
        let player = this.data.player;
        /** Get roomData (from the ui-router resolve):
            places, roomId, name, gameId
            */
        ({
          room: {
            places: room.places,
            id: room.id, // roomsId === gamesId
            numberPlaces: room.numberPlaces,
            name: room.name,
          } = {}, // TODO check if I set defaults correctly
          game: {
            id: game.id
          } = {} // TODO check if I set defaults correctly
        } = JSON.parse(roomData));

        /** Find place with my login */
        player.place = this.findPlaceIndex();

        /** If no game in the room then create game */
        if (game.id === undefined || game.id === null) {
          newgameService
          .createGame({
            roomId: room.id
          })
          .then(data => {
            this.data.game.id = data.id;
          });
        }

        /** Listen if users join the room */
        roomSocket.listenOtherUserJoinedRoom(
          {
            callbacks: {
              success: data => {
                this.data.room.users.push({"login": data.login});
                console.log(`User ${data.login} joined the room`);
              }
            }
          }
        );

        /** Listen if other users left the room. */
        roomSocket.listenOtherUserLeftRoom(
          {
            callbacks: {
              success: data => {
                let users = this.data.room.users;
                users.splice(users.indexOf(data.login), 1);
                console.log(`User ${data.login} left the room`);
                users = "";
              }
            }
          }
        );

        /** Listen if other users take places */
        roomSocket.listenOtherUserTookPlace(
          {
            callbacks: {
              success: data => {
                this.data.game.players.push({"login": data.login});
                this.data.room.places[data.placeId].
                console.log(`User ${data.login} took place ${data.placeId}`);
                // TODO
                // roomSocket.listenOtherUserGotUp
                // TODO set place's owner
              }
            }
          }
        );

        /** Listen if other players get up */
        roomSocket.listenOtherPlayerGotUp(
          {
              callbacks: {
                success: data => {
                  // TODO remove player
                  if (this.data.game.players.length <= 1) {
                    // TODO
                    // roomSocket.stopListenOtherUserGotUp
                  }
                }
              }
          }
        );

        /** Listen for changes in number of places */
        roomSocket.listenNumberPlacesChanged({
          callbacks: {
            success: data => {
              let places = this.data.room.places;
              if (data.action === "added") {
                this.data.room.places = [...places, ...data.places];
              } else if (data.action === "removed") {
                this.data.room.places = lodashFactory.differenceWith(places, data.places, (arrVal, othVal) => {
                  return arrVal.id === othVal.id;
                });
              }
              places = null;
            }
          }
        });

        /** Listen for changes in game's */
        roomSocket.listenTimeChanged(
          {
            callbacks: {
              success: data => {
                this.data.room.time = data.time;
              }
            }
          }
        );

        /** Collect garbage */
        room = null;
        game = null;
        player = null;
      };

      this.findPlaceIndex = () => {
        return this.data.room.places.findIndex((place) => place.login === this.data.player.login);
      };

      /////////////
      // OPTIONS //
      /////////////
      this.numberPlacesChanged = number => {
        roomSocket.changeNumberPlaces({
          roomId: this.data.room.id,
          number: number
        });
      };

      this.timeChanged = time => {
        roomSocket.changeTime({
          roomId: this.data.room.id,
          time: time
        });
      };

      ////////////
      // PLACES //
      ////////////
      this.takePlace = data => {
        roomSocket.takePlace({
          roomID: this.data.room.id,
          placeId: data.placeId,
          login: authorizationService.login,
          callbacks: {
            successTakePlace: data => {
              this.assignUserToPlace(data);
            },
          }
        });
      };

      this.assignUserToPlace = data => {
        let place = this.data.places.find(item => item.id === data.placeId);
        place.login = data.login;
        place.isOpened = false;
        this.data.player.placeId = data.placeId;
        this.data.players.push(data.login);
        place = null;
      };

      this.getUp = data => {
        let thisData = this.data;
        let placeIndex = this.findPlaceIndex();
        let place = thisData.room.places[placeIndex];
        place.login = undefined;
        place.isOpened = true;
        thisData.player.placeId = undefined;
        let playerIndex = thisData.players.findIndex(thisData.player.login);
        me.players.splice(playerIndex, 1);
        roomSocket.getUp({
          roomID: thisData.room.id,
          placeId: place.id,
          callbacks: {
            success: () => {}
          }
        });
        /** Collect garbage */
        thisData = null;
        place = null;
      };
    }
  ]);
