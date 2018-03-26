/* jshint esversion: 6 */
const UUID = require("uuid");

export default class Player {
  constructor(options) {
    options = Object(options);
    this.id = UUID();
    this.owner = {};
    ({id: this.owner.id, name: this.owner.name = "..."} = options);
  }

  get isOpened() {
    return !this.owner.id;
  }

  setOwner(data) {
    if (this.isOpened) {
      ({id: this.owner.id, name: this.owner.name} = data);
      return true;
    } else {
      return false;
    }
  }

  toJSON() {return {
    id: this.id,
    name: this.owner.name,
    owner: this.owner,
    isOpened: this.isOpened
  };}
}
