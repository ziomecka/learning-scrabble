/* jshint esversion: 6 */
import * as mod from "./rooms.module";
import "./rooms.service";
import "./rooms.socket";
import "./newroom/newroom.defaults";
import "./newroom/newroom.service";

/** Constants */
import "./constants/rooms.events";
import "./constants/rooms.messages";

module.exports = mod;
