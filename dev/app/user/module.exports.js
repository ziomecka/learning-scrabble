/* jshint esversion: 6 */
import * as mod from "./module";
let f = require.context("./", false, /^(?!((.*)?(controller|module))).*\.js$/);
f.keys().forEach(f);
f = require.context("./", true, /all\.js/);
f.keys().forEach(f);
f = null;


// import "./constants/user.states";
// import "./user.service";

module.exports = mod;
