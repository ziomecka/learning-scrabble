/* jshint esversion: 6 */
import * as mod from "./rooms.module";

/** Services */
import "./rooms.service";
import "./rooms.socket";
import "./newroom/newroom.service";
import "./newroom/newroom.socket";

/** Constants */
import "./newroom/newroom.defaults";
import "./constants/rooms.events";
import "./constants/rooms.messages";

module.exports = mod;
