/* jshint esversion: 6 */
angular
  .module("playerModule")
  .factory("playerFactory", [
    "scrabbleSocket",
    "lodashFactory",
    function (scrabbleSocket, lodashFactory) {
      class Player {
        constructor (playerOptions) {
          ({name: this.name, time: this.time, id: this.id} = playerOptions);
          this.points = 0;
          this.tiles = [];

          scrabbleSocket.listenInitialTiles({
            callbacks: {
              initialTiles: data => player.getTiles(data)
            }
          });
          scrabbleSocket.listenRoundStarted({
            callbacks: {
              roundStarted: data => player.roundStarted(data)
            }
          });
        }

        getTiles(arr) {
          tiles = [...tiles, ...arr];
        }

        roundStarted () {
        }

        removeTiles (options) {
          let {property, value} = options;
          return lodashFactory.remove(tiles, (item, index, array) => {
            return item[property] === value;
          });
        }

        exchangeTiles (data) {
          scrabbleSocket.exchangeTiles({
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

      return Player;
    }
  ]);
