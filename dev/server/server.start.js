/* jshint esversion: 6 */
const express = require("express");
const app = express();
const debug = require("debug")("express");
const name = "MyExpress";
const http = require("http");

const server = http.Server(app);

debug('booting %o', name);

module.exports.app = app;
module.exports.server = server;
module.exports.express = express;
