/* jshint esversion: 6 */
let f = require.context("./", false, /^(?!((.*)?(controller|module))).*\.js$/);
f.keys().forEach(f);
f = require.context("./", true, /all\.js/);
f.keys().forEach(f);
f = null;
