/* jshint esversion: 6 */
import * as mod from  "./room.module";

/** Services */
import "./room.service";
import "./room.socket";

/** Constants */
import "./constants/room.events";
import "./constants/player.states"; // TODO out
import "./constants/user.states";
import "./constants/room.states";
import "./constants/room.messages";

/** Directives */
import "./game/room.game.directive";
import "./sidebar/room.sidebar.directive";

/** Controls */
import "./controls/controls";

module.exports = mod;
