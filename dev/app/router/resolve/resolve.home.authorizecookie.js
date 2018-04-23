/* jshint esversion: 6 */
/** Authorize user via the cookies. */
module.exports = (
  authorizationCookiesService,
  authorizationService,
  $q,
  $timeout,
  $transition$,
  $stateParams,
  routerStates,
  userData,
  routerGoService
) => {
  "ngInject";
  if (!userData.authorized) {
    const deferred = $q.defer();
    // TODO stop listnening when received
    /** Cookies authorization is initailised by client */
    authorizationCookiesService.sendAuthorizationCookies({
      callbacks: {
        resolve: () => {
          // TODO out?
          $timeout(() => {
            deferred.resolve();
            routerGoService.go({state: routerStates.authorization});
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
            if (state !== routerStates.home) {
              const to = {"state": state};
              if (roomId) to.roomId = roomId;
              routerGoService.go(to);
            } else {
              routerGoService.go();
            }
          }, 1000 * 1.5, false);   // TODO out?
        },
      }
    });
  }
};
