/* jshint esversion: 6 */
/** One object per each player.
    Handles incoming messages from the client.
    Performs actions in the game on behalf of the player.
    Sends messages containing updates of the state of the game to the client.
    */
const UUID = require("uuid");

class Player {
  constructor (options) {
    // TODO get default name from defaults based on options.lang
    ({name: this.name = "player", time: this.time} = options);
    this.points = 0;
    this.id = UUID();
  }
}

const allPlayers = {
  destroyPlayer: () => {
  }
};

module.exports = {
  Player: Player,
  allPlayers: allPlayers
};
