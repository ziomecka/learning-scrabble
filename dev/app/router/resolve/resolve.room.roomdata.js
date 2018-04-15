/* jshint esversion: 6 */
// TODO correct
/** Gets room's details */
module.exports = [
  "roomSocket",
  "$q",
  "$stateParams",
  (roomSocket, $q, $stateParams) => {
    const deferred = $q.defer();
    const resolve = data => deferred.resolve(data);
    const reject = () => deferred.reject("Failed to get room's details");

    roomSocket.getRoomDetails({
      roomId: $stateParams.roomId,
      callbacks: {
        success: data => {
          /** Is the room new ? */
          data = JSON.parse(data);
          data.newroom = $stateParams.newroom;
          resolve(data);
        },
        failure: () => reject()
      }
    });
  return deferred.promise;
  }
];
