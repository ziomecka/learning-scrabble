/* jshint esversion: 6 */
module.exports = {
  roomCreateSuccess: id =>`Room ${id} created.`,
  roomCreateFailure: e => `Room not created: ${e}.`,
  gameCreateSuccess: id =>`Game ${id} created.`,
  gameCreateFailure: e =>`Game not created: ${e}.`,
  joinRoomSuccess: data => `User ${data.login} joined room: ${data.roomId}.`
};
