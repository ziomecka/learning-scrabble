/* jshint esversion: 6 */
class Service {
  constructor (
  ) {
    "ngInject";

    Object.assign(this, {
    });
  }

  get log () {
    return this._log;
  }

  set log (value) {
    this._log.push(value);
  }
}

angular // eslint-disable-line no-undef
  .module("scrabbleModule")
  .service("scrabbleLog", Service);
