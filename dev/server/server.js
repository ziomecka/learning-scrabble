/* jshint esversion: 6 */
const server = require("./server.start").server;
require("./server.socket");
require("./server.client");
require("./server.routing");


const port = process.env.PORT || 5000;

/** Start the server. */
server.listen(port, () => console.log(`Listening on ${server.address().port}`));
