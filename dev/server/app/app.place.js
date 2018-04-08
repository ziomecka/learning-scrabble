/* jshint esversion: 6 */
const UUID = require("uuid");

export default class Place {
  constructor(options) {
    options = Object(options);
    ({login: this.login, id: this.id = UUID()} = options);
  }

  get isOpened() {
    return !this.login;
  }

  setOwner(data) {
    if (this.isOpened) {
      ({login: this.login} = data);
      return this;
    } else {
      return false;
    }
  }

  toJSON() {
    return {
      id: this.id,
      login: this.login,
      isOpened: this.isOpened
    };
  }
}

module.exports = {
  Place: Place
};
