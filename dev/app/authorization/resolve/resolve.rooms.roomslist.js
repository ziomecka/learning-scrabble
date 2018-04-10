/* jshint esversion: 6 */
/** Gets list of rooms. */
module.exports = [
  "roomsSocket",
  "$q",
  (roomsSocket, $q) => {
    const deferred = $q.defer();
    const resolve = data => deferred.resolve(data);
    roomsSocket.getAllRooms({callback: resolve});
    // TODO reject
    return deferred.promise;
  }
];
