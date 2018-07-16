/* jshint esversion: 6 */
// /** Controller initialised in directive. */
// import "./directive";
// import "./service";
// import "./socket";

let f = require.context("./", false, /^(?!((.*)?(controller))).*\.js$/);
f.keys().forEach(f);
f = null;
