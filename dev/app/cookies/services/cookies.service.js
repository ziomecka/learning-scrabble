/* jshint esversion: 6 */
// TODO remove listeners where neeeded
// TODO memory leaks
class CookiesService {
  constructor (socketService, cookiesEvents, cookiesNames, $cookies) {
    "ngInject";
    this.socketService = socketService;
    this.cookiesEvents = cookiesEvents;
    this.cookiesNames = cookiesNames;
    this.$cookies = $cookies;
  }
  /**
  * [listenReqCookies description]
  * @param  {[type]} options events{name, response, listen, callback}
  */
  listenReqCookies (options) {
    let {events} = options;
    events.forEach(event => {
      this.socketService.on(event.name, data => {
        let {cookies} = data;
        let answer = {};
        cookies.forEach(cookie => {
          answer[cookie] = this.$cookies.get(this.cookiesNames[cookie]);
        });
        this.sendCookie({
          "event": event.response,
          "cookies": answer,
          "callbacks": [
            {
              "event": event.listen,
              "callback": event.callback
            }
          ]
        });
      });
    });
  }

  listenSetCookies (options) {
    let {events} = options;
    events.forEach(event => {
      this.socketService.on(event.name, data => {
        data.forEach(cookie => {
          this.$cookies.put(cookie.name, cookie.value, cookie.time, cookie.path);
        });
      });
    });
  }

  /**
  * [sendCookie description]
  * @param  {[type]} options event
  * @return {[type]}         [description]
  */
  sendCookie (options) {
    let {event, cookies, callbacks} = options;
    this.socketService.emit(event, cookies);
    callbacks.forEach(callback => {
      this.socketService.on(callback.event, data => {
        callback.callback(data);
      });
    });
  }

  ///////////////////////////
  // Authorization cookies //
  ///////////////////////////
  listenReqAuthorizationCookies (options) {
    let {callback} = options;
    this.listenReqCookies({
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

  listenSetAuthorizationCookies () {
    this.listenSetCookies({
      events: [{
        name: this.cookiesEvents.setAuthorizationCookies
      }]
    });
  }

  sendAuthorizationCookies (options) {
    let {callbacks: {resolve, reject}} = options;
    let answer = {};
    ["login", "number"].forEach(cookie => {
      answer[cookie] = this.$cookies.get(this.cookiesNames[cookie]);
    });
    // TODO not here
    this.listenSetAuthorizationCookies();

    if(answer.login && answer.number) {
      this.sendCookie({
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

  // TODO make a general method?
  removeAuthorizationCookies () {
    this.$cookies.remove("myscrabbleLogin");
    this.$cookies.remove("myscrabbleNumber");
  }

  removeListeners (options) {
    let {events = Object.keys(this.cookiesEvents)} = options;
    events.forEach(event => {
      this.socketService.off(event);
    });
  }
}

angular
  .module("cookiesModule")
  .service("cookiesService", CookiesService);
