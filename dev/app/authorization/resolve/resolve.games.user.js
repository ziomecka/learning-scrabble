/* jshint esversion: 6 */
/** Check if user is authorized.
    TODO can be removed?
    */
module.exports = [
  "authorizationUserData",
  "$q",
  (authorizationUserData, $q) => {
    const deferred = $q.defer();
    if (authorizationUserData.authorized) {
      deferred.resolve(authorizationUserData.login); // TODO correct?
    } else {
      deferred.reject("not authorized");
    }
    return deferred.promise;
  }
];
