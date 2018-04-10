/* jshint esversion: 6 */
module.exports = {
  roomDetailsRequested: data => `Room ${data.roomId} details requested by socket ${data.socket} (user: ${data.login}).`,
  roomDetailsSent: data => `Room ${data.roomId} details have been sent to socket ${data.socket} (user: ${data.login}).`,
  roomLeft: data => `Room ${data.roomId} has been left by ${data.socket} (user: ${data.login}).`
};
