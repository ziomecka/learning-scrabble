/* jshint esversion: 6 */
/** Authorize user via the cookies. */
module.exports = [
  "authorizationCookiesService",
  "authorizationService",
  "$q",
  "$timeout",
  "$transition$",
  "$stateParams",
  "authorizationStates",
  (authorizationCookiesService, authorizationService, $q, $timeout, $transition$, $stateParams, authorizationStates) => {
    if (!authorizationService.authorized) {
      const deferred = $q.defer();
      // TODO stop listnening when received
      authorizationCookiesService.sendAuthorizationCookies({
        callbacks: {
          resolve: () => {
            $timeout(() => {
              deferred.resolve();
              authorizationService.go({state: authorizationStates.authorization});
            }, 1000 * 1.5, false);
          },
          reject: data => {
            $timeout(() => {
              deferred.reject();
              authorizationService.authorize(data);
              /** If url:
                  - is other than 'home' state
                  - and includes roomId
                  pass the state (and roomId) to authorizationService.
                  Needed in case user is in room and e.g. refreshes page.
                  TODO: think if can be done in other place.
                  */
              const state = $transition$.to().name;
              const roomId = $stateParams.roomId;
              if (state !== authorizationStates.home) {
                const to = {"state": state};
                if (roomId) to.roomId = roomId;
                authorizationService.go(to);
              } else {
                authorizationService.go();
              }
            }, 1000 * 1.5, false);
          },
        }
      });
    }
  }
];
