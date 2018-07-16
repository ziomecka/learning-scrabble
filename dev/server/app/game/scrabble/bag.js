module.exports = class Bag {
  constructor (options) {
    return options;
  }
  toJSON () {
    return this;
  }
};
