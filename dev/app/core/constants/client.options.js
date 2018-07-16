/* jshint esversion: 6 */
/** Headers:
    x-app - required by server to stay connected,
    x-login and x-authorized - required to update the socket.
    */
const constant = data =>  {
  let {state, login, authorized, roomId} = Object(data);
  return {
    "transports": [
      "polling",
      "websocket"
    ],
    "connect": {
      "transportOptions": {
        "polling": {
          "extraHeaders": {
            "x-app": "scrabble",
            "x-state": "start",
            "x-login": login,
            "x-authorized": authorized,
            "x-reconnecting": false,
            "x-roomid": undefined
          }
        }
      }
    },
    "reconnect": {
      "transportOptions": {
        "polling": {
          "extraHeaders": {
            "x-app": "scrabble",
            "x-state": state,
            "x-login": login,
            "x-authorized": authorized,
            "x-reconnecting": true,
            "x-roomid": roomId
          }
        }
      }
    }
  };
};

angular // eslint-disable-line no-undef
  .module("app")
  .constant("clientOptions", constant);
