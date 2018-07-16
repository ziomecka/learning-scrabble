/* jshint esversion: 6 */
module.exports = class Place {
  constructor(options) {
    options = Object(options);
    ({id: this.id} = options);

    this.player = null;
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
      player: this.player
    };
  }
}
