/* jshint esversion: 6 */
const app = require("./server.start").app;
const expressStatic = require("./server.start").express.static;
const path = require("path");

/** https://stackoverflow.com/questions/35048686/difference-between-path-resolve-and-path-join-invocation */

app.use(expressStatic(path.join(__dirname, "../")));

app.get("/", (req,res) => res.sendFile(path.join(__dirname + "/index.html")));
app.get("*", (req,res) => res.sendFile(path.join(__dirname, "../index.html")));
