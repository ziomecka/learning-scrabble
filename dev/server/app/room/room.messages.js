/* jshint esversion: 6 */
module.exports = {
  roomLeft: data => `Room ${data.roomId} has been left by ${data.socket} (user: ${data.login}).`
};
