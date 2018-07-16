/* jshint esversion: 6 */
// import "./directive";
// import "./service";
let f = require.context("./", false, /^(?!((.*)?(controller))).*\.js$/);
f.keys().forEach(f);
f = null;
