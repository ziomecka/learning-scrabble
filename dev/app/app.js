/* jshint esversion: 6 */
import * as mod from "./home/app.module";

/** Controllers */
/**Initialised in resolve */

/** Services */
import "./home/services/app.authorization.service";
import "./home/services/socket.service";
import "./home/services/app.socket";

/** Constants */
import "./home/constants/title.letters";
import "./home/constants/app.events";
import "./home/constants/app.globals";

/** Directives */
import "./home/directives/title.directive";

/** Factories */
import "./home/factories/lodash.factory";

const domain = "http://localhost:5000";
// mod.run($trace => $trace.enable());
// angular.module("app").value("route", domain);

module.exports = mod;
