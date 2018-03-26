/* jshint esversion: 6 */

const statusGame = new Map([
  ["waiting", Symbol("waiting")]
]);

module.exports.statusGame = {
  waiting: statusGame.get("waiting")
};
