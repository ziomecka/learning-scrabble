/* jshint esversion: 6 */
module.exports = {
  roomLeft: data => `Room ${data.roomId} has been left by ${data.socket} (user: ${data.login}).`,
  changeTimeSuccess: data => `Room ${data.roomId} has new time: ${data.time}`,
  changeTimeFailure: data => `Failed to change time in room ${data.roomId}.`,
  takePlaceSuccess: data => `User ${data.login} took place ${data.placeId} in room ${data.roomId}.`,
  takePlaceFailure: data => `User ${data.login} failed to take place ${data.placeId} in room ${data.roomId}.`,
  changeNumberPlacesSuccess: data => `Room ${data.roomId} has new number of places ${data.number}.`,
  changeNumberPlacesFailure: data => `Failed to change number of places in room ${data.roomId}.`,
  getUpRequest: data => `${data.login} asked to get up from place ${data.placeId} in room ${data.roomId}.`,
  getUpSuccess: data => `${data.login} got up from place ${data.placeId} in room ${data.roomId}.`,
  getUpFailure: data => `${data.login} failed to get from place ${data.placeId} in room ${data.roomId}.`,
  stateChanged: data => `Room ${data.roomId} changed state to ${data.state}.`,
  startSuccess: data => `Player ${data.login} is ready to play in room ${data.roomId}.`,
  startFailure: data => `Failed to set player ${data.login} as ready to play in room ${data.roomId}.`
};
