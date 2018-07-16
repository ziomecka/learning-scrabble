/* jshint esversion: 6 */
module.exports = {
  askPlayerStart: data => `Ask players in room: ${data.roomId} to start the game.`,
  allRoomsSuccess: data => `All rooms sent to socket: ${data.socketId}.`,
  allRoomsFailure: data => `Failed to send all rooms to socket: ${data.socketId}, error: ${data.err}.`
};
