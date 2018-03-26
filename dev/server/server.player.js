/* jshint esversion: 6 */
/** One object per each player.
    Handles incoming messages from the client.
    Performs actions in the game on behalf of the player.
    Sends messages containing updates of the state of the game to the client.
    */
const UUID = require("uuid");

class Player {
  constructor (playerOptions) {
    ({name: this.name, time: this.time} = playerOptions);
    this.points = 0;
    this.id = UUID();
  }
}

const allPlayers = {
  destroyPlayer: () => {
  }
};

module.exports.Player = Player;
module.exports.allPlayers = allPlayers;
