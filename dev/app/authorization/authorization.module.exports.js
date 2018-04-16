/* jshint esversion: 6 */
import * as mod from "./authorization.module";

/** Services */
import "./services/authorization.login";
import "./services/authorization.socket";

/** Constants */
import "./constants/authorization.events";
import "./constants/authorization.states";

/** Controllers */
/** Initialised via router resolve */

module.exports = mod;
