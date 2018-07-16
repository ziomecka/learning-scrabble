/* jshint esversion: 6 */
const constant = {
  "authorization": {
    "login": "myscrabbleLogin",
    "number": "myscrabbleNumber"
  }
};

angular // eslint-disable-line no-undef
  .module("cookiesModule")
  .constant("cookiesNames", constant);
