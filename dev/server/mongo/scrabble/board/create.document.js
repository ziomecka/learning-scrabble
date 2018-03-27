/* jshint esversion: 6 */
const ObjectID = require("mongodb").ObjectID;
const bonuses = require("./bonuses");

const create = options => {
  options = Object(options);
  let {size: size = 15, bonuses: bonuses} = options;
  const fields = [];
  let char;
  let id;
  let bonus;
  for (let i = 0; i < size; i++) {
    char = 96;
    for (let j = 0; j < size; j++) {
      id = `${String.fromCharCode(char++)}${j}`;
      // bonus = bonuses[id];
      fields.push({
        _id: id,
        bonus: 10, // TODO
        tile: null
      });
    }
  }

  return {
    _id: new ObjectID(),
    fields: fields
  };
};

module.exports = {
  create: create
};
