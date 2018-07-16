/* jshint esversion: 6 */
module.exports = {
  connectionSuccess: data => `New connection from ${data.address} with header: ${data.xApp}. Socket id: ${data.socketId}`,
  connectionFailure: data => `Disconnetcting socket ${data.socketId} from ${data.address} due to incorrect x-app header: ${data.xApp}.`,
  disconnectionSuccess: data => `User ${data.socketId} disconnected.`,
  reconnectSuccess: data => `User ${data.login}, ${data.socketId} reconnected.`,
  listen: data => `Listen to ${data.state} from ${data.socketId}`,
  stopListen: data => `Stop listening to ${data.state} from ${data.socketId}`,
  rejoinRoomSuccess: data => `User ${data.data} rejoined room ${data.roomId}. Socket ${data.socketId}`,
  joinedRoom: data => `User ${data.socketId} joined: ${data.roomName}.`,
  leftRoom: data => `User ${data.socketId} left: ${data.roomName}.`
};
