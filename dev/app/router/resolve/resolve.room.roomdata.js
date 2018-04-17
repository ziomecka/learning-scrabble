/* jshint esversion: 6 */
// TODO correct
/** Gets room's details */
module.exports = (roomsSocket, $q, $stateParams) => {
  "ngInject";
  const deferred = $q.defer();
  const resolve = data => deferred.resolve(data);
  const reject = () => deferred.reject("Failed to get room's details");

  roomsSocket.getRoomDetails({
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
};
