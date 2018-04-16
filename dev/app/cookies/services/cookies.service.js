/* jshint esversion: 6 */
// TODO remove listeners where neeeded
// TODO memory leaks
angular
  .module("cookiesModule")
  .service("cookiesService", [
    "socketService",
    "cookiesEvents",
    "cookiesNames",
    "$cookies",
  function (socketService, cookiesEvents, cookiesNames, $cookies) {
    /**
     * [listenReqCookies description]
     * @param  {[type]} options events{name, response, listen, callback}
     */
    this.listenReqCookies = options => {
      let {events} = options;
      events.forEach(event => {
        socketService.on(event.name, data => {
          let {cookies} = data;
          let answer = {};
          cookies.forEach(cookie => {
            answer[cookie] = $cookies.get(cookiesNames[cookie]);
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
    };

    this.listenSetCookies = options => {
      let {events} = options;
      events.forEach(event => {
        socketService.on(event.name, data => {
          data.forEach(cookie => {
            $cookies.put(cookie.name, cookie.value, cookie.time, cookie.path);
          });
        });
      });
    };

    /**
     * [sendCookie description]
     * @param  {[type]} options event
     * @return {[type]}         [description]
     */
    this.sendCookie = options => {
      let {event, cookies, callbacks} = options;
      socketService.emit(event, cookies);
      callbacks.forEach(callback => {
        socketService.on(callback.event, data => {
          callback.callback(data);
        });
      });
    };

    ///////////////////////////
    // Authorization cookies //
    ///////////////////////////
    this.listenReqAuthorizationCookies = options => {
      let {callback} = options;
      this.listenReqCookies({
        events: [{
          name: cookiesEvents.reqAuthorizationCookies,
          response: cookiesEvents.resAuthorizationCookies,
          listen: cookiesEvents.resAuthorizedCookiesSuccess,
          callback: data => {
            callback(data);
          }
        }]
      });
    };

    this.listenSetAuthorizationCookies = () => {
      this.listenSetCookies({
        events: [{
          name: cookiesEvents.setAuthorizationCookies
        }]
      });
    };

    this.sendAuthorizationCookies = options => {
      let {callbacks: {resolve, reject}} = options;
      let answer = {};
      ["login", "number"].forEach(cookie => {
        answer[cookie] = $cookies.get(cookiesNames[cookie]);
      });
      // TODO not here
      this.listenSetAuthorizationCookies();

      if(answer.login && answer.number) {
        this.sendCookie({
          "event": cookiesEvents.resAuthorizationCookies,
          "cookies": answer,
          "callbacks": [
            {
              "event": cookiesEvents.resAuthorizedCookiesFailure,
              "callback": data => {
                resolve(data);
              }
            },
            {
              "event": cookiesEvents.resAuthorizedCookiesSuccess,
              "callback": data => {
                reject(data);
              }
            }
          ]
        });
      } else {
        resolve();
      }
    };

    // TODO make a general method?
    this.removeAuthorizationCookies = () => {
      $cookies.remove("myscrabbleLogin");
      $cookies.remove("myscrabbleNumber");
    };

    this.removeListeners = options => {
      let {events = Object.keys(cookiesEvents)} = options;
      events.forEach(event => {
        socketService.off(event);
      });
    };
  }]);
