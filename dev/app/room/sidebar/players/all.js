/* jshint esversion: 6 */
let f = require.context("./", false, /^(?!((.*)?(controller))).*\.js$/);
f.keys().forEach(f);
f = null;
// import "./directive";
// import "./service";
// import "./socket";
