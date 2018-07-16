/* jshint esversion: 6 */
const server = require("./core/server.start").server;
require("./core/server.socket");
require("./core/server.client");
require("./core/server.routing");

const port = process.env.PORT || 5000;

/** Start the server. */
server.listen(port, () => console.log(`Listening on ${server.address().port}`));
/** Flush redis */
// require("./app/authorization/authorization.redis").flush();
