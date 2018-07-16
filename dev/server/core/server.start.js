/* jshint esversion: 6 */
const express = require("express");
// express.Router({strict: true});
const app = express();
// app.enable("strict routing");
const debug = require("debug")("express");
const name = "MyExpress";
const http = require("http");

const server = http.Server(app);

debug("booting %o", name);

module.exports = {
  app: app,
  server: server,
  express: express
};
