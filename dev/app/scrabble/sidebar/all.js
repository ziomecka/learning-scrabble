/* jshint esversion: 6 */
let f = require.context("./", false, /\.js$/);
f.keys().forEach(f);
f = null;
