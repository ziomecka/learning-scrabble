/* jshint esversion: 6 */
import * as mod from  "./room.module";
import "./room.service";
import "./room.socket";
import "./newgame/newgame.service";

/** Constants */
import "./constants/room.events";
import "./constants/player.states"; // TODO out
import "./constants/user.states";
import "./constants/room.states";
import "./constants/room.messages";

/** Controls */
import "./controls/controls";

module.exports = mod;
