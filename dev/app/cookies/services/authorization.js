/* jshint esversion: 6 */
/** Authorization cookies are in cookies module
    because authorization module is lazy loaded.
    */
class AuthorizationCookiesService {
  constructor (
    cookiesService,
    cookiesEvents,
    cookiesNames
  ) {
    "ngInject";

    Object.assign(this, {
      cookiesService,
      cookiesEvents,
      cookiesNames
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
    let {failure, success} = options;
    let answer = this.cookiesService.getCookies({
      cookies: this.cookiesNames.authorization
    });

    this.listenSetAuthorizationCookies();

    if(answer.login && answer.number) {
      this.cookiesService.sendCookie({
        "event": this.cookiesEvents.resAuthorizationCookies,
        "cookies": answer,
        "callbacks": [
          {
            "event": this.cookiesEvents.resAuthorizedCookiesFailure,
            "callback": data => {
              failure(data);
            }
          },
          {
            "event": this.cookiesEvents.resAuthorizedCookiesSuccess,
            "callback": data => {
              success(data);
            }
          }
        ]
      });
    } else {
      failure();
    }
  }

  removeAuthorizationCookies () {
    this.cookiesService.removeCookies({
      cookies: this.cookiesNames.authorization
    });
  }

  // removeListeners (options) {
  //   // TODO
  // }
}

angular // eslint-disable-line no-undef
  .module("cookiesModule")
  .service("authorizationCookiesService", AuthorizationCookiesService);
