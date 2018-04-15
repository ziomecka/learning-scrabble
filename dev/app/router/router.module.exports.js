/* jshint esversion: 6 */
import * as mod from "./router.module";

/** Config */
import "./router.config";

/** Run */
import "./router.errorhandler.run";

/** Services */
import "./services/router.go.service";

/** Constants */
import "./constants/router.states";

module.exports = mod;
