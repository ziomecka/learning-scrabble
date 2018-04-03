/* jshint esversion: 6 */
const ObjectID = require("mongodb").ObjectID;
const bonuses = require("./bonuses");
const findKey = require("lodash/findkey");

const create = options => {
  options = Object(options);
  let {size: size = 15, lang: lang} = options;
  const fields = [];
  let char;
  let id;
  let bonus = bonuses[lang];
  let b;

  for (let i = 0; i < size; i++) {
    /** start from 'a' */
    char = 97;
    for (let j = 0; j < size; j++) {
      id = `${String.fromCharCode(char++)}${i + 1}`;
      b = findKey(bonus, arr => arr.includes(id));

      fields.push({
        "_id": id,
        "bonus": b,
        "tile": null
      });
    }
  }

  return fields;
};

module.exports = {
  create: create
};
