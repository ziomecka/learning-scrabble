/* jshint esversion: 6 */
import * as mod from "./module";

/** Controller is nitialised via router resolve */
let f = require.context("./", false, /^(?!((.*)?(controller|module))).*\.js$/);
f.keys().forEach(f);
f = require.context("./", true, /all\.js/);
f.keys().forEach(f);
f = null;

module.exports = mod;
