/* jshint esversion: 6 */
module.exports = {
  roomCreateSuccess: id =>`Room ${id} created.`,
  roomCreateFailure: err => `Room not created: ${err}.`,
  gameCreateSuccess: id =>`Game ${id} created.`,
  gameCreateFailure: err =>`Game not created: ${err}.`,
  joinRoomSuccess: data => `User ${data.login} joined room: ${data.roomId}.`,
  roomDetailsRequested: data => `Room ${data.roomId}, ${data.collection} details requested by socket ${data.socket} (user: ${data.login}).`,
  joinedRoomDetailsSuccess: data => `Room ${data.roomId}, ${data.state} details have been sent to socket ${data.socket} (user: ${data.login}).`,
  joinedRoomDetailsFailure: data => `Failed to send room ${data.roomId} details to socket ${data.socket} (user: ${data.login}, error: ${data.err}).`
};
