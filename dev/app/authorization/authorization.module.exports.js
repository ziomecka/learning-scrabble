/* jshint esversion: 6 */
import * as mod from "./authorization.module";

/** Services */
import "./services/authorization.login";
import "./services/authorization.service";
import "./services/authorization.socket";

/** Constants */
import "./constants/authorization.globals";
import "./constants/authorization.events";

/** Controllers */
/** Initialised via router resolve */

module.exports = mod;
