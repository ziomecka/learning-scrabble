/* jshint esversion: 6 */
// TODO remove listeners where neeeded
// TODO memory leaks

/** Authorization cookies are in cookies module
    because authorization module is lazy loaded.
    */
class AuthorizationCookiesService {
  constructor (
    cookiesService,
    cookiesEvents,
    authorizationCookiesNames
  ) {
    "ngInject";

    Object.assign(this, {
      cookiesService,
      cookiesEvents,
      authorizationCookiesNames
    });
  }

  listenReqAuthorizationCookies (options) {
    let {callback} = options;
    this.cookiesService.listenReqCookies({
      events: [{
        name: this.cookiesEvents.reqAuthorizationCookies,
        response: this.cookiesEvents.resAuthorizationCookies,
        listen: this.cookiesEvents.resAuthorizedCookiesSuccess,
        callback: data => {
          callback(data);
        }
      }]
    });
  }

  /** Listen authorization cookies. */
  listenSetAuthorizationCookies () {
    this.cookiesService.listenSetCookies({
      events: [{
        name: this.cookiesEvents.setAuthorizationCookies
      }]
    });
  }

  sendAuthorizationCookies (options) {
    let {callbacks: {resolve, reject}} = options;
    let answer = this.cookiesService.getCookies({
      cookies: this.authorizationCookiesNames
    });

    // TODO not here
    this.listenSetAuthorizationCookies();

    if(answer.login && answer.number) {
      this.cookiesService.sendCookie({
        "event": this.cookiesEvents.resAuthorizationCookies,
        "cookies": answer,
        "callbacks": [
          {
            "event": this.cookiesEvents.resAuthorizedCookiesFailure,
            "callback": data => {
              resolve(data);
            }
          },
          {
            "event": this.cookiesEvents.resAuthorizedCookiesSuccess,
            "callback": data => {
              reject(data);
            }
          }
        ]
      });
    } else {
      resolve();
    }
  }

  removeAuthorizationCookies () {
    this.cookiesService.removeCookies({
      cookies: this.authorizationCookiesNames
    });
  }

  removeListeners (options) {
    // TODO
  }
}

angular
  .module("cookiesModule")
  .service("authorizationCookiesService", AuthorizationCookiesService);
