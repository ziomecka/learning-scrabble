/* jshint esversion: 6 */
let f = require.context("./", false, /^(?!((.*)?(controller|module))).*\.js$/);
f.keys().forEach(f);
f = require.context("./", true, /all\.js/);
f.keys().forEach(f);
f = null;

// import "./directive";
// import "./socket";
//
// import "./controls/all";
// import "./options/all";
// import "./players/all";
// import "./users/all";
