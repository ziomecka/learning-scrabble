/* jshint esversion: 6 */
angular
  .module("playerModule")
  .factory("playerFactory", [
    "rackFactory",
    (rackFactory) => {
      class Player {
        constructor (playerOptions) {
          ({name: this.name, time: this.time, id: this.id} = playerOptions);
          this.points = 0;
          this.rack = new rackFactory();
        }

        getsTile (tile) {
          tile.onRack = true;
          this.rack.getsTile(tile);
        }
      }
      return Player;
    }
  ]);
