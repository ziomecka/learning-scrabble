/* jshint esversion: 6 */
import * as mod from "./app/app.module";

/** Controllers */
/**Initialised in resolve */

/** Services */
import "./app/services/app.authorization.service";
import "./app/services/socket.service";
import "./app/services/app.socket";

/** Constants */
import "./app/constants/title.letters";
import "./app/constants/app.events";
import "./app/constants/app.globals";

/** Directives */
import "./app/directives/title.directive";

/** Factories */
import "./app/factories/lodash.factory";

const domain = "http://localhost:5000";
// mod.run($trace => $trace.enable());
// angular.module("app").value("route", domain);

module.exports = mod;
