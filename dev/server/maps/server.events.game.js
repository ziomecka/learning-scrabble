/* jshint esversion: 6 */

const events = new Map([
  ["gameOpened", Symbol("gameOpened")]
]);

module.exports = {
  gameOpened: events.get("gameOpened")
};
