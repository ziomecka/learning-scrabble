"login"/** Factories to be used. */
module.exports = {
  "start": [
    "app",
    "authorizationCookies"
  ],
  "home": [
    "app",
    "authorizationCookies"
  ],
  "cookies": [
    "app",
    "authorizationCookies"
  ],
  "login": [
    "app",
    "login"
  ],
  "newuser": [
    "app",
    "newuser",
    // "authorizationCookies"
  ],
  "games": [],
  "rooms": [
    "app",
    "rooms"
  ],
  "room": [
    "app",
    "room",
    "rooms"
  ],
  "waitsForGame": [
    "app",
    "room"
  ],
  "considersPlaying": [
    "app",
    "room"
  ],
  "error": [
    "app",
    "authorizationCookies",
    "login"
  ]
};
