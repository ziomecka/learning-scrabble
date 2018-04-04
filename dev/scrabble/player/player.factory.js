/* jshint esversion: 6 */
angular
  .module("playerModule")
  .factory("playerFactory", [
    "scrabbleTalk",
    "lodashFactory",
    function (scrabbleTalk, lodashFactory) {
      class Player {
        constructor (playerOptions) {
          ({name: this.name, time: this.time, id: this.id} = playerOptions);
          this.points = 0;
          this.tiles = [];

          scrabbleTalk.listenInitialTiles({
            callbacks: {
              initialTiles: data => player.getTiles(data)
            }
          });
          scrabbleTalk.listenRoundStarted({
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
          scrabbleTalk.exchangeTiles({
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
