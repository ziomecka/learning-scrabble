module.exports = {
  "app": require("../app/app.socket"),
  "authorizationCookies": require("../app/cookies/authorization.cookies.socket"),
  "login": require("../app/authorization/authorization.socket"),
  "newuser": require("../app/newuser/newuser.socket"),
  "rooms": require("../app/rooms/rooms.socket"),
  "room": require("../app/room/room.socket")
};
