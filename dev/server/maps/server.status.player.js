/* jshint esversion: 6 */

const statusPlayer = new Map([
  ["opened", Symbol("opened")],
  ["joined", Symbol("joined")]
]);

module.exports.statusPlayer = {
  opened: statusPlayer.get("opened"),
  joined: statusPlayer.get("joined")
};
