/* jshint esversion: 6 */
// TODO remove listeners where neeeded
// TODO memory leaks
class CookiesService {
  constructor (
    socketFactory,
    cookiesEvents,
    $cookies
  ) {
    "ngInject";
    Object.assign(this, {
      socketFactory,
      cookiesEvents,
      $cookies
    });
  }
  /**
  * [listenReqCookies description]
  * @param  {[type]} options events{name, response, listen, callback}
  */
  listenReqCookies (options) {
    let {events} = options;
    events.forEach(event => {
      this.socketFactory.on(event.name, data => {
        let {cookies} = data;
        let answer = {};
        cookies.forEach(cookie => {
          answer[cookie] = this.$cookies.get(cookie);
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
      this.socketFactory.on(event.name, data => {
        data.forEach(cookie => {
          this.$cookies.put(cookie.name, cookie.value, cookie.time, cookie.path);
        });
      });
    });
  }

  getCookies (options) {
    let result = {};
    let {cookies} = options;
    Object.keys(cookies).forEach(cookie => {
      result[cookie] = this.$cookies.get(cookies[cookie]);
    });
    cookies = null;
    return result;
  }

  /**
  * [sendCookie description]
  * @param  {[type]} options event
  * @return {[type]}         [description]
  */
  sendCookie (options) {
    let {event, cookies, callbacks} = options;
    this.socketFactory.emit(event, cookies);
    callbacks.forEach(callback => {
      this.socketFactory.on(callback.event, data => {
        callback.callback(data);
      });
    });
  }

  removeCookies (options) {
    let {cookies} = options;
    Object.keys(cookies).forEach(cookie => {
      this.$cookies.remove(cookies[cookie]);
    });
    cookies = null;
  }

  removeListeners (options) {
    let {events = Object.keys(this.cookiesEvents)} = options;
    events.forEach(event => {
      this.socketFactory.off(event);
    });
  }
}

angular
  .module("cookiesModule")
  .service("cookiesService", CookiesService);
