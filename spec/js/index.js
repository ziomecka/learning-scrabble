/* jshint esversion: 6 */
/** requires all tests */
const tests = require.context('./', true, /\.spec.js$/);
tests.keys().forEach(tests);
