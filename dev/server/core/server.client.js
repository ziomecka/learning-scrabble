/* jshint esversion: 6 */
/** Client-side implementation of socket.io.
  I.e. script served by our io server at '/socket.io/socket.io.js
  */

const IO = require("socket.io-client");
// let url ="https://my-scrabble.herokuapp.com";
// if (process.env.NODE_ENV !== "production") url = "http://localhost:5000";
let url = "http://localhost:5000";
IO(url);
