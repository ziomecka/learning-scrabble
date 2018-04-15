/* jshint esversion: 6 */
import * as mod from "./app.module";
import "./app.controller";
import "./app.socket";

/** Constants */
import "./constants/title/title";
import "./constants/app.events";

/** Tools */
import "./socket/socket.service";
import "./tools/lodash.factory";

const domain = "http://localhost:5000";
// angular.module("app").value("route", domain);

module.exports = mod;
